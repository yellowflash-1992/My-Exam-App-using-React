import React, { useContext, useMemo, useState } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, FaTimesCircle, FaFlag, FaHome, FaRedo, 
    FaBookOpen, FaLightbulb, FaChevronDown, FaChevronUp 
} from 'react-icons/fa';

export default function NewExamReview() {
    const { reviewData, waecUserName, waecConfig } = useContext(ExamStateContext);
    const navigate = useNavigate();
    const [activeSubjectState, setActiveSubjectState] = useState(null);
    const [expandedExplanations, setExpandedExplanations] = useState({});

    // Group questions by subject
    const subjectGroups = useMemo(() => {
        if (!reviewData || !Array.isArray(reviewData) || reviewData.length === 0) return {};
        const groups = {};
        reviewData.forEach((q, idx) => {
            const subject = q.subject || 'unknown';
            if (!groups[subject]) groups[subject] = [];
            groups[subject].push({ ...q, originalIndex: idx });
        });
        return groups;
    }, [reviewData]);

    const subjects = Object.keys(subjectGroups);
    
    // Derive active subject
    const activeSubject = useMemo(() => {
        if (subjects.length === 0) return null;
        if (activeSubjectState && subjects.includes(activeSubjectState)) {
            return activeSubjectState;
        }
        return subjects[0];
    }, [subjects, activeSubjectState]);

    const currentQuestions = activeSubject ? subjectGroups[activeSubject] : [];

    // Stats for active subject
    const subjectStats = useMemo(() => {
        if (!activeSubject || !subjectGroups[activeSubject]) return { correct: 0, total: 0, percentage: 0 };
        const qs = subjectGroups[activeSubject];
        const correct = qs.filter(q => q.isCorrect).length;
        return { correct, total: qs.length, percentage: Math.round((correct / qs.length) * 100) };
    }, [activeSubject, subjectGroups]);

    // Overall stats
    const overallStats = useMemo(() => {
        if (!reviewData || reviewData.length === 0) return { correct: 0, total: 0, percentage: 0 };
        const correct = reviewData.filter(q => q.isCorrect).length;
        return { correct, total: reviewData.length, percentage: Math.round((correct / reviewData.length) * 100) };
    }, [reviewData]);

    const toggleExplanation = (questionIndex) => {
        setExpandedExplanations(prev => ({
            ...prev,
            [questionIndex]: !prev[questionIndex]
        }));
    };

    if (!reviewData || reviewData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
                    <FaBookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-black text-slate-700">No Review Data</h2>
                    <p className="text-slate-500 mt-2">Complete an exam to see your performance review.</p>
                    <button 
                        onClick={() => navigate('/new-exam-menu')}
                        className="mt-6 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold"
                    >
                        Go to Exam Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Exam Review</h1>
                        <p className="text-sm text-slate-500">
                            {waecUserName || "Candidate"} • {waecConfig?.examType?.toUpperCase() || "WAEC"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-50 px-4 py-2 rounded-xl">
                            <span className="text-rose-600 font-black text-xl">
                                {overallStats.percentage}%</span>
                            <span className="text-slate-500 text-sm ml-2">
                                ({overallStats.correct}/{overallStats.total})</span>
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                            title="Home"
                        >
                            <FaHome size={20} className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Subject Tabs */}
            <div className="bg-white border-b border-slate-200 px-6 sticky top-[73px] z-10">
                <div className="max-w-7xl mx-auto flex overflow-x-auto gap-1 py-2">
                    {subjects.map(sub => {
                        const stats = {
                            correct: subjectGroups[sub].filter(q => q.isCorrect).length,
                            total: subjectGroups[sub].length
                        };
                        return (
                            <button
                                key={sub}
                                onClick={() => setActiveSubjectState(sub)}
                                className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2
                                    ${activeSubject === sub 
                                        ? 'bg-rose-600 text-white shadow-md' 
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <span className="uppercase">{sub}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    activeSubject === sub ? 'bg-white/20' : 'bg-slate-200'
                                }`}>
                                    {stats.correct}/{stats.total}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content - All Questions List */}
            <div className="flex-1 max-w-5xl w-full mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-700 uppercase">{activeSubject}</h2>
                        <p className="text-sm text-slate-500">
                            {subjectStats.correct} of {subjectStats.total} correct • {subjectStats.percentage}%
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/new-exam-end')}
                        className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-all"
                    >
                        <FaRedo size={14} /> Done
                    </button>
                </div>

                <div className="space-y-6">
                    {currentQuestions.map((q, idx) => {
                        const isExpanded = expandedExplanations[q.originalIndex] || false;
                        return (
                            <div key={q.originalIndex} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                {/* Question Header */}
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-200 text-slate-700 font-bold text-sm px-3 py-1 rounded-full">
                                            Question {idx + 1}
                                        </span>
                                        {q.isCorrect ? (
                                            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                                                <FaCheckCircle size={14} /> Correct
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600 text-sm font-bold">
                                                <FaTimesCircle size={14} /> Incorrect
                                            </span>
                                        )}
                                    </div>
                                    {q.flagged && (
                                        <span className="flex items-center gap-1 text-amber-600 text-sm">
                                            <FaFlag size={12} /> Flagged
                                        </span>
                                    )}
                                </div>

                                {/* Prompt */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{q.prompt}</h3>
                                    
                                    {/* Options */}
                                    <div className="space-y-2">
                                        {q.options.map((opt, optIdx) => {
                                            const isUserAnswer = q.userAnswer === optIdx;
                                            const isCorrectAnswer = q.answer === optIdx;
                                            
                                            let optionClass = "border-slate-200 bg-white";
                                            if (isUserAnswer && isCorrectAnswer) {
                                                optionClass = "border-emerald-500 bg-emerald-50";
                                            } else if (isUserAnswer && !isCorrectAnswer) {
                                                optionClass = "border-red-500 bg-red-50";
                                            } else if (isCorrectAnswer) {
                                                optionClass = "border-emerald-500 bg-emerald-50/50";
                                            }

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={`p-3 rounded-xl border-2 ${optionClass} flex items-center gap-3`}
                                                >
                                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0
                                                        ${isUserAnswer && isCorrectAnswer ? 'bg-emerald-500 text-white' :
                                                          isUserAnswer && !isCorrectAnswer ? 'bg-red-500 text-white' :
                                                          isCorrectAnswer ? 'bg-emerald-500 text-white' :
                                                          'bg-slate-100 text-slate-500'}`}
                                                    >
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    <span className="flex-1">{opt}</span>
                                                    {isUserAnswer && (
                                                        <span className="text-xs font-bold px-2 py-0.5 bg-white rounded-lg shadow-sm">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                    {isCorrectAnswer && !isUserAnswer && (
                                                        <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                                            Correct Answer
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation Toggle & Content */}
                                    {q.explanation && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => toggleExplanation(q.originalIndex)}
                                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <FaLightbulb size={14} />
                                                {isExpanded ? 'Hide Explanation' : 'Show Explanation'}
                                                {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                            </button>
                                            {isExpanded && (
                                                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}