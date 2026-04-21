// hooks/UseExamLogic.js
import { useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { JambQuestionBank } from "../Helpers/jambQuestionBank";
import { useNavigate } from "react-router-dom";

const SESSION_PREFIX = "jamb_exam_session_";

export const useExam = (subjectId) => {
    const { userName, setScore, selectedSubjects, config, setDetailedResults, setReviewData } = useContext(ExamStateContext);
    const navigate = useNavigate();

    const [isFinishing, setIsFinishing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    const isFinishingRef = useRef(false);

    // Normalize IDs (e.g., "Use of English" -> "english")
    const normalizedSelected = useMemo(() => {
        return selectedSubjects ?.map((sub) => {
            const lower = sub.toLowerCase();
            if (lower.includes("english")) return "english";
            return lower.split(" ")[0];
        }) || [];
    }, [selectedSubjects]);

    const currentSubjectIndex = normalizedSelected.indexOf(subjectId ?.toLowerCase().trim());
    const nextSubjectId = normalizedSelected[currentSubjectIndex + 1];
    const isLastSubject = !nextSubjectId;

    const currentSubjectKey = subjectId ? `${SESSION_PREFIX}${subjectId.toLowerCase().trim()}` : "";

    // Question Loading Logic
    useEffect(() => {
        if (!subjectId) return;

        setIsLoading(true);
        const normalizedId = subjectId.toLowerCase().trim();
        const saved = JSON.parse(localStorage.getItem(`${SESSION_PREFIX}${normalizedId}`));

        if (saved ?.questions ?.length > 0) {
            setQuestions(saved.questions);
            setAnswers(saved.answers || {});
            setFlagged(saved.flagged || []);
            setCurrentQuestion(saved.currentQuestion || 0);
            setSelectedOption(saved.answers ?.[saved.currentQuestion] ?? null);
        } else {
            const rawPool = JambQuestionBank[normalizedId];
            if (rawPool) {
                // Determine count based on Mode and Subject
                const isFull = config.duration === 120;
                const isEnglish = normalizedId === "english";
                const count = isEnglish ? (isFull ? 20 : 10) : (isFull ? 10 : 5);

                const shuffled = [...rawPool]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, count)
                    .map(q => ({...q, subjectKey: normalizedId }));

                setQuestions(shuffled);
                setAnswers({});
                setFlagged([]);
                setCurrentQuestion(0);
                setSelectedOption(null);
            }
        }
        setIsLoading(false);
    }, [subjectId, config.duration]);

    // Save progress to LocalStorage
    useEffect(() => {
        if (isLoading || !questions.length || !currentSubjectKey) return;
        const examData = { userName, subjectId, questions, answers, currentQuestion, flagged };
        localStorage.setItem(currentSubjectKey, JSON.stringify(examData));
    }, [questions, answers, currentQuestion, flagged, userName, subjectId, isLoading, currentSubjectKey]);

    const finishExam = useCallback(() => {
        if (isFinishingRef.current) return;
        setIsFinishing(true);
        isFinishingRef.current = true;

        const currentExamData = {
            userName,
            subjectId,
            questions,
            answers,
            currentQuestion,
            flagged
        };
        localStorage.setItem(currentSubjectKey, JSON.stringify(currentExamData));

        let totalScore = 0;
        const subjectScores = {};
        const subjectTotals = {};
        const allReviewData = [];

        normalizedSelected.forEach((key) => {
            const storedData = JSON.parse(localStorage.getItem(`${SESSION_PREFIX}${key}`));

            if (storedData && storedData.questions) {
                subjectScores[key] = 0;
                subjectTotals[key] = storedData.questions.length;

                storedData.questions.forEach((q, idx) => {
                    const userAns = storedData.answers[idx];
                    const isCorrect = userAns === q.answer;

                    if (isCorrect) {
                        totalScore++;
                        subjectScores[key]++;
                    }

                    // Push to review with subject name for filtering
                    allReviewData.push({
                        ...q,
                        userAnswer: userAns,
                        isCorrect,
                        subjectName: key
                    });
                });
            }
        });

        setScore(totalScore);
        const finalResults = { breakdown: subjectScores, totals: subjectTotals };
        setDetailedResults(finalResults);
        setReviewData(allReviewData);

        localStorage.setItem("last_exam_results", JSON.stringify({
            score: totalScore,
            results: finalResults,
            review: allReviewData
        }));

        // Clear only exam-related storage
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(SESSION_PREFIX) || k === "jamb_exam_session") {
                localStorage.removeItem(k);
            }
        });

        navigate("/exam-end", { replace: true });
    }, [normalizedSelected, navigate, setScore, setDetailedResults, setReviewData, userName, subjectId, questions, answers, currentQuestion, flagged, currentSubjectKey]);

    const chooseOption = useCallback((index) => {
        setAnswers(prev => ({...prev, [currentQuestion]: index }));
        setSelectedOption(index);
    }, [currentQuestion]);

    const jumpToQuestion = useCallback((index) => {
        if (index < 0 || index >= questions.length) return;
        setCurrentQuestion(index);
        setSelectedOption(answers[index] ?? null);
    }, [questions.length, answers]);

    const handleNextAction = useCallback(() => {
        if (currentQuestion < questions.length - 1) {
            jumpToQuestion(currentQuestion + 1);
        } else if (!isLastSubject) {
            navigate(`/exam/${nextSubjectId}`);
        } else {
            if (window.confirm("You are at the end of the exam. Do you want to submit?")) {
                finishExam();
            }
        }
    }, [currentQuestion, questions.length, isLastSubject, nextSubjectId, navigate, jumpToQuestion, finishExam]);

    const toggleFlag = useCallback(() => {
        setFlagged(prev => prev.includes(currentQuestion) ?
            prev.filter(q => q !== currentQuestion) : [...prev, currentQuestion]);
    }, [currentQuestion]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore if the user is typing in an input (if you add a search bar later)
            if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;

            const key = event.key.toLowerCase();

            // Mapping A, B, C, D to indices 0, 1, 2, 3
            if (key === "a") chooseOption(0);
            if (key === "b") chooseOption(1);
            if (key === "c") chooseOption(2);
            if (key === "d") chooseOption(3);

            // Navigation shortcuts
            if (key === "n") handleNextAction();
            if (key === "p") jumpToQuestion(currentQuestion - 1);

            // Flag shortcut
            if (key === "f") toggleFlag();
        };

        window.addEventListener("keydown", handleKeyDown);

        // Cleanup listener on unmount
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [chooseOption, handleNextAction, jumpToQuestion, toggleFlag, currentQuestion]);


    return {
        userName,
        config,
        questions,
        question: questions[currentQuestion] || null,
        currentQuestion,
        selectedOption,
        answers,
        flagged,
        isLoading,
        isFinishing,
        chooseOption,
        nextQuestion: handleNextAction,
        finishExam,
        jumpToQuestion,
        toggleFlag,
        isLastSubject
    };
};