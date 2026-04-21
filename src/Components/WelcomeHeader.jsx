import { useContext } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { toSentenceCase } from "../Helpers/stringUtils";

export default function WelcomeHeader() {
    // 1. Grab the name directly from the Brain
    const { userName, waecUserName, activeExam, setUserName, setWaecUserName } = useContext(ExamStateContext);

    const handleLogout = () => {
        // Clear all exam data
        localStorage.clear();
        setUserName("");
        setWaecUserName("");
        window.location.href = "/";
    };

    // If for some reason there is no name, show a generic welcome
    const displayName = activeExam === 'waec' 
        ? (waecUserName ? toSentenceCase(waecUserName) : "Candidate")
        : (userName ? toSentenceCase(userName) : "Candidate");


     return (
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        System Online
                    </span>
                </div>
                <h1 className="text-2xl font-black text-slate-800">
                    Hello, {displayName}!
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    {activeExam === 'waec' ? 'WAEC/NECO Portal' : 'JAMB CBT Portal'}
                </p>
            </div>
            
            <button 
                onClick={handleLogout}
                className="group flex flex-col items-end"
            >
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-500 transition-colors uppercase">
                    Not you?
                </span>
                <span className="text-sm font-bold text-slate-800 group-hover:text-rose-600 border-b-2 border-rose-200">
                    Switch Account
                </span>
            </button>
        </div>
    );
}