import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, CheckCircle, AlertCircle, XCircle, Menu } from 'lucide-react';
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    if (authLoading || !user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
                <header className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger for sidebar */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-0.5 sm:mb-1">Dashboard</h1>
                            <p className="text-gray-500 text-sm sm:text-base">Welcome back, {user.name}</p>
                        </div>
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
