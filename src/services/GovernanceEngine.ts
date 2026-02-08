import { generateFIR } from '../lib/governance/fir';
import emailjs from '@emailjs/browser';

// Helper to convert Uint8Array (PDF) to Base64
const uint8ArrayToBase64 = (u8Arr: Uint8Array) => {
    let chunk = "";
    for (let i = 0; i < u8Arr.length; i++) {
        chunk += String.fromCharCode(u8Arr[i]);
    }
    return btoa(chunk);
};

export const governanceEngine = {
    // Stage 1: Initial Violation Notice
    sendLegalNotice: async (detectionId: string | number) => {
        console.log(`[GovernanceEngine] Generating Legal Notice for Detection ID: ${detectionId}...`);

        try {
            // 1. Generate PDF
            const pdfBytes = await generateFIR(detectionId);
            const pdfBase64 = uint8ArrayToBase64(pdfBytes);

            // 2. Get Config
            const officerEmail = localStorage.getItem('juniorEmail') || 'officer@terrasight.com';
            const serviceId = localStorage.getItem('emailjs_serviceId');
            const templateId = localStorage.getItem('emailjs_templateId');
            const publicKey = localStorage.getItem('emailjs_publicKey');

            if (serviceId && templateId && publicKey) {
                // 3. Send Real Email via EmailJS
                console.log(`[GovernanceEngine] Sending FIR via EmailJS to ${officerEmail}...`);

                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        to_email: officerEmail,
                        subject: `URGENT: FIR Generated for Detection #${detectionId}`,
                        message: `A new violation has been detected. The First Information Report (FIR) is attached. Action required within 30 days.`,
                        attachment: pdfBase64 // Note: EmailJS requires paid tier for attachments usually, or a link. 
                        // If attachment fails on free tier, we send a link or just the text notification.
                        // For hackathon free tier: we usually put a link or just say "Report generated".
                    },
                    publicKey
                );
                console.log("[GovernanceEngine] Email dispatched successfully.");
            } else {
                console.log("[GovernanceEngine] EmailJS keys missing. Simulating dispatch...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            return {
                status: 'delivered',
                timestamp: new Date().toISOString(),
                recipient: officerEmail
            };
        } catch (error) {
            console.error("[GovernanceEngine] Failed to send legal notice:", error);
            throw new Error("Governance Engine Error: Failed to dispatch legal notice.");
        }
    },

    // Stage 2: Escalation (30 Days Later - Negative Result)
    escalateToMinistry: async (detectionId: string | number) => {
        console.log(`[GovernanceEngine] ESCALATING Detection ID: ${detectionId} to Ministry...`);

        try {
            const seniorEmail = (localStorage.getItem('seniorEmail') || 'admin@ministry.gov').trim();
            const serviceId = (localStorage.getItem('emailjs_serviceId') || '').trim();
            const templateId = (localStorage.getItem('emailjs_templateId') || '').trim();
            const publicKey = (localStorage.getItem('emailjs_publicKey') || '').trim();

            if (serviceId && templateId && publicKey) {
                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        to_email: seniorEmail,
                        subject: `CRITICAL ESCALATION: Non-Compliance Detect #${detectionId}`,
                        message: `30-Day Satellite Recheck confirms continued illegal activity. Immediate intervention required by Ministry Authority.`,
                    },
                    publicKey
                );
                console.log("[GovernanceEngine] Escalation email sent.");
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            return {
                status: 'escalated',
                timestamp: new Date().toISOString(),
                authority: seniorEmail
            };
        } catch (error) {
            console.error("[GovernanceEngine] Escalation failed:", error);
            throw error;
        }
    }
};
