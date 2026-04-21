import { useContext, useMemo } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { useNavigate } from "react-router-dom";

export default function WaecLoginModal({ onStart }) {
  const {
    showWaecLoginModal,
    setShowWaecLoginModal,
    waecUserName,
    setWaecUserName
  } = useContext(ExamStateContext);

  const navigate = useNavigate();

  // 🧠 SMART DETECTION: Watches the input live.
  // It checks if the name typed matches the name saved in the "waec_exam_session" slip.
  const hasSession = useMemo(() => {
    if (!waecUserName || waecUserName.trim().length <= 2) return false;
    
    const raw = localStorage.getItem("waec_exam_session");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        // Ensure "John" matches "john"
        return data.userName?.toLowerCase() === waecUserName.trim().toLowerCase(); 
      } catch (e) { return false; }
    }
    return false;
  }, [waecUserName]);

  // 🚀 ACTION: User has an exam and wants to continue
 const handleResume = () => {
    setShowWaecLoginModal(false);
    const saved = JSON.parse(localStorage.getItem("waec_exam_session") || "{}");
    const firstSubject = saved.subjects?.[0]?.toLowerCase().split(" ")[0];
    
    if (firstSubject) {
        navigate(`/new-exam-page/${firstSubject}`);
    } else {
        // If session is corrupt, go to subject selection instead
        navigate("/new-select-subject");
    }
    
    if (onStart) onStart();
  };

  // 🔄 ACTION: User has an old exam but wants to wipe it and start over
  const handleStartFresh = () => {
    // 1. Destroy the old master slip
    localStorage.removeItem("waec_exam_session");
    
    // 2. Destroy any saved subject progress
    const subjects = ["mathematics", "english", "biology", "geography"]; // Add all your subjects here
    subjects.forEach(sub => localStorage.removeItem(`waec_progress_${sub}`));

    setShowWaecLoginModal(false);
    navigate("/new-select-subject");
    if (onStart) onStart();
  };

  // ✨ ACTION: Brand new user
  const handleProceed = () => {
    if (!waecUserName || waecUserName.trim().length <= 2) return;

    setShowWaecLoginModal(false);
    navigate("/new-select-subject");
    if (onStart) onStart();
  };

  if (!showWaecLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm border-t-4 border-rose-500 shadow-2xl">

        <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-rose-600 uppercase">
            WAEC / NECO
            </h2>
            <p className="text-slate-500 text-sm mt-1">Candidate Authentication</p>
        </div>

        <input
          type="text"
          placeholder="Enter Full Name..."
          value={waecUserName}
          onChange={(e) => setWaecUserName(e.target.value)}
          className="w-full border-2 border-slate-100 bg-slate-50 focus:bg-white p-4 rounded-xl mb-6 outline-none focus:border-rose-500 text-slate-700 font-bold transition-all placeholder:font-normal"
        />

        {/* Dynamic Buttons based on Smart Detection */}
        {hasSession ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl text-center mb-4">
                Active Session Detected
            </div>
            <button onClick={handleResume} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-200 active:scale-95">
              Resume Examination
            </button>
            <button onClick={handleStartFresh} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl transition-all active:scale-95">
              Start Fresh Exam
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
              <button 
                onClick={handleProceed} 
                disabled={!waecUserName || waecUserName.trim().length <= 2}
                className="w-full bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Log in
              </button>
          </div>
        )}

        <button
          onClick={() => setShowWaecLoginModal(false)}
          className="w-full text-slate-400 hover:text-slate-600 text-sm font-bold py-4 mt-2 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}