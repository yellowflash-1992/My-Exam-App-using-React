import { FaClock, FaBook, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function InstructionModal({ isOpen, onClose, onConfirm, config, subjects }) {
    const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoBack = ()=> {
    onClose();
    navigate('/select-subject');
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 
    backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden 
      animate-in fade-in zoom-in duration-200">
        
       

        {/* Header */}
        <div className="relative bg-emerald-600 p-6 text-white text-center">
         <button
        onClick={onClose}
         className='absolute top-3 right-4 z-20 p-2 rounded-full bg-slate-100 
        text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-all 
        duration-200'>
            <FaTimes size={18} />
        </button>

          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center
           mx-auto mb-3">
            <FaCheckCircle className="text-3xl" />
          </div>
          <h2 className="text-2xl font-black">Final Confirmation</h2>
          <p className="text-emerald-100 text-sm">Please review your exam settings below</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Subjects Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 
            flex items-center gap-2">
              <FaBook /> Selected Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 
                rounded-lg text-sm font-semibold border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Config Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase mb-1">Duration</p>
              <div className="flex items-center gap-2 text-blue-900">
                <FaClock />
                <span className="text-xl font-black">{config.duration} Mins</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-xs text-purple-600 font-bold uppercase mb-1">Questions</p>
              <div className="flex items-center gap-2 text-purple-900">
                <FaBook />
                <span className="text-xl font-black">{config.numQuestions} Total</span>
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100
           text-amber-800 text-sm">
            <FaExclamationCircle className="mt-1 shrink-0" />
            <p>Once you click <b>"Start Now"</b>, your timer will begin immediately. Ensure you
             have a stable internet connection.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 flex gap-3">
            <div className='flex-1 relative group'>
              <span className='absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800
              text-white text-[10px] py-1 px-2 rounded opacity-0 
              group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap
              shadow-lg'>
                Back to 'Select Subject' Page
                <span className='absolute top-full left-1/2 -translate-x-1/2 border-4
                 border-transparent border-t-slate-800'></span>
              </span>

          <button 
            onClick={handleGoBack}
            className="w-full text-slate-500 font-bold hover:bg-slate-200 rounded-xl 
            transition-all px-4 py-3 text-sm border border-slate-300"
          >
            Go Back
          </button>
            </div>

          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl 
            shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95
             transition-all"
          >
            Start Now
          </button>
          
        </div>
      </div>
    </div>
  );
}