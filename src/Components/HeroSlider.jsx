import React, {useState, useEffect} from 'react';



export default function HeroSlider() {

     const messages = [
        {
            title: "📊 JAMB CBT and WAEC PAST QUESTIONS",
            desc: "Over 60,000 Real Exam Questions and Asnwers"
        },
        {
            title: "🚀 Study and Practice Anywhere",
            desc: "Access Questions, Answers and Explanation 100% offline"
        },
        {
            title: "👥 24 new users joined today.",
            desc : "Meet like-minded from different schools"
        },
        {
            title: "🏆 WAEC and NECO GCE EXAM 2026",
            desc: "Candidates,schools, centers - Get ready!"
        }
        
      ];
    
      const slidingMessages = [...messages, messages[0]];
    
const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    
    const timer = setInterval(() => {
        setIsTransitioning(true);
      setCurrent((prev) => prev + 1);
        
    }, 4000); 

    return () => clearInterval(timer);
 }, []);

 useEffect(()=> {
    if (current === messages.length) {
        setTimeout(()=> {
            setIsTransitioning(false);
            setCurrent(0);

        }, 700);
    }
 }, [current, messages.length]);


return (
    <>

    <div className="p-4 bg-[radial-gradient(circle,#312e81_0%,#0f172a_100%)] 
      border border-blue-200 rounded-lg overflow-hidden">
        
    <div
        className="flex"
        style={{transform: `translateX(-${current *100}%)`,
        transition: isTransitioning ? 'transform 0.5s ease-in-out': 'none'
        }}>
            {slidingMessages.map((msg, i)=> (
                <div key={i} className="w-full shrink-0 flex items-center justify-center p-5
                md:p-8 text-center flex-col">

                    <h1 className="text-xl font-bold text-gray-50 mb-4">
                        {msg.title}
                    </h1>
                    <p className="text-xs font-medium text-gray-50 mx-w-md">
                    {msg.desc}
                    </p>
                    
                </div>
            ))}
        </div>
      </div>
    </>            

      );
};