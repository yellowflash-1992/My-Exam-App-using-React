import { FaClock, FaBook, FaCheckCircle, FaExclamationCircle, FaTimes, FaLayerGroup } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function InstructionModal({ isOpen, onClose, onConfirm, config, subjects }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Question Logic
  const isFullTest = config.duration === 120;
  const englishCount = isFullTest ? 20 : 10;
  const otherCount = isFullTest ? 10 : 5;
  const totalQuestions = englishCount + (otherCount * (subjects.length - 1));

  const handleGoBackToSelect = () => {
    onClose();
    navigate('/select-subject');
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      {/* Added max-h and overflow-y-auto to prevent clipping on small screens */}
      <div className="bg-white rounded-4xl shadow-2xl max-w-md w-full overflow-y-auto max-h-screen animate-in fade-in zoom-in duration-200">
        
        {/* Compact Header */}
        <div className="relative bg-emerald-600 p-6 text-white text-center">
          <button
            onClick={onClose}
            className='absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all'
          >
            <FaTimes size={16} />
          </button>

          <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FaCheckCircle size={24} />
          </div>
          <h2 className="text-xl font-black">Ready to Start?</h2>
          <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold">Summary</p>
        </div>

        {/* Tightened Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Mode Indicator - Compact */}
          <div className="flex items-center justify-center gap-2 bg-slate-50 py-1.5 rounded-lg border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase">Mode:</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase">
              {isFullTest ? "Full Exam" : "Practice"}
            </span>
          </div>

          {/* Subjects Summary */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <FaLayerGroup className="text-emerald-500" /> Subjects
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-700 rounded-md text-xs font-bold border border-slate-200 capitalize">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid - Reduced padding */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 flex items-center gap-3">
              <FaClock className="text-blue-500" />
              <div>
                <p className="text-[9px] text-blue-500 font-black uppercase leading-none">Time</p>
                <span className="text-lg font-black text-blue-900">{config.duration}m</span>
              </div>
            </div>
            
            <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 flex items-center gap-3">
              <FaBook className="text-purple-500" />
              <div>
                <p className="text-[9px] text-purple-500 font-black uppercase leading-none">Items</p>
                <span className="text-lg font-black text-purple-900">{totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Warning Note - Smaller text */}
          <div className="flex gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-800 text-[11px] leading-snug">
            <FaExclamationCircle className="shrink-0 text-amber-500" size={14} />
            <p>
              Timer starts immediately. <b>No pauses allowed.</b> Ensure your connection is stable.
            </p>
          </div>
        </div>

        {/* Action Buttons - More compact */}
        <div className="px-6 pb-6 flex gap-3">
          <button 
            onClick={handleGoBackToSelect}
            className="flex-1 py-3 text-slate-500 text-sm font-bold hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
          >
            Go Back
          </button>

          <button 
            onClick={onConfirm}
            className="flex-[1.5] py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}