import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Hide header on Admin Dashboard as it will have its own sidebar maybe? 
    // Actually plan says sidebar for admin, but let's keep header for now or hide it.
    // Let's keep it but make it sleek.

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary heading-font">
                    <div className="bg-primary text-white p-1.5 rounded-lg">
                        <Bus size={24} />
                    </div>
                    <span>BusTrack</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">

                    <Link
                        to="/"
                        className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-gray-600'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/live-map"
                        className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/live-map') ? 'text-primary' : 'text-gray-600'}`}
                    >
                        Live Map
                    </Link>

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
                <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium">Home</Link>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium">My Profile</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium">Dashboard</Link>
                                    )}
                                    <button onClick={logout} className="text-red-500 font-medium text-left">Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-primary font-medium">Login</Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
