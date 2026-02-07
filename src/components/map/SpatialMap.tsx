/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Map, { NavigationControl, useControl, Source, Layer } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { MapboxOverlay as MapboxOverlayType } from "@deck.gl/mapbox";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMission, type Alert } from "../../context/MissionContext";
import { WifiOff, AlertTriangle } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeckGLOverlay(props: any) {
    const overlay = useControl<MapboxOverlayType>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    transitionDuration?: number;
}

export default function SpatialMap() {
    const { alerts, activeTarget, activeState } = useMission();
    const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY || "";

    const [mapError, setMapError] = useState<string | null>(null);

    const [viewState, setViewState] = useState<ViewState>({
        longitude: 77.2090,
        latitude: 28.6139,
        zoom: 13,
        pitch: 60, // 3D View
        bearing: -20,
    });

    useEffect(() => {
        if (activeTarget && activeTarget.coordinates) {
            setViewState(prev => ({
                ...prev,
                longitude: activeTarget.coordinates[0],
                latitude: activeTarget.coordinates[1],
                zoom: 16,
                pitch: 60,
                transitionDuration: 2000,
            }));
        } else if (activeState) {
            if (activeState.bbox) {
                // Use fitBounds logic or just set center
                setViewState(prev => ({
                    ...prev,
                    longitude: activeState.coordinates[0],
                    latitude: activeState.coordinates[1],
                    zoom: activeState.zoom,
                    pitch: 60,
                    transitionDuration: 2000,
                }));
            } else {
                setViewState(prev => ({
                    ...prev,
                    longitude: activeState.coordinates[0],
                    latitude: activeState.coordinates[1],
                    zoom: activeState.zoom,
                    pitch: 60,
                    transitionDuration: 3000,
                }));
            }
        }
    }, [activeTarget, activeState]);

    const layers = [
        new ScatterplotLayer({
            id: 'pulse-layer',
            data: alerts.filter(a => a.coordinates && a.coordinates.length === 2 && !isNaN(a.coordinates[0]) && !isNaN(a.coordinates[1])),
            getPosition: (d: Alert) => d.coordinates,
            getRadius: 30, // Smaller radius for 3D scale
            getFillColor: [0, 242, 255, 120],
            getLineColor: [0, 242, 255],
            stroked: true,
            filled: true,
            radiusScale: 2,
            lineWidthMinPixels: 2,
            parameters: { depthTest: false }
        }),
    ];

    if (!mapTilerKey) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white/50 text-xs font-mono">
                <p>⚠️ MAP API KEY MISSING</p>
                <p>Please add VITE_MAPTILER_KEY to .env</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            {mapError && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-6 text-center animate-in fade-in duration-300">
                    <WifiOff className="w-12 h-12 text-red-500 mb-4 opacity-80" />
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> CONNECTION LOST
                    </h3>
                    <p className="text-white/60 text-sm font-mono max-w-md">
                        {mapError}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded transition-colors uppercase tracking-widest"
                    >
                        Re-initialize Satellite Link
                    </button>
                    <button
                        onClick={() => setMapError(null)}
                        className="mt-2 text-[10px] text-white/30 hover:text-white/50 underline cursor-pointer"
                    >
                        IGNORE & CONTINUE (OFFLINE MODE)
                    </button>
                </div>
            )}
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle={`https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`}
                terrain={{ source: 'maptiler-terrain', exaggeration: 1.5 }}
                onError={(e) => {
                    console.warn("Map Error:", e);
                    // Check specifically for network/fetch errors or tile loading failures
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const error = e.error as any;
                    if (error && (error.message?.includes("Failed to fetch") || error.status === 0 || error.message?.includes("NetworkError"))) {
                        setMapError("SATELLITE DATA STREAM INTERRUPTED. UNABLE TO ESTABLISH SECURE CONNECTION TO ORBITAL ASSETS.");
                    }
                }}
            >
                {/* 3D Terrain Source */}
                <Source
                    id="maptiler-terrain"
                    type="raster-dem"
                    url={`https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${mapTilerKey}`}
                    encoding="mapbox"
                    maxzoom={12}
                />

                {/* 3D Buildings Layer */}
                <Source id="openmaptiles" type="vector" url={`https://api.maptiler.com/tiles/v3/tiles.json?key=${mapTilerKey}`}>
                    <Layer
                        id="3d-buildings"
                        source="openmaptiles"
                        source-layer="building"
                        type="fill-extrusion"
                        minzoom={15}
                        paint={{
                            'fill-extrusion-color': '#222', // Dark buildings
                            'fill-extrusion-height': ['get', 'render_height'],
                            'fill-extrusion-base': ['get', 'render_min_height'],
                            'fill-extrusion-opacity': 0.8
                        }}
                    />
                </Source>

                {/* Violation Outline Layer (Neon Red) */}
                <Source
                    id="violation-source"
                    type="geojson"
                    data={{
                        type: "FeatureCollection",
                        features: alerts
                            .filter(a => a.legal && a.coordinates && a.coordinates.length === 2)
                            .map(a => ({
                                type: "Feature",
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [[
                                        [a.coordinates[0] - 0.001, a.coordinates[1] - 0.001],
                                        [a.coordinates[0] + 0.001, a.coordinates[1] - 0.001],
                                        [a.coordinates[0] + 0.001, a.coordinates[1] + 0.001],
                                        [a.coordinates[0] - 0.001, a.coordinates[1] + 0.001],
                                        [a.coordinates[0] - 0.001, a.coordinates[1] - 0.001]
                                    ]] // Mock 100m box around alert
                                },
                                properties: { ...a, id: a.id }
                            }))
                    }}
                >
                    <Layer
                        id="violation-outline"
                        type="line"
                        paint={{
                            "line-color": "#FF0000",
                            "line-width": 4,
                            "line-blur": 2
                        }}
                    />
                </Source>

                <DeckGLOverlay layers={layers} />
                <NavigationControl position="bottom-right" showCompass={true} showZoom={true} />
            </Map>
        </div>
    );
}
