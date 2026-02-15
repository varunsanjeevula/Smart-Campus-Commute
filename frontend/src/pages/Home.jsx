import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Navigation, Clock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import QRCode from 'react-qr-code';

const Home = () => {
    const [buses, setBuses] = useState([]);
    const [search, setSearch] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scannedBus, setScannedBus] = useState(null);
    const [showQRModal, setShowQRModal] = useState(null);
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

    // QR Scanner Logic
    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(async (decodedText) => {
                // Success Callback
                scanner.clear();
                setShowScanner(false);

                // Assuming decodedText is the busNumber or ID
                const foundBus = buses.find(b => b.busNumber === decodedText || b._id === decodedText);

                if (foundBus) {
                    setScannedBus(foundBus);
                } else {
                    alert(`Bus not found for QR Code: ${decodedText}`);
                }
            }, (error) => {
                // Error Callback (ignore for scanning in progress)
                console.warn(error);
            });

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        }
    }, [showScanner, buses]);

    const handleTrack = (busId) => {
        navigate(`/track/${busId}`);
    };

    return (
        <div>
            {/* Show Bus QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowQRModal(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowQRModal(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">Scan to Track</h3>
                        <p className="text-gray-500 text-sm mb-6">{showQRModal.busNumber} • {showQRModal.route}</p>

                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-inner">
                            <QRCode
                                value={showQRModal.busNumber}
                                size={200}
                                level="H"
                            />
                        </div>

                        <p className="mt-6 text-xs text-gray-400 text-center">
                            Scan this code with the app scanner <br /> to view live location.
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Scanned Bus Modal */}
            {scannedBus && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setScannedBus(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setScannedBus(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock size={32} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{scannedBus.busNumber}</h2>
                            <p className="text-gray-500 font-medium">{scannedBus.route}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 text-sm font-medium">Status</span>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${scannedBus.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {scannedBus.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500 text-sm font-medium">Speed</span>
                                <span className="font-bold text-gray-800">{scannedBus.lastLocation?.speed || 0} km/h</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setScannedBus(null);
                                handleTrack(scannedBus.busNumber);
                            }}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Navigation size={18} />
                            Track Live Location
                        </button>
                    </motion.div>
                </div>
            )}

            {/* QR Scanner Modal */}
            {showScanner && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md relative">
                        <button
                            onClick={() => setShowScanner(false)}
                            className="absolute top-4 right-4 z-10 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                        <div id="reader" className="w-full"></div>
                        <p className="text-center py-4 text-gray-500 font-medium">Point camera at a Bus QR Code</p>
                    </div>
                </div>
            )}

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
                            onClick={() => setShowScanner(true)}
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
                            className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 overflow-hidden group flex flex-col p-5 hover:border-blue-200 relative"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowQRModal(bus);
                                }}
                                className="absolute top-2 right-2 text-gray-300 hover:text-gray-600 transition-colors bg-white/50 p-1.5 rounded-lg hover:bg-white"
                                title="Show QR Code"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                            </button>

                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{bus.busNumber}</h3>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${bus.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${bus.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    {bus.status}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-500 mb-4 bg-white/60 px-3 py-2 rounded-lg border border-blue-50">
                                <MapPin size={14} className="text-indigo-400 shrink-0" />
                                <span className="text-xs font-semibold text-gray-600 line-clamp-1" title={bus.route}>
                                    {bus.route.split(' to ').join(' ➝ ')}
                                </span>
                            </div>

                            <button
                                onClick={() => handleTrack(bus.busNumber)}
                                className="mt-auto w-full flex items-center justify-center gap-2 bg-white text-gray-600 py-2.5 rounded-lg font-semibold text-xs border border-blue-100 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 group-hover:shadow-blue-100"
                            >
                                <Navigation size={14} />
                                Track Live
                            </button>
                        </motion.div>
                    ))}

                    {
                        buses.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <p>No buses found matching your search.</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;
