import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Navigation, Clock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [buses, setBuses] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const { data } = await api.get('/bus');
                setBuses(data);
            } catch (error) {
                console.error("Error fetching buses", error);
            }
        };
        fetchBuses();
    }, []);

    const handleTrack = (busId) => {
        navigate(`/track/${busId}`);
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-dark text-white overflow-hidden pb-20 pt-24">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] rounded-full bg-secondary/30 blur-3xl animate-blob"></div>
                    <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-primary/40 blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 heading-font leading-tight tracking-tight">
                            Smart Campus Commute <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Real-Time Tracking
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
                            Experience seamless transit with our advanced tracking system. Know your bus location, estimated arrival, and route details instantly.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find your bus (e.g., Loop 1, Bus 42)..."
                            className="w-full pl-16 pr-16 py-5 rounded-2xl text-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-secondary/50 shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-dark transition-colors"
                            onClick={() => {
                                // Simulate scanning Bus 10
                                const bus10 = buses.find(b => b.busNumber === '10');
                                if (bus10) handleTrack(bus10.busNumber);
                                else alert('Scan Simulated: Navigating to Bus 10');
                            }}
                            title="Scan QR Code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Bus Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-dark">Available Buses</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Wifi size={16} className="text-green-500 animate-pulse" />
                        Live Updates Active
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                        onClick={() => navigate('/complaint-status')}
                    >
                        <span className="text-sm font-medium">✨ Track a Complaint</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buses.filter(b => {
                        const term = search.toLowerCase();
                        const num = b.busNumber?.toLowerCase() || '';
                        const route = b.route?.toLowerCase() || '';
                        return num.includes(term) || route.includes(term);
                    }).map((bus, index) => (
                        <motion.div
                            key={bus._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Clock size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {bus.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-dark mb-1">{bus.busNumber}</h3>
                            <div className="flex items-center gap-2 text-gray-500 mb-6">
                                <MapPin size={16} />
                                <span className="text-sm font-medium">{bus.route}</span>
                            </div>

                            <button
                                onClick={() => handleTrack(bus.busNumber)}
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-dark py-3 rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all"
                            >
                                <Navigation size={18} />
                                Track Live
                            </button>
                        </motion.div>
                    ))}

                    {buses.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <p>No buses found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
