import React, { useState, useEffect } from 'react';

const LiveCameraView: React.FC = () => {
    const [imageUrl, setImageUrl] = useState(`https://picsum.photos/seed/${Date.now()}/800/600`);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageUrl(`https://picsum.photos/seed/${Date.now()}/800/600`);
        }, 3000); // Update image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700 animate-fade-in">
            <img 
                key={imageUrl}
                src={imageUrl} 
                alt="Live camera feed" 
                className="w-full h-full object-cover animate-fade-in" 
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                </span>
                LIVE
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white text-xs font-mono">{new Date().toISOString()}</p>
            </div>
        </div>
    );
};

export default LiveCameraView;
