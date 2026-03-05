import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, MessageSquare, User, LogIn } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/live-map', icon: Map, label: 'Live Map' },
    { path: '/complaint-status', icon: MessageSquare, label: 'Complaints' },
    { path: user ? '/profile' : '/login', icon: user ? User : LogIn, label: user ? 'Profile' : 'Login' },
  ];

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[48px]"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-400'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
