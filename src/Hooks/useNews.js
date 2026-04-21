// hooks/useNews.js
import { useState, useEffect } from 'react';

export const useNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async() => {
            try {
                // Replace with actual news API endpoint (e.g., NewsAPI, or your own backend)
                const response = await fetch('https://api.example.com/education-news');
                if (!response.ok) throw new Error('Failed to fetch news');
                const result = await response.json();
                setNews(result);
            } catch (err) {
                setError(err.message);
                // Fallback mock data for Nigerian education news
                setNews([{
                        id: 1,
                        title: 'JAMB Announces 2026 UTME Registration Date',
                        source: 'JAMB Bulletin',
                        time: '2 hours ago',
                        image: '📢',
                        url: 'https://www.jamb.gov.ng/news'
                    },
                    {
                        id: 2,
                        title: 'WAEC Releases 2025 Nov/Dec Results – 72.3% Pass',
                        source: 'WAEC Nigeria',
                        time: 'Yesterday',
                        image: '📝',
                        url: 'https://www.waecdirect.org'
                    },
                    {
                        id: 3,
                        title: 'NECO Extends Registration Deadline for SSCE Internal',
                        source: 'NECO Official',
                        time: '3 days ago',
                        image: '⏰',
                        url: 'https://www.neco.gov.ng'
                    },
                    {
                        id: 4,
                        title: 'UNILAG Post-UTME Form Out – See Cut-off Marks',
                        source: 'Campus News',
                        time: '5 days ago',
                        image: '🎓',
                        url: 'https://unilag.edu.ng'
                    },
                    {
                        id: 5,
                        title: 'Federal Government Approves New Universities – See List',
                        source: 'NUC',
                        time: '1 week ago',
                        image: '🏛️',
                        url: 'https://www.nuc.edu.ng'
                    },
                    {
                        id: 6,
                        title: 'Tips to Score High in JAMB Use of English – Expert Advice',
                        source: 'FlashLearners',
                        time: '2 weeks ago',
                        image: '💡',
                        url: 'https://flashlearners.com'
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return { news, loading, error };
};