// hooks/useUserRegistry.js
import { useState } from 'react';

const STORAGE_KEY = 'registered_users';

export const useUserRegistry = () => {
    const [users, setUsers] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return [];
            }
        }
        // Seed with dummy users
        const dummy = [
            { id: 1, name: 'John Doe', exam: 'jamb', date: new Date().toISOString() },
            { id: 2, name: 'Jane Smith', exam: 'waec', date: new Date().toISOString() },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummy));
        return dummy;
    });

    const addUser = (userData) => {
        const newUser = {
            id: Date.now(),
            ...userData,
            date: new Date().toISOString(),
        };
        setUsers(prev => {
            const updated = [...prev, newUser];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
        return newUser;
    };

    const getUserCount = () => users.length;

    return { users, addUser, getUserCount };
};