// Components/LoginModal.jsx
import { useContext, useState } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';

// We pass onStart as a prop from LandingPage
export default function LoginModal({ onStart }) {
  // Use the exact state names from your Context (showLoginModal)
  const { userName, setUserName, showLoginModal, setShowLoginModal } = useContext(ExamStateContext);

  const [existingSession, setExistingSession] = useState(null);

  const navigate = useNavigate();

 if (!showLoginModal) return null;

  const handleAction = () => {
    const enteredName = userName.trim();
    if (enteredName.length <= 2) {
      alert("Please enter your full name to proceed.");
      return;
    }

    localStorage.setItem("exam_user", enteredName);

  // LOOK for a ghost session
 const sessionKey = Object.keys(localStorage).find(key => {
      if (!key.startsWith("jamb_exam_session_")) return false;
      try {
        const data = JSON.parse(localStorage.getItem(key));
        // Only count it as a session if it has questions and belongs to THIS user
        return data && data.questions?.length > 0 && 
               data.userName.toLowerCase() === enteredName.toLowerCase();
      } catch (e) { return false; }
    });

    if (sessionKey) {
      setExistingSession(sessionKey);
    } else {
      sessionStorage.setItem("exam_is_resumed", "false");
      setShowLoginModal(false); // Close the modal
      navigate("/select-subject");  
    }
  };

const handleResume = () => {
  // Ensure the subject extracted from the key is lowercased and trimmed
  const subject = existingSession
    .replace("jamb_exam_session_", "")
    .toLowerCase()
    .trim(); 

    sessionStorage.setItem("exam_is_resumed", "true");
    
  setShowLoginModal(false);
  navigate(`/exam/${subject}`);
};

const handleStartAfresh = () => {
    // 1. Wipe all previous exam data from disk
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("jamb_exam_session_")) {
        localStorage.removeItem(key);
      }
    });

    // 2. Set the flags correctly
    sessionStorage.setItem("exam_is_resumed", "false");
    setExistingSession(null); 

    // 3. CLOSE the modal first
    setShowLoginModal(false);

    // 4. REDIRECT to Dashboard (don't use onStart here)
    // This ensures they have to pick subjects before entering the exam page
    navigate("/select-subject");
};


  return (
    /* We use 'absolute' so it anchors to the <main> tag in LandingPage */
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-slate-900/20 backdrop-blur-md rounded-3xl">
      <div className="bg-white/90 backdrop-blur-2xl p-8 rounded-4xl border border-white shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
      {!existingSession ? (
          <>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Candidate Entrance</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter your name to access the portal.</p>
            <input 
              autoFocus
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction()}
              placeholder="Full Name"
              className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none mb-6 text-slate-700"
            />
            <div className="flex gap-3">
              <button 
              onClick={() => setShowLoginModal(false)} 
              className="flex-1 font-bold text-slate-400">Cancel</button>
              <button 
              onClick={handleAction} 
              className="flex-2 bg-blue-600 text-white h-14 rounded-2xl font-bold">
                Enter Portal
                </button>
            </div>
          </>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Resume Exam?</h2>
            <p className="text-slate-500 mb-8 text-sm">
              We found an unfinished exam session for you.
            </p>
            
            <div className="flex flex-col gap-3">
              <button onClick={handleResume} 
                className="w-full bg-emerald-600 text-white h-14 rounded-2xl font-bold shadow-lg">
                Resume Progress
              </button>
              <button onClick={handleStartAfresh} 
                className="w-full bg-slate-100 text-slate-500 h-14 rounded-2xl font-bold">
                Start New (Wipe Data)
              </button>
              <button 
                onClick={() => setExistingSession(null)} 
                className="text-slate-400 text-xs mt-2">← Back to login</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}