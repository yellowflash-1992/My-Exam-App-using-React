import React, { useState, useContext } from 'react'; // Added useContext here
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import Sidebar from '../Layout/Sidebar'; 
import Footer from "../Layout/Footer";
import NewsAndInfo from './NewsAndInfo';
import Header from '../Layout/Header';
import CandidateLoginModal from '../Components/CandidateLoginModal'; // Renamed for clarity
import WaecLoginModal from '../Components/WaecLoginModal';
import { ExamStateContext } from '../Helpers/Contexts';



function LandingPage() {

   const navigate = useNavigate();

    //const {gameState, setGameState, userName, setUserName} = useContext(GameStateContext);
     const location = useLocation();

     const [isOpen, setIsOpen] = useState(false);

     const { showLoginModal, setShowLoginModal, userName, showWaecLoginModal, 
        setShowWaecLoginModal, waecUserName } = 
     useContext(ExamStateContext);

    const isExamActive = 
    location.pathname.startsWith('/exam/') ||
    location.pathname.startsWith('/new-exam-page') ||
    location.pathname === '/exam-end' ||
    location.pathname === '/new-exam-end' ||
    location.pathname === '/exam-review' ||
    location.pathname === '/new-exam-review' ;

   

    const hiddenPages = ['/select-subject', '/exam-menu', '/exam-config', '/exam-end', 
       '/new-select-subject', '/new-exam-menu', '/new-exam-config', '/new-exam-end' ];

    const hidePartLayout = 
    hiddenPages.includes(location.pathname) ||
    location.pathname.startsWith('/exam/'); 
    

    const handleLoginSuccess = () => {
    setShowLoginModal(false);

    if (!userName.trim()) return;

    const rawSession = localStorage.getItem("jamb_exam_session");

    if (rawSession) {
        const sessionData = JSON.parse(rawSession);
        const savedSubject = sessionData.subjectId;

        navigate(`/exam/${savedSubject}`);
    } else {
        navigate('/select-subject');
    }
};

const handleWaecSuccess = () => {
    setShowWaecLoginModal(false); // Close the modal

    if (!waecUserName || waecUserName.trim().length <= 2) return;

    const rawSession = localStorage.getItem("waec_exam_session");

    if (rawSession) {
        // If they have a session, take them to the exam
        navigate('/new-exam-page'); 
    } else {
        // Otherwise, take them to select subjects
        navigate('/new-select-subject');
    }
};


    if (isExamActive) {
        return (
            <div className="min-h-screen w-full bg-white overflow-y-auto">
                <Outlet /> {/* This will render ONLY the ExamPage */}
            </div>
        );
    }


    return (
        <div className="Menu">
            
            <div className='flex h-screen bg-[#f8fafc] overflow-hidden'>

                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

                <div className='flex-1 flex flex-col p-2 overflow-auto'>

                {!hidePartLayout && (
                <Header setIsOpen={setIsOpen} />)}
                   
                   <div className="flex h-full min-w-0  md:overflow-y-scroll 
                    md:[&::-webkit-scrollbar]:w-0.5 bg-[#E2E8F0]
                    md:[scrollbar-width:thin] md:transition-all ">
  
                   <main className={`relative text-slate-800 transition-all px-6 min-w-0 ${hidePartLayout ? 'flex-1' : 'flex-[1.5]'}`}> 
                            
                            {/* Fixed Naming and added Navigation Logic */}
                            {showLoginModal && (
                                <CandidateLoginModal onStart={handleLoginSuccess} />
                            )} 

                            

{showWaecLoginModal && (
    <WaecLoginModal onStart={handleWaecSuccess} />
)}                               
                            
                        <Outlet /> 

                    </main>

                        {!hidePartLayout && (
                    <aside className='hidden md:block border-l px-4 flex-1 mx-3
                    border-slate-200 rounded-sm '>
                        <NewsAndInfo />
                        
                    </aside>
                    )}
                    </div>

                    <div className='hidden lg:block px-1'>

                        <Footer />
                    </div>
                </div>
               

                
                {isOpen && (
                    <div
                    className='fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm 
                    transition-opacity'
                    onClick={()=> setIsOpen(false)} />
                )}
            </div>
           
        </div>
    );
};

export default LandingPage; 