import { useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { waecQuestionBank } from "../Helpers/waecQuestionBank";
import { useNavigate } from "react-router-dom";

export const useExam = (subjectId) => {
   const {
        waecUserName, 
        userName, 
        setScore,
        waecSelectedSubjects, 
        waecConfig, 
        setDetailedResults, 
        setReviewData
    } = useContext(ExamStateContext);

    const navigate = useNavigate();
    const activeName = waecUserName || userName || "Guest";
    const PREFIX = "waec_progress_";
    const EXAM_LOCK_KEY = "waec_exam_completed"; // Flag to prevent re-entry

    const subjectMap = {
        "maths": "mathematics",
        "math": "mathematics",
        "english": "english",
        "physics": "physics",
        "chemistry": "chemistry"
    };

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFinishingRef = useRef(false);

    const normalizedSelected = useMemo(() => {
        return waecSelectedSubjects?.map(sub => sub.toLowerCase().split(" ")[0]) || [];
    }, [waecSelectedSubjects]);

    const currentSubjectIndex = normalizedSelected.indexOf(subjectId?.toLowerCase());
    const nextSubjectId = normalizedSelected[currentSubjectIndex + 1];
    const isLastSubject = currentSubjectIndex === normalizedSelected.length - 1;

    // Check if exam was already completed
    const isExamLocked = useCallback(() => {
        return localStorage.getItem(EXAM_LOCK_KEY) === 'true';
    }, []);

    useEffect(() => {
        // Security: Redirect if exam already submitted or no valid session
        if (isExamLocked()) {
            navigate("/new-exam-end", { replace: true });
            return;
        }

        if (!subjectId || subjectId === ":subjectId") {
            navigate("/new-exam-menu", { replace: true });
            return;
        }

        setIsLoading(true);

        const storageKey = `${PREFIX}${subjectId.toLowerCase()}`;
        const saved = localStorage.getItem(storageKey);

        // If there's no saved progress AND no active exam session in localStorage,
        // this could mean the user refreshed before starting, OR they're trying to re-enter after finishing.
        // We check for existence of the master session key.
        const masterSession = localStorage.getItem("waec_exam_session");
        if (!saved && !masterSession) {
            // No session exists – probably finished already or never started properly.
            navigate("/new-exam-menu", { replace: true });
            return;
        }

        if (saved) {
            const parsed = JSON.parse(saved);
            setQuestions(parsed.questions || []);
            setAnswers(parsed.answers || {});
            setFlagged(parsed.flagged || []);
            setCurrentQuestion(parsed.currentQuestion || 0);
        } else {
            // Fresh start: load questions from bank
            const bankKey = subjectMap[subjectId.toLowerCase()] || subjectId.toLowerCase();
            const rawPool = waecQuestionBank[bankKey];

            if (rawPool && rawPool.length > 0) {
                const count = waecConfig?.numQuestions ? Number(waecConfig.numQuestions) : 2;
                const shuffled = [...rawPool].sort(() => 0.5 - Math.random()).slice(0, count);
                setQuestions(shuffled);
            } else {
                console.error(`Subject "${bankKey}" not found in Bank!`);
                setQuestions([]);
            }
            
            setAnswers({});
            setFlagged([]);
            setCurrentQuestion(0);
        }
        setIsLoading(false);
    }, [subjectId, waecConfig?.numQuestions, navigate, isExamLocked]);

    useEffect(() => {
        if (isLoading || !questions.length || !subjectId) return;
        const data = { questions, answers, flagged, currentQuestion };
        localStorage.setItem(`${PREFIX}${subjectId.toLowerCase()}`, JSON.stringify(data));
    }, [questions, answers, flagged, currentQuestion, subjectId, isLoading]);

    const finishExam = useCallback(() => {
        if (isFinishingRef.current) return;
        isFinishingRef.current = true;

        // Set the lock to prevent re-entry
        localStorage.setItem(EXAM_LOCK_KEY, 'true');

        let totalScore = 0;
        const subjectScores = {};
        const subjectTotals = {};
        const allReview = [];

        normalizedSelected.forEach(sub => {
            const data = JSON.parse(localStorage.getItem(`${PREFIX}${sub}`));
            if (data) {
                data.questions.forEach((q, idx) => {
                    const isCorrect = data.answers[idx] === q.answer;
                    if (isCorrect) {
                        totalScore++;
                        subjectScores[sub] = (subjectScores[sub] || 0) + 1;
                    }
                    allReview.push({ ...q, userAnswer: data.answers[idx], isCorrect, subject: sub });
                });
                subjectTotals[sub] = data.questions.length;
            }
        });

        setScore(totalScore);
        setDetailedResults({ breakdown: subjectScores, totals: subjectTotals });
        setReviewData(allReview);

        // Clear progress but keep lock
        normalizedSelected.forEach(sub => localStorage.removeItem(`${PREFIX}${sub}`));
        localStorage.removeItem("waec_exam_session");

        navigate("/new-exam-end", { replace: true });
    }, [normalizedSelected, navigate, setScore, setDetailedResults, setReviewData]);

    // Additional security: if user tries to go back after finishing, we can't prevent the page load,
    // but the check at the top of useEffect will redirect them immediately.

    return {
        activeName, questions, currentQuestion, answers, flagged,
        isLoading, isLastSubject, nextSubjectId, normalizedSelected,
        chooseOption: (idx) => setAnswers(prev => ({ ...prev, [currentQuestion]: idx })),
        jumpToQuestion: (idx) => setCurrentQuestion(idx),
        toggleFlag: () => setFlagged(prev => prev.includes(currentQuestion) ? prev.filter(q => q !== currentQuestion) : [...prev, currentQuestion]),
        nextQuestion: () => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else if (nextSubjectId) {
                navigate(`/new-exam-page/${nextSubjectId}`);
            } else {
                finishExam();
            }
        },
        finishExam
    };
};