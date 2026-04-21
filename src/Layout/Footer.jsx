import React from "react";

export default function Footer() {
  const content = (" Designed by Yellowflash  • Designed by Yellowflash  ") +
   " Designed by Yellowflash  • Designed by Yellowflash   ";
    

  return (
    <div className="">
     
      <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
        <div className="relative w-full overflow-hidden ">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: "marquee 25s linear infinite",
            }}
          >
            <span className="text-sm font-semibold text-yellow-400 mx-8">
              {content}
            </span>
            <span className="text-sm font-semibold text-yellow-400 mx-8">
              {content}
            </span>
            <span className="text-sm font-semibold text-yellow-400 mx-8">
              {content}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}