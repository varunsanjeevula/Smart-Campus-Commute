import { Link, useLocation } from 'react-router-dom';
import { Bus, Users, MessageSquare, LogOut, PieChart, Map, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: PieChart },
        { id: 'buses', label: 'Fleet Management', icon: Bus },
        { id: 'drivers', label: 'Drivers', icon: Users },
        { id: 'routes', label: 'Routes', icon: Map },
        { id: 'complaints', label: 'Complaints', icon: MessageSquare },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
    ];

    const handleItemClick = (id) => {
        setActiveTab(id);
        if (onClose) onClose();
    };

    const sidebarContent = (
        <>
            <div className="p-6">
                <h3 className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">Menu</h3>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 mt-auto border-t border-gray-100">
                <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
                            <PieChart size={20} />
                        </div>
                        <h4 className="font-bold text-dark text-sm">Pro Tip</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Resolve complaints within 24 hours to maintain a high rating.
                    </p>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 hidden lg:block overflow-y-auto">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
                            onClick={onClose}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[60] shadow-2xl overflow-y-auto flex flex-col"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <span className="font-bold text-lg text-primary">Admin</span>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
