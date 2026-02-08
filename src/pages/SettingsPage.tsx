import { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, User, Bell, Shield, Database, Mail } from 'lucide-react';

// ... (previous imports and interfaces remain the same) ...
import type { LucideIcon } from 'lucide-react';

interface SettingSectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

const SettingSection = ({ title, icon: Icon, children }: SettingSectionProps) => (
    <div className="mb-8 bg-brand-navy/30 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icon className="text-brand-cyan" size={20} />
            {title}
        </h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const ToggleRow = ({ label, desc, checked = false }: { label: string, desc: string, checked?: boolean }) => (
    <div className="flex items-center justify-between">
        <div>
            <div className="font-medium text-white">{label}</div>
            <div className="text-sm text-gray-500">{desc}</div>
        </div>
        <button className={`text-2xl ${checked ? 'text-brand-green' : 'text-gray-600'}`}>
            {checked ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
    </div>
);

export const SettingsPage = () => {
    // Escalation Protocol State
    const [juniorEmail, setJuniorEmail] = useState('officer@terrasight.com');
    const [seniorEmail, setSeniorEmail] = useState('admin@ministry.gov');

    // EmailJS Config State
    const [serviceId, setServiceId] = useState('service_bgu3mnc');
    const [templateId, setTemplateId] = useState('template_4en0wvm');
    const [publicKey, setPublicKey] = useState('H_VoaK-bh-LDAebpt');

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const loadedJunior = localStorage.getItem('juniorEmail');
        const loadedSenior = localStorage.getItem('seniorEmail');
        const loadedService = localStorage.getItem('emailjs_serviceId');
        const loadedTemplate = localStorage.getItem('emailjs_templateId');
        const loadedKey = localStorage.getItem('emailjs_publicKey');

        if (loadedJunior) setJuniorEmail(loadedJunior);
        if (loadedSenior) setSeniorEmail(loadedSenior);
        if (loadedService) setServiceId(loadedService);
        if (loadedTemplate) setTemplateId(loadedTemplate);
        if (loadedKey) setPublicKey(loadedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem('juniorEmail', juniorEmail);
        localStorage.setItem('seniorEmail', seniorEmail);
        localStorage.setItem('emailjs_serviceId', serviceId);
        localStorage.setItem('emailjs_templateId', templateId);
        localStorage.setItem('emailjs_publicKey', publicKey);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-6 md:p-10 text-white h-full overflow-y-auto max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold">System Configuration</h1>
                <button
                    onClick={handleSave}
                    className={`px-6 py-2 rounded font-bold transition-all ${saved ? 'bg-brand-green text-black' : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/50 hover:bg-brand-cyan/30'}`}
                >
                    {saved ? "CONFIGURATION SAVED" : "SAVE CHANGES"}
                </button>
            </div>

            <SettingSection title="Escalation Protocols & Alerts" icon={Mail}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-brand-green uppercase font-mono">Field Officer Email (Junior)</label>
                        <input
                            type="email"
                            value={juniorEmail}
                            onChange={(e) => setJuniorEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-brand-green outline-none"
                            placeholder="officer@gmail.com"
                        />
                        <p className="text-[10px] text-gray-500">Receives Initial FIR Reports</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-red-400 uppercase font-mono">Ministry Authority Email (Senior)</label>
                        <input
                            type="email"
                            value={seniorEmail}
                            onChange={(e) => setSeniorEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-red-500 outline-none"
                            placeholder="admin@gov.in"
                        />
                        <p className="text-[10px] text-gray-500">Receives Escalated Violations</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Email Delivery Service (EmailJS)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 uppercase">Service ID</label>
                            <input
                                type="text"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-gray-300 font-mono focus:border-brand-cyan outline-none"
                                placeholder="service_xyz"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 uppercase">Template ID</label>
                            <input
                                type="text"
                                value={templateId}
                                onChange={(e) => setTemplateId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-gray-300 font-mono focus:border-brand-cyan outline-none"
                                placeholder="template_abc"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-400 uppercase">Public Key</label>
                            <input
                                type="password"
                                value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-gray-300 font-mono focus:border-brand-cyan outline-none"
                                placeholder="***************"
                            />
                        </div>
                    </div>
                    <p className="mt-2 text-[10px] text-gray-500">
                        Required for sending real emails directly from the dashboard.
                        Keys are stored locally in your browser.
                    </p>
                </div>
            </SettingSection>

            <SettingSection title="Account & Profile" icon={User}>
                {/* ... existing profile content ... */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                    <img src="https://ui-avatars.com/api/?name=Commander+Shepard&background=0D8ABC&color=fff" className="w-16 h-16 rounded-full" alt="Avatar" />
                    <div>
                        <div className="font-bold text-lg">Commander Shepard</div>
                        <div className="text-gray-400">admin@terrasight.ai</div>
                    </div>
                </div>
            </SettingSection>

            {/* ... other existing sections ... */}
            <SettingSection title="Notifications" icon={Bell}>
                <ToggleRow label="Real-time Alerts" desc="Receive push notifications for critical threats" checked />
                <ToggleRow label="Email Digests" desc="Daily summary of planetary health stats" />
                <ToggleRow label="Siren Integration" desc="Trigger physical sirens in local outposts" checked />
            </SettingSection>

            <SettingSection title="Data & Privacy" icon={Shield}>
                <ToggleRow label="Anonymize Analyst Data" desc="Remove personal identifiers from logs" checked />
                <ToggleRow label="Share Telemetry" desc=" Contribute anonymous data to global research" />
            </SettingSection>

            <SettingSection title="System" icon={Database}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded border border-white/5">
                        <div className="text-xs text-gray-400 uppercase">Version</div>
                        <div className="font-mono mt-1">v1.1.0-demo</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded border border-white/5">
                        <div className="text-xs text-gray-400 uppercase">API Endpoint</div>
                        <div className="font-mono mt-1 text-brand-cyan">api.terrasight.ai</div>
                    </div>
                </div>
            </SettingSection>
        </div>
    );
};
