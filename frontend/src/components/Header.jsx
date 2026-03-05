import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, User, LogOut, LayoutDashboard, Menu, X, Map, MessageSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: null },
        { path: '/live-map', label: 'Live Map', icon: Map },
        { path: '/complaint-status', label: 'Track Complaint', icon: MessageSquare },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary heading-font">
                        <div className="bg-primary text-white p-1.5 rounded-lg">
                            <Bus size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span>BusTrack</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-gray-600'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-6">
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive('/admin') ? 'text-primary' : 'text-gray-600'}`}
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-4">
                                    <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
                                        <User size={16} />
                                        <span>{user.name || 'User'}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-700 p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Slide-in Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[60] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <span className="font-bold text-lg text-primary">Menu</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="Close menu"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <div className="flex-1 overflow-y-auto py-4">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors min-h-[52px] ${isActive(link.path) ? 'text-primary bg-blue-50 border-r-2 border-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {link.icon && <link.icon size={20} />}
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {user && user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors min-h-[52px] ${isActive('/admin') ? 'text-primary bg-blue-50 border-r-2 border-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <LayoutDashboard size={20} />
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Drawer Footer */}
                            <div className="border-t border-gray-100 p-5">
                                {user ? (
                                    <div className="space-y-3">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium min-h-[48px]"
                                        >
                                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold truncate">{user.name || 'User'}</div>
                                                <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-medium rounded-xl border border-red-100 hover:bg-red-50 transition-colors min-h-[48px]"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors min-h-[48px]"
                                    >
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
