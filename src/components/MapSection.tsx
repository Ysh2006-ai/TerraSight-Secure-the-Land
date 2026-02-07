// Fix generic marker icon issue in React Leaflet
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useAlerts } from '../hooks/useAlerts'
import { useRiskZones } from '../hooks/useRiskZones'

// Custom icons
const getIcon = (severity: string) => {
    const color = severity === 'critical' || severity === 'high' ? 'bg-red-500' :
        severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500';

    return L.divIcon({
        className: 'custom-pulsing-marker',
        html: `<div class="w-4 h-4 ${color} rounded-full animate-ping absolute"></div><div class="w-4 h-4 ${color} rounded-full relative border-2 border-white"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const MapSection = ({ className = "h-[600px]" }: { className?: string }) => {
    const { alerts } = useAlerts();
    const { riskZones } = useRiskZones();

    const getRiskColor = (level: number) => {
        if (level > 0.8) return 'red';
        if (level > 0.5) return 'orange';
        return 'yellow';
    };

    return (
        <div className={`w-full rounded-xl overflow-hidden border border-brand-navy shadow-2xl relative z-10 ${className}`}>
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="w-full h-full bg-brand-black" zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Risk Zones Polygons */}
                {riskZones.map((zone) => (
                    <Polygon
                        key={`zone-${zone.id}`}
                        positions={zone.coordinates}
                        pathOptions={{
                            color: getRiskColor(zone.riskLevel),
                            fillColor: getRiskColor(zone.riskLevel),
                            fillOpacity: 0.2,
                            weight: 1
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 bg-brand-navy text-white rounded">
                                <h3 className="font-bold text-white capitalize">{zone.type.replace('-', ' ')}</h3>
                                <div className="mt-1 text-xs text-gray-400">Probability: {(zone.riskLevel * 100).toFixed(0)}%</div>
                            </div>
                        </Popup>
                    </Polygon>
                ))}

                {/* Alert Markers */}
                {alerts.map((alert) => (
                    <Marker key={`alert-${alert.id}`} position={[alert.lat, alert.lng]} icon={getIcon(alert.severity)}>
                        <Popup className="custom-popup">
                            <div className="p-2 bg-brand-navy text-white rounded border border-white/10">
                                <h3 className="font-bold text-white capitalize">{alert.type}</h3>
                                <p className="text-xs text-gray-300">Lat: {alert.lat.toFixed(2)}, Lng: {alert.lng.toFixed(2)}</p>
                                <div className="mt-2 text-xs font-mono text-brand-green">STATUS: {alert.status.toUpperCase()}</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapSection
