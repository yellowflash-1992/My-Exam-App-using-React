import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { SUBJECT_META } from "../Helpers/subjectMeta";
import { FaPlus, FaTimes } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import '../App.css';

export default function JambSubjectSelect() {
  const { selectedSubjects, setSelectedSubjects } = useContext(ExamStateContext);
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);

  const MAX_SUBJECTS = 4;

  // THE FIX: We use a Set to guarantee 'english' is ALWAYS in the array exactly once.
  // If the context is empty [], it becomes ["english"].
  // If the context is ["math", "physics"], it becomes ["english", "math", "physics"].
  // This completely stops the "Ghost English" bug.
  const subjects = Array.from(new Set(["english", ...(selectedSubjects || [])]));

  const selectedWithoutEnglish = subjects.filter(s => s !== "english");

  // We use Math.max to prevent the app from crashing if lengths get weird
  const slots = [
    "english",
    ...selectedWithoutEnglish,
    ...Array(Math.max(0, MAX_SUBJECTS - subjects.length)).fill(null)
  ];

  const handleAddSubject = (id) => {
    // Prevent adding duplicates
    if (subjects.length < MAX_SUBJECTS && !subjects.includes(id)) {
      setSelectedSubjects([...subjects, id]);
      setShowPicker(false);
    }
  };

  const handleProceed = () => {
    if (subjects.length === MAX_SUBJECTS) {
      // Sync the cleaned-up array back to context right before moving on
      setSelectedSubjects(subjects);
      navigate("/exam-config");
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modalBackdrop") setShowPicker(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto min-h-screen">
      {/* Header & Progress */}
      <div className="text-center mb-10">
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
          Step 1: Subject Selection
        </span>
        <h1 className="text-4xl font-black mt-4 mb-2 text-slate-800">
          Prepare for Success!
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          English is compulsory. Choose <strong className="text-blue-600">3 additional subjects</strong> to complete your JAMB profile.
        </p>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {slots.map((subjectId, index) => {
          if (subjectId) {
            const meta = SUBJECT_META[subjectId];
            if (!meta) return null; // Safety fallback
            const Icon = meta.icon;

            return (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 
                hover:border-blue-400 hover:shadow-2xl group ${meta.bg}`}
              >
                {/* LARGE REMOVE BUTTON */}
                {subjectId !== "english" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // FIX: Filter based on our clean 'subjects' array, not 'prev'
                      setSelectedSubjects(subjects.filter(s => s !== subjectId));
                    }}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-white text-red-500 rounded-full 
                    flex items-center justify-center shadow-xl hover:bg-red-500 hover:text-white 
                    transition-all duration-200 border-2 border-red-100 z-10"
                    title="Remove subject"
                  >
                    <IoMdClose size={24} />
                  </button>
                )}

                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-inner ${meta.color} bg-white/50`}>
                  <Icon size={32} className="group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="font-extrabold text-xl text-slate-800">{meta.name}</h3>
                
                <div className="mt-2">
                  {subjectId === "english" ? (
                    <span className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-bold uppercase">Compulsory</span>
                  ) : (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">Elective</span>
                  )}
                </div>
              </div>
            );
          }

          {/* Empty Add Slot */}
          return (
            <div
              key={index}
              onClick={() => setShowPicker(true)}
              className="p-8 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col
              items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 
              transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FaPlus size={24} className="text-slate-400 group-hover:text-blue-500 group-hover:rotate-90 transition-all" />
              </div>
              <p className="font-bold text-slate-400 group-hover:text-blue-500">Add Subject</p>
            </div>
          );
        })}
      </div>

      {/* Picker Modal */}
      {showPicker && (
        <div
          id="modalBackdrop"
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-800">Available Subjects</h2>
              <button 
                onClick={() => setShowPicker(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <FaTimes className="text-slate-500" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(SUBJECT_META).map(([id, meta]) => {
                if (subjects.includes(id) || id === "english") return null;
                const Icon = meta.icon;

                return (
                  <div
                    key={id}
                    onClick={() => handleAddSubject(id)}
                    className="flex items-center gap-4 p-4 mb-2 hover:bg-blue-50 rounded-2xl 
                    cursor-pointer transition-all border-2 border-transparent hover:border-blue-100 group"
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${meta.color} bg-white shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{meta.name}</p>
                      <p className="text-xs text-slate-400">Click to add to your list</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleProceed}
          disabled={subjects.length !== MAX_SUBJECTS}
          className={`group relative px-4 py-2 md:px-8 md:py-3 rounded-2xl 
            font-black text-sm md:text-lg shadow-xl transition-all active:scale-95 ${
            subjects.length === MAX_SUBJECTS
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {subjects.length === MAX_SUBJECTS ? "Generate Jamb Exam →" : `Select ${MAX_SUBJECTS - subjects.length} More to Start`}
        </button>
        <p className="mt-4 text-sm text-slate-400 font-medium italic">
          Total Selected: {subjects.length} / {MAX_SUBJECTS}
        </p>
      </div>
    </div>
  );
}