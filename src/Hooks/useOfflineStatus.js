import { useState, useEffect } from "react";




const useOfflineStatus = () => {

    const [isOffline, setIsOffline] = useState(!navigator.onLine); //change to dynamic later

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        //  setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOffline;

}

export default useOfflineStatus;