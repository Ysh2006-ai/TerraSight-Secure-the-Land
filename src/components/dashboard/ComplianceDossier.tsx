import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle, Scale, ImageOff } from "lucide-react";
import { useMission } from "../../context/MissionContext";
import { generateFIR } from "../../lib/governance/fir";
import { useState } from "react";

export default function ComplianceDossier() {
    const { activeTarget } = useMission();
    const [generating, setGenerating] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleGenerateNotice = async () => {
        if (!activeTarget) return;
        setGenerating(true);
        try {
            // Generate PDF bytes
            const pdfBytes = await generateFIR(activeTarget.id, activeTarget);

            // Create Blob and Download
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `LEGAL_NOTICE_${activeTarget.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (e) {
            console.error("PDF Generation Failed", e);
        } finally {
            setGenerating(false);
        }
    };

    if (!activeTarget) {
        return (
            <div className="absolute top-16 right-6 w-80 h-[calc(100%-5rem)] z-40 glass-panel rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                <Shield className="w-12 h-12 text-white/10" />
                <p className="text-xs text-white/40 font-mono">
                    AWAITING TARGET SELECTION<br />
                    SELECT AN ALERT TO VIEW DOSSIER
                </p>
            </div>
        );
    }

    // Mock Legal Data if missing
    const legal = activeTarget.legal || {
        act: "Environmental Protection Act, 1986",
        section: "Section 15",
        penalty: "Seizure of Assets",
        severity: "CRITICAL"
    };

    return (
        <div className="absolute top-16 right-6 w-80 h-[calc(100%-5rem)] z-40 glass-panel rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-red-500/10">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-red-400 flex items-center gap-2 tracking-widest">
                        <AlertTriangle className="w-4 h-4" /> VIOLATION DETECTED
                    </h2>
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/30">
                        {activeTarget.type}
                    </span>
                </div>
                <div className="text-xs text-white/70 font-mono break-all">
                    ID: {activeTarget.id}
                </div>
            </div>

            {/* Evidence Preview */}
            <div className="h-48 bg-black/50 relative group flex items-center justify-center">
                {!imageError ? (
                    <img
                        src={activeTarget.img_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sentinel-2_image_of_Lake_Constance.jpg/640px-Sentinel-2_image_of_Lake_Constance.jpg"}
                        alt="Evidence"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-white/40 space-y-2">
                        <ImageOff className="w-8 h-8" />
                        <span className="text-xs font-mono">IMAGE UNAVAILABLE</span>
                    </div>
                )}
                <div className="absolute bottom-2 right-2 text-[10px] text-electric-cyan font-mono bg-black/50 px-1">
                    EVIDENCE #0492
                </div>
            </div>

            {/* Legal Analysis */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">

                {/* Governance Engine Output */}
                <div className="space-y-2">
                    <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest flex items-center gap-2">
                        <Scale className="w-3 h-3" /> Governance Protocol
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-white/60">ACT</span>
                            <span className="text-white text-right w-1/2">{legal.act as string}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-white/60">SECTION</span>
                            <span className="text-red-400 font-mono">{legal.section as string}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-white/60">PENALTY</span>
                            <span className="text-white font-mono">{legal.penalty as string}</span>
                        </div>
                    </div>
                </div>

                {/* Automation Actions */}
                <div className="space-y-3">
                    <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Auto-Generated Actions
                    </h3>

                    <motion.button
                        layout
                        onClick={handleGenerateNotice}
                        disabled={generating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors ${generating ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <FileText className="w-4 h-4" />
                        {generating ? 'GENERATING...' : 'GENERATE LEGAL NOTICE (PDF)'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-electric-cyan/10 border border-electric-cyan/30 hover:bg-electric-cyan/20 text-electric-cyan text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <CheckCircle className="w-4 h-4" /> DISPATCH FIELD UNIT
                    </motion.button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-[9px] text-center text-white/30 font-mono">
                SECURE RECORD // HASH: {activeTarget.txHash?.slice(0, 16)}...
            </div>
        </div>
    );
}
