import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ duration, onTimeUp, storageKey = "jamb_exam_session" }) => {
  // 1. Initialize state from LocalStorage or default duration
  const [seconds, setSeconds] = useState(() => {
    const savedSession = localStorage.getItem(storageKey);
    if (savedSession) {
      const { timeLeft } = JSON.parse(savedSession);
      // If timeLeft is valid and greater than 0, use it
      if (timeLeft && timeLeft > 0) return timeLeft;
    }
    // Otherwise, start fresh (convert minutes to seconds)
    return duration * 60;
  });

  const timerRef = useRef(null);

  useEffect(() => {
    // 2. Start the interval
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        const newTime = prev - 1;

        // 3. Save progress to LocalStorage every second
        const sessionData = JSON.parse(localStorage.getItem(storageKey)) || {};
        localStorage.setItem(storageKey, JSON.stringify({
          ...sessionData,
          timeLeft: newTime
        }));

        if (newTime <= 0) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerRef.current);
  }, [onTimeUp, storageKey]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = seconds < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
      isLowTime ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <span className="text-[10px] font-black uppercase tracking-widest">Time Left</span>
      <span className="text-lg font-mono font-black">{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;