// components/OfflineWrapper.jsx
import { FaPlug } from 'react-icons/fa';

export default function OfflineWrapper({ 
  title, 
  isOffline, 
  children, 
  onViewAll, 
  showAll 
}) {
  return (
    <div className="p-6 bg-slate-50 mt-10 rounded-xl mb-15">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="font-bold text-sm md:text-2xl uppercase tracking-tight text-slate-800">
          {title}
        </h2>
        {!isOffline && onViewAll && (
          <button 
            onClick={onViewAll}
            className="cursor-pointer font-bold text-rose-600 text-xs whitespace-nowrap hover:text-rose-700 transition-colors"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>
      
      {/* Content */}
      {isOffline ? (
        <div className="flex flex-col items-center justify-center py-20 md:mb-10 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8">
            <FaPlug className='text-slate-400 text-4xl rotate-45' />
          </div>
          <p className="text-slate-600 text-center max-w-[250px] leading-relaxed mb-6">
            You're currently offline, please check your internet and try again
          </p>
          <button 
            className="px-8 py-2 border-2 border-rose-600 rounded-full font-bold hover:bg-rose-50 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}