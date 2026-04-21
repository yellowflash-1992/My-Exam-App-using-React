// hooks/useSuggestedGroups.js
import { useState, useEffect } from 'react';

export const useSuggestedGroup = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroups = async() => {
            try {
                // Replace with actual groups API endpoint
                const response = await fetch('https://api.example.com/study-groups');
                if (!response.ok) throw new Error('Failed to fetch groups');
                const result = await response.json();
                setGroups(result);
            } catch (err) {
                setError(err.message);
                // Fallback mock data
                setGroups([
                    { id: 1, name: 'JAMB 2026 Champions', platform: 'whatsapp', members: 245, subject: 'All Subjects', link: 'https://chat.whatsapp.com/example1' },
                    { id: 2, name: 'WAEC Science Gurus', platform: 'telegram', members: 512, subject: 'Physics, Chemistry, Biology', link: 'https://t.me/example2' },
                    { id: 3, name: 'NECO Mathematics Drill', platform: 'whatsapp', members: 189, subject: 'Mathematics', link: 'https://chat.whatsapp.com/example3' },
                    { id: 4, name: 'JAMB Use of English Masters', platform: 'telegram', members: 876, subject: 'English Language', link: 'https://t.me/example4' },
                    { id: 5, name: 'WAEC Literature Texts', platform: 'whatsapp', members: 134, subject: 'Literature-in-English', link: 'https://chat.whatsapp.com/example5' },
                    { id: 6, name: 'NECO Commerce & Accounting', platform: 'telegram', members: 98, subject: 'Commerce, Accounting', link: 'https://t.me/example6' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    return { groups, loading, error };
};