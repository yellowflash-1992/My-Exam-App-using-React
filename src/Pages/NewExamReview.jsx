import React, { useContext } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCheck, FaTimes, FaQuestionCircle } from 'react-icons/fa';

export default function NewExamReview() {
    const { reviewData } = useContext(ExamStateContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* --- Sticky Header --- */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate('/exam-end')} className="flex items-center gap-2 text-slate-600 font-bold">
                    <FaChevronLeft /> Back to Results
                </button>
                <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Question Review</h1>
                <div className="w-20"></div> {/* Spacer */}
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-6">
                {reviewData.length > 0 ? (
                    reviewData.map((item, index) => (
                        <div key={index} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Subject Badge */}
                            <div className="px-6 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest inline-block rounded-br-2xl">
                                {item.subject}
                            </div>
                            
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex gap-3">
                                    <span className="text-rose-500">Q{index + 1}.</span> 
                                    {item.prompt}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {item.options.map((opt, optIdx) => {
                                        const isCorrect = optIdx === item.answer;
                                        const isUserSelection = optIdx === item.userAnswer;
                                        
                                        let statusClass = "border-slate-100 bg-slate-50 text-slate-500";
                                        if (isCorrect) statusClass = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md";
                                        if (isUserSelection && !isCorrect) statusClass = "border-rose-500 bg-rose-50 text-rose-700";

                                        return (
                                            <div key={optIdx} className={`p-4 rounded-2xl border-2 font-medium flex justify-between items-center ${statusClass}`}>
                                                <span>{opt}</span>
                                                {isCorrect && <FaCheck className="text-emerald-600" />}
                                                {isUserSelection && !isCorrect && <FaTimes className="text-rose-600" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Feedback Footer */}
                                <div className={`mt-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${item.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {item.isCorrect ? "Correctly Answered" : `Incorrect. The correct answer was: ${item.options[item.answer]}`}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <FaQuestionCircle size={50} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium">No review data available. Please complete an exam first.</p>
                    </div>
                )}
            </main>
        </div>
    );
}