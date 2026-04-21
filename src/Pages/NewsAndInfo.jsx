import News from "../Components/News";
import Events from "../Components/Events";
import useOfflineStatus from "../Hooks/useOfflineStatus";



export default function NewsAndInfo() {

     const isOffline = useOfflineStatus();

    return (
        <>
        <div className="-mt-5 h-full">
            <News isOffline={isOffline} />

            <Events isOffline={isOffline} />
        </div>
        </>
    );
};