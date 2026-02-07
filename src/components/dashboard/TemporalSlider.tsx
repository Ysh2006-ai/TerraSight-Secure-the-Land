
import { Play, SkipBack, SkipForward } from "lucide-react";

export default function TemporalSlider() {
    return (
        <div className="fixed bottom-6 w-1/3 left-1/3 z-50 glass-panel rounded-full px-6 py-3 flex items-center space-x-4">
            <div className="text-[10px] text-electric-cyan font-bold whitespace-nowrap">
                LIVE FEED
            </div>

            <div className="flex items-center space-x-2 text-white/50">
                <SkipBack className="w-4 h-4 hover:text-white cursor-pointer" />
                <Play className="w-4 h-4 hover:text-electric-cyan cursor-pointer text-white" />
                <SkipForward className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                <div className="absolute top-0 left-0 h-full w-[98%] bg-electric-cyan/50" />
                <div className="absolute top-0 left-[98%] h-full w-2 bg-white shadow-[0_0_10px_white]" />
            </div>

            <div className="text-[10px] text-white/50 font-mono whitespace-nowrap">
                -00:00:12
            </div>
        </div>
    );
}
