/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

import { useEffect } from "react";
import { useMission } from "../context/MissionContext";
import { supabase } from "../lib/supabase/client";
import { fetchMultiSourceData } from "../lib/engine/fusion";
import { processFusedScene } from "../lib/engine/orchestrator";

interface Detection {
    id: number | string;
    blockchain_hash?: string;
    severity: "CRITICAL" | "WARNING" | "INFO" | "HIGH";
    coords: {
        lat: number;
        lng: number;
    };
    violation_type: string;
    section: string;
    penalty_type: string;
    img_url?: string;
    [key: string]: unknown;
}

export default function useRealtimeAlerts() {
    const { addAlert, setActiveTarget, systemReady, activeState, addLog, activeTarget } = useMission();

    // 0. INITIAL FETCH: Load existing detections on page load
    useEffect(() => {
        if (!systemReady) return;

        const fetchExistingAlerts = async () => {
            // Clear previous state alerts first (optional, but cleaner)
            // setAlerts([]); // Cannot access setAlerts directly here, relying on filter

            console.log("[useRealtimeAlerts] Fetching existing detections...");
            const { data, error } = await supabase
                .from('detections')
                .select('*')
                .eq('status', 'VERIFIED')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error("[useRealtimeAlerts] Initial fetch error:", error);
                return;
            }

            if (data && data.length > 0) {
                console.log(`[useRealtimeAlerts] Loaded ${data.length} existing alerts`);
                data.forEach((detection: any) => {
                    const alert: any = {
                        id: detection.id?.toString() || detection.blockchain_hash?.slice(-8) || "UNKNOWN",
                        type: detection.severity || "INFO",
                        loc: `${Number(detection.coords?.lat || 0).toFixed(4)}° N, ${Number(detection.coords?.lng || 0).toFixed(4)}° E`,
                        coordinates: [detection.coords?.lng || 0, detection.coords?.lat || 0] as [number, number],
                        msg: `[ARCHIVED] ${detection.violation_type || 'Anomaly'}`,
                        time: new Date(detection.created_at).toLocaleTimeString('en-IN', { hour12: false }) + " (DB)",
                        txHash: detection.blockchain_hash || "PENDING",
                        img_url: detection.img_url,
                        legal: {
                            act: detection.violation_type,
                            section: 'Section 15',
                            penalty: 'Seizure',
                            severity: detection.severity
                        }
                    };

                    // STRICT STATE FILTERING: Check if alert is within active state bounds
                    if (activeState && activeState.bbox) {
                        const [lng, lat] = alert.coordinates;
                        const [minLng, minLat, maxLng, maxLat] = activeState.bbox;
                        if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
                            return; // Skip alerts outside active state
                        }
                    }

                    addAlert(alert);
                });
            } else {
                console.log("[useRealtimeAlerts] No existing alerts found in database");
            }
        };

        fetchExistingAlerts();
    }, [systemReady, addAlert, activeState]);

    // 1. Listen for Verified Detections (The Receiver)
    useEffect(() => {
        if (!systemReady) return;

        const channel = supabase
            .channel('realtime-detections')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'detections', filter: "status=eq.VERIFIED" },
                (payload: RealtimePostgresInsertPayload<Detection>) => {
                    const detection = payload.new;
                    console.log("[Realtime] Received verified detection:", detection);

                    const newAlert: any = {
                        id: detection.id?.toString() || detection.blockchain_hash?.slice(-8) || "UNKNOWN",
                        type: detection.severity,
                        loc: `${Number(detection.coords.lat).toFixed(4)}° N, ${Number(detection.coords.lng).toFixed(4)}° E`,
                        coordinates: [detection.coords.lng, detection.coords.lat] as [number, number],
                        msg: `${detection.violation_type} - VIOLATION DETECTED`,
                        time: "JUST NOW",
                        txHash: detection.blockchain_hash || "PENDING",
                        img_url: detection.img_url,
                        legal: {
                            act: detection.violation_type, // or 'law' column if exists? using type as law name for now
                            section: detection.section,
                            penalty: detection.penalty_type,
                            severity: detection.severity
                        }
                    };

                    // STRICT REALTIME FILTERING
                    if (activeState && activeState.bbox) {
                        const [lng, lat] = newAlert.coordinates;
                        const [minLng, minLat, maxLng, maxLat] = activeState.bbox;
                        if (lat < minLat || lat > maxLat || lng < minLng || lng > maxLng) {
                            console.log(`[Realtime] Ignored alert outside ${activeState.name}:`, newAlert.loc);
                            return;
                        }
                    }

                    addAlert(newAlert);

                    if (detection.severity === "CRITICAL") {
                        setActiveTarget(newAlert);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [systemReady, addAlert, setActiveTarget]);

    // 2. LIVE SCANNER (Real-Time Triggers)
    useEffect(() => {
        if (!systemReady) return;

        const runLiveScan = async () => {
            // Only scan if we have a valid state and NO active target (Pause for review)
            if (!activeState || activeTarget) return;

            // Real timestamp for verification
            const scanTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
            addLog(`[${scanTime}] 🔴 LIVE SCAN: ${activeState.name}`);

            // Use FULL BBOX for coverage - pick random point across entire state
            let lat: number, lng: number;
            if (activeState.bbox) {
                const [minLng, minLat, maxLng, maxLat] = activeState.bbox;
                // Add more randomization to avoid clustering
                const latRange = maxLat - minLat;
                const lngRange = maxLng - minLng;

                lng = minLng + Math.random() * lngRange;
                lat = minLat + Math.random() * latRange;

                console.log(`[DEBUG] Scan bounds: [${minLat.toFixed(2)}, ${maxLat.toFixed(2)}] x [${minLng.toFixed(2)}, ${maxLng.toFixed(2)}]`);
            } else {
                // Fallback to center with larger offset for more variety
                lat = activeState.coordinates[1] + (Math.random() * 0.5 - 0.25);
                lng = activeState.coordinates[0] + (Math.random() * 0.5 - 0.25);
            }

            addLog(`[Sat-Link] Target Acquired: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);

            try {
                // 1. Fetch Real/Simulated Satellite Data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fusedScene = await fetchMultiSourceData(lat, lng, activeState.code as any);
                addLog(`[Fusion] Scene ready. Processing...`);

                // 2. Run Orchestration (AI + Legal + Blockchain)
                const result = await processFusedScene(fusedScene, (msg) => {
                    if (msg.includes("[DB]")) return; // Skip internal DB logs to avoid clutter
                    addLog(msg);
                });

                // DEBUG: Log result status
                console.log(`[DEBUG] Orchestration Result:`, result.status, result.message);
                addLog(`[Result] Status: ${result.status} | ${result.message || 'No message'}`);

                // Handle detection result
                if (result.status === 'VERIFIED') {
                    const alertTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
                    const localAlert: any = {
                        id: result.id || result.txHash?.slice(-8) || "LIVE-" + Date.now(),
                        type: result.verdict?.severity || "HIGH",
                        loc: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
                        coordinates: [lng, lat],
                        msg: `🔴 NEW: ${result.verdict?.law || 'Violation'} - ${result.message || 'DETECTED'}`,
                        time: alertTime,
                        txHash: result.txHash || "PENDING",
                        img_url: fusedScene.layers.sentinel2_optical.url,
                        legal: {
                            act: result.verdict?.law,
                            section: result.verdict?.section,
                            penalty: result.verdict?.penalty,
                            severity: result.verdict?.severity
                        }
                    };

                    // Add via context (optimistic update)
                    addAlert(localAlert);
                    addLog(`[ALERT] 🚨 NEW DETECTION at ${alertTime}!`);

                    // ALWAYS fly to new detection
                    setActiveTarget(localAlert);
                    console.log(`[DEBUG] New alert added:`, localAlert.id);
                } else {
                    addLog(`[Scan] No violation at this point.`);
                }

            } catch (error) {
                console.error("Live Scan Error:", error);
                addLog(`[Error] ${error instanceof Error ? error.message : "Scan Failed"}`);
            }
        };

        // Scan every 10 seconds (Real-Time Polling)
        const interval = setInterval(runLiveScan, 10000);

        // Run once immediately on state change
        if (activeState) runLiveScan();

        return () => clearInterval(interval);
    }, [systemReady, activeState, activeTarget, addLog, addAlert, setActiveTarget]);
}
