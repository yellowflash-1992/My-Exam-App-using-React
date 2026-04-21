// components/TimeWarningAside.jsx
import React from 'react';

export default function TimeWarning({ secondsLeft }) {
  if (secondsLeft > 10 || secondsLeft <= 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce">
      <div className="bg-white/80 backdrop-blur-md border-2 border-rose-500 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
        {/* Animated Icon */}
        <div className="bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center animate-pulse">
          <span className="font-bold">!</span>
        </div>
        
        <div>
          <p className="text-rose-700 font-bold text-sm">Hurry Up!</p>
          <p className="text-rose-600 text-xs font-medium">
            Exam ends in <span className="text-lg">{secondsLeft}</span> seconds
          </p>
        </div>
      </div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-rose-400/20 blur-xl -z-10 rounded-full" />
    </div>
  );
}