import { useContext } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const { reviewData } = useContext(ExamStateContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-800">Review Corrections</h1>
        <button onClick={() => navigate("/exam-end")} className="text-blue-600 font-bold">Done</button>
      </div>

      <div className="space-y-6">
        {reviewData.map((item, index) => (
          <div key={index} className={`p-6 rounded-2xl border-2 ${item.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
            <div className="flex justify-between gap-4 mb-4">
               <span className="font-bold text-slate-400">Question {index + 1}</span>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                 {item.isCorrect ? 'Correct' : 'Incorrect'}
               </span>
            </div>
            
            <p className="text-lg font-semibold text-slate-800 mb-4">{item.prompt}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.options.map((opt, optIndex) => {
                const isCorrectOption = optIndex === item.answer;
                const isUserChoice = optIndex === item.userAnswer;

                let borderStyle = "border-slate-200 text-slate-500";
                if (isCorrectOption) borderStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";
                if (isUserChoice && !isCorrectOption) borderStyle = "border-rose-500 bg-rose-50 text-rose-700 font-bold";

                return (
                  <div key={optIndex} className={`p-3 border-2 rounded-xl text-sm ${borderStyle}`}>
                    {opt}
                    {isUserChoice && <span className="ml-2 italic text-[10px]">(Your Answer)</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}