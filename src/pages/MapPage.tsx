import { MissionProvider } from '../context/MissionContext';
import SpatialMap from '../components/map/SpatialMap';
import CommandInit from '../components/dashboard/CommandInit';
import SystemPulse from '../components/dashboard/SystemPulse';
import SurveillanceFeed from '../components/dashboard/SurveillanceFeed';
import ComplianceDossier from '../components/dashboard/ComplianceDossier';
import useRealtimeAlerts from '../hooks/useRealtimeAlerts';

// Internal component to use hooks
function MissionContent() {
    useRealtimeAlerts();

    return (
        <div className="relative w-full h-full bg-black overflow-hidden relative">
            {/* Top Bar */}
            <SystemPulse />

            {/* Left Sidebar */}
            <SurveillanceFeed />

            {/* Right Sidebar */}
            <ComplianceDossier />

            {/* Command Init Overlay (Shows first) */}
            <CommandInit />

            {/* Main Map Area */}
            <div className="absolute inset-0 z-0">
                <SpatialMap />
            </div>

            {/* Bottom Controls */}
            {/* Bottom Controls - REMOVED */}
            {/* <TemporalSlider /> */}
        </div>
    );
}

export const MapPage = () => {
    return (
        <MissionProvider>
            <div className="h-[calc(100vh-64px)] w-full overflow-hidden relative">
                <MissionContent />
            </div>
        </MissionProvider>
    );
};
