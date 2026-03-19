import React from 'react';

const SubmissionTimeline: React.FC = () => {
    const timelineData = [
        { title: "Full Paper & Pictorial", date: "June 18, 2026" },
        { title: "Poster & Demo", date: "June 18, 2026" },
        { title: "Notification", date: "July 21, 2026" },
        { title: "Camera-Ready", date: "July 27, 2026" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mt-16 px-4">
            <h3 className="text-3xl font-pixel text-white text-center mb-10 tracking-widest">SUBMISSION TIMELINE</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                <div className="hidden md:block absolute top-[40%] left-0 w-full h-1 bg-gradient-to-r from-lab-lime via-white to-lab-pink z-0 transform -translate-y-1/2"></div>
                {timelineData.map((item, index) => (
                    <div key={index} className="z-10 bg-lab-black border-2 border-white/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl hover:border-lab-lime hover:scale-105 transition-all group backdrop-blur-sm">
                        <div className="text-lab-lime font-bold text-lg mb-4 h-12 flex items-center">{item.title}</div>
                        <div className="bg-white text-lab-black font-pixel text-xl px-4 py-2 rounded-full w-full">{item.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmissionTimeline;
