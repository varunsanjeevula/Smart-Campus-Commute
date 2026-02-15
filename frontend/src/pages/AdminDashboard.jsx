import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardHome from './admin/DashboardHome';
import BusManagement from './admin/BusManagement';
import DriverManagement from './admin/DriverManagement';
import RouteManagement from './admin/RouteManagement';
import Analytics from './admin/Analytics';
import ComplaintManagement from './admin/ComplaintManagement';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    if (authLoading || !user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark mb-1">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user.name}</p>
                    </div>
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'dashboard' && <DashboardHome />}
                    {activeTab === 'buses' && <BusManagement />}
                    {activeTab === 'drivers' && <DriverManagement />}
                    {activeTab === 'routes' && <RouteManagement />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'complaints' && <ComplaintManagement />}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
