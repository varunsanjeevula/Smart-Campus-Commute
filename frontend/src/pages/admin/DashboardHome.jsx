import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Bus, Users, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import LiveTracking from '../LiveTracking'; // Reuse existing map

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalBuses: 0,
        activeBuses: 0,
        inactiveBuses: 0,
        totalDrivers: 0,
        openComplaints: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/dashboard');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Buses', value: stats.totalBuses, icon: Bus, color: 'bg-blue-100 text-blue-600' },
        { label: 'Active Buses', value: stats.activeBuses, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
        { label: 'Drivers', value: stats.totalDrivers, icon: Users, color: 'bg-purple-100 text-purple-600' },
        { label: 'Open Complaints', value: stats.openComplaints, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                            <h3 className="text-3xl font-bold text-dark mt-1">{card.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Map Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px] relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-dark flex items-center gap-2">
                        <Smartphone size={16} className="text-primary" /> Live Fleet View
                    </h3>
                </div>
                <LiveTracking adminMode={true} />
            </div>
        </div>
    );
};

export default DashboardHome;
