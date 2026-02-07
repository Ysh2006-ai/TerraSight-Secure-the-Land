import AlertsView from '../components/AlertsView';

export const AlertsPage = () => {
    return (
        <div className="p-6 md:p-10 text-white h-full overflow-y-auto">
            <h1 className="text-3xl font-display font-bold mb-6">Threat Intelligence Stream</h1>
            <div className="max-w-5xl">
                <AlertsView />
            </div>
        </div>
    );
};
