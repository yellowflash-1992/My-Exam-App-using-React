// components/header/NotificationBell.jsx
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);

  const notifications = [
    { id: 1, text: 'JAMB registration starts soon', time: '2h ago' },
    { id: 2, text: 'New WAEC past questions added', time: '1d ago' },
  ];

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-xs rounded-4xl border px-1 py-1 md:font-bold border-gray-200 text-red-800 md:px-5 md:py-3 relative"
      >
        <FaBell />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b">
            <span className="font-bold text-sm">Notifications</span>
          </div>
          {notifications.map(n => (
            <div key={n.id} className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
              <p className="text-sm">{n.text}</p>
              <p className="text-[10px] text-slate-400">{n.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}