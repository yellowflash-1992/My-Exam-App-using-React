export default function QuestionNavigator({
  total,
  current,
  answers,
  flagged,
  jumpToQuestion
}) {
  return (
    // Reduced padding from p-8 to p-4 to save space in the sidebar
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
        Question Navigator
      </h3>

      {/* Force exactly 5 columns on all screens */}
      <div className="grid grid-cols-5 gap-2 justify-items-center">
        {Array.from({ length: total }, (_, index) => {
          const isAnswered = answers[index] !== undefined;
          const isFlagged = flagged.includes(index);
          const isCurrent = index === current;

          // Standard JAMB colors: Blue for current, Green for answered, Grey for unvisited
          let style = "bg-slate-100 text-slate-400"; // Default

          if (isAnswered) style = "bg-emerald-500 text-white shadow-sm";
          if (isFlagged) style = "bg-amber-400 text-white shadow-sm";
          if (isCurrent) style = "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-100";

          return (
            <button
              key={index}
              onClick={() => jumpToQuestion(index)}
              // Changed w-10 to w-9 to ensure 5 fit comfortably in a small sidebar
              className={`w-9 h-9 rounded-lg text-xs font-black transition-all active:scale-90 ${style}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Simplified Legend for space */}
      <div className="grid grid-cols-2 gap-y-2 mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold uppercase text-slate-500">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
          Done
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-indigo-600 rounded-sm"></span>
          Current
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
          Flagged
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-slate-100 rounded-sm"></span>
          Open
        </span>
      </div>
    </div>
  );
}