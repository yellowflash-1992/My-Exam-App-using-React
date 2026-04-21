import React from 'react';
import { FaFlag, FaCheckCircle, FaLayerGroup } from 'react-icons/fa';

const QuestionNavigator = ({ total, current, answers, flagged, jumpToQuestion, themeColor = "rose" }) => {
  
  // Calculate stats for the header
  const answeredCount = Object.keys(answers).length;
  //const flaggedCount = flagged.length;
  const progressPercentage = (answeredCount / total) * 100;

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Progress Overview */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</p>
            <h4 className="text-xl font-bold text-slate-700">{answeredCount} <span className="text-sm text-slate-400 font-medium">/ {total} Solved</span></h4>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-${themeColor}-100 text-${themeColor}-700`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {/* Progress Bar Mini */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-${themeColor}-500 transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Interactive Grid */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {Array.from({ length: total }).map((_, i) => {
          const isCurrent = i === current;
          const isAnswered = answers[i] !== undefined && answers[i] !== null;
          const isFlagged = flagged.includes(i);

          // Dynamic Styling Logic
          let baseClass = "h-10 w-full rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center relative ";
          
          if (isCurrent) {
            baseClass += `bg-${themeColor}-600 text-white shadow-lg shadow-${themeColor}-200 ring-2 ring-offset-2 ring-${themeColor}-400 scale-110 z-10 `;
          } else if (isFlagged) {
            baseClass += "bg-amber-100 text-amber-700 border-2 border-amber-300 ";
          } else if (isAnswered) {
            baseClass += `bg-${themeColor}-50 text-${themeColor}-700 border-2 border-${themeColor}-100 `;
          } else {
            baseClass += "bg-white text-slate-400 border-2 border-slate-50 hover:border-slate-200 hover:text-slate-600 ";
          }

          return (
            <button
              key={i}
              onClick={() => jumpToQuestion(i)}
              className={baseClass}
            >
              {i + 1}
              
              {/* Mini Indicators */}
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {isFlagged && !isCurrent && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full border border-white shadow-sm" />
                )}
                {isAnswered && !isCurrent && (
                  <div className={`w-2 h-2 bg-${themeColor}-500 rounded-full border border-white shadow-sm`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Visual Legend */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Legend</p>
        
        <div className="grid grid-cols-2 gap-y-2">
          <LegendItem icon={<div className={`w-3 h-3 rounded bg-${themeColor}-600`} />} label="Active" />
          <LegendItem icon={<div className={`w-3 h-3 rounded bg-${themeColor}-50 border border-${themeColor}-200`} />} label="Answered" />
          <LegendItem icon={<div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />} label="Flagged" />
          <LegendItem icon={<div className="w-3 h-3 rounded bg-white border border-slate-200" />} label="Untouched" />
        </div>
      </div>
    </div>
  );
};

// Sub-component for the legend items
const LegendItem = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
  </div>
);

export default QuestionNavigator;