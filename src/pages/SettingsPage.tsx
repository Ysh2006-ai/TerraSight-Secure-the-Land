import { ToggleLeft, ToggleRight, User, Bell, Shield, Database } from 'lucide-react';
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
    return (
        <div className="p-6 md:p-10 text-white h-full overflow-y-auto max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-bold mb-8">System Configuration</h1>

            <SettingSection title="Account & Profile" icon={User}>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                    <img src="https://ui-avatars.com/api/?name=Commander+Shepard&background=0D8ABC&color=fff" className="w-16 h-16 rounded-full" alt="Avatar" />
                    <div>
                        <div className="font-bold text-lg">Commander Shepard</div>
                        <div className="text-gray-400">admin@terrasight.ai</div>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors text-sm">Edit Profile</button>
                </div>
            </SettingSection>

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
                        <div className="font-mono mt-1">v1.0.4-stable</div>
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
