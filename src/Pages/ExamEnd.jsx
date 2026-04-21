import React, { useContext } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FaAward, FaHistory, FaRedo, FaChevronRight } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ExamEnd() {
    const { score, detailedResults, waecUserName, waecConfig } = useContext(ExamStateContext);
    const navigate = useNavigate();

    // Calculate total questions across all subjects
    const totalPossible = Object.values(detailedResults.totals).reduce((a, b) => a + b, 0);
    const percentage = Math.round((score / totalPossible) * 100) || 0;

    // Chart Data for Subject Breakdown
    const barData = {
        labels: Object.keys(detailedResults.breakdown).map(s => s.toUpperCase()),
        datasets: [{
            label: 'Score per Subject',
            data: Object.values(detailedResults.breakdown),
            backgroundColor: 'rgba(225, 29, 72, 0.6)', // Rose-600
            borderColor: 'rgb(225, 29, 72)',
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* --- Hero Score Section --- */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-rose-100 flex flex-col md:flex-row">
                    <div className="bg-rose-600 p-10 text-white flex flex-col items-center justify-center md:w-1/3">
                        <FaAward size={60} className="mb-4 text-rose-200" />
                        <h1 className="text-xl font-bold opacity-80 uppercase tracking-widest">Your Score</h1>
                        <div className="text-7xl font-black my-2">{percentage}%</div>
                        <p className="text-rose-100 font-medium">
                            {score} out of {totalPossible} Correct
                        </p>
                    </div>

                    <div className="p-10 flex-1">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">
                            Congratulations, {waecUserName || "Candidate"}!
                        </h2>
                        <p className="text-slate-500 mb-8">You have successfully completed the {waecConfig.examType?.toUpperCase()} Mock Examination.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => navigate('/new-exam-review')}
                                className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all"
                            >
                                <FaHistory /> View Review
                            </button>
                            <button 
                                onClick={() => navigate('/new-select-subject')}
                                className="flex items-center justify-center gap-2 border-2 border-rose-600 text-rose-600 py-4 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                            >
                                <FaRedo /> Retake Exam
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Analytics Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                        <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-6">Subject Performance</h3>
                        <div className="h-64">
                            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                        <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-6">Result Summary</h3>
                        <div className="space-y-4">
                            {Object.keys(detailedResults.totals).map(sub => (
                                <div key={sub} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <span className="font-bold text-slate-700 uppercase">{sub}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-rose-500" 
                                                style={{ width: `${(detailedResults.breakdown[sub] / detailedResults.totals[sub]) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-black text-rose-600">
                                            {detailedResults.breakdown[sub] || 0}/{detailedResults.totals[sub]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}