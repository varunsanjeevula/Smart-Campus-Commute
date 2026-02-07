import { Link, useLocation } from 'react-router-dom';
import { Bus, Users, MessageSquare, LogOut, PieChart, Map } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: PieChart },
        { id: 'buses', label: 'Fleet Management', icon: Bus },
        { id: 'drivers', label: 'Drivers', icon: Users },
        { id: 'routes', label: 'Routes', icon: Map },
        { id: 'complaints', label: 'Complaints', icon: MessageSquare },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 hidden lg:block overflow-y-auto">
            <div className="p-6">
                <h3 className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">Menu</h3>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
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
        </aside>
    );
};

export default Sidebar;
