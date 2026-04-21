import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ExamLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the actual question page (e.g., /exam/english)
    const isCurrentlyTesting = location.pathname.includes('/exam/');

    return (
        <div className={`min-h-screen bg-slate-50 ${!isCurrentlyTesting ? 'mt-2 p-2' : ''}`}>
            <div className={`${!isCurrentlyTesting ? 'exam-container max-w-4xl mx-auto' : 'w-full'}`}>
                
                {/* Only show this header if NOT in the middle of an exam */}
                {!isCurrentlyTesting && (
                    <div className='flex items-center justify-between mb-2 border-b pb-2 border-slate-200'>
                        <button 
                            onClick={() => navigate('/')}
                            className='flex items-center gap-2 text-slate-500 hover:text-red-800 font-medium transition-all cursor-pointer'
                        >
                            <FaArrowLeft /> 
                            <span className='text-xs'>
                                Exit <span className='hidden md:inline'>to Dashboard</span>
                            </span>
                        </button>

                        <h1 className='text-lg md:text-3xl font-black text-slate-800 tracking-tight'>
                            Exam App
                        </h1>

                        <div className='w-24' /> 
                    </div>
                )}

                {/* If testing, we remove the extra white card padding to let the ExamPage handle the layout */}
                <div className={`${!isCurrentlyTesting ? 'bg-white rounded-xl shadow-sm border border-slate-100 p-4' : ''}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ExamLayout;