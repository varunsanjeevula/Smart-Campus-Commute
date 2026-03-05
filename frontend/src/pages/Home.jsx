import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Navigation, Clock, Wifi, X, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'react-qr-code';

const BusCardSkeleton = () => (
    <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
        <div className="flex justify-between items-center mb-3">
            <div className="h-5 w-20 skeleton rounded" />
            <div className="h-5 w-16 skeleton rounded-full" />
        </div>
        <div className="h-10 w-full skeleton rounded-lg mb-4" />
        <div className="h-9 w-full skeleton rounded-lg" />
    </div>
);

const Home = () => {
    const [buses, setBuses] = useState([]);
    const [search, setSearch] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scannedBus, setScannedBus] = useState(null);
    const [showQRModal, setShowQRModal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scannerError, setScannerError] = useState(null);
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const { data } = await api.get('/bus');
                setBuses(data);
            } catch (error) {
                console.error("Error fetching buses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, []);

    // QR Scanner — auto-select back camera, no UI dropdown
    useEffect(() => {
        if (!showScanner) return;

        setScannerError(null);
        let html5Qr = null;
        let cancelled = false;

        const startScanner = async () => {
            // Wait for DOM element to be rendered by AnimatePresence
            await new Promise(resolve => setTimeout(resolve, 500));
            if (cancelled) return;

            const container = document.getElementById("qr-reader-container");
            if (!container) {
                setScannerError("Scanner failed to initialize. Please try again.");
                return;
            }

            try {
                html5Qr = new Html5Qrcode("qr-reader-container");
                scannerRef.current = html5Qr;

                await html5Qr.start(
                    { facingMode: "environment" }, // auto-select back camera
                    {
                        fps: 10,
                        qrbox: { width: 220, height: 220 },
                    },
                    (decodedText) => {
                        // Success
                        html5Qr.stop().then(() => {
                            html5Qr.clear();
                            scannerRef.current = null;
                            setShowScanner(false);

                            const foundBus = buses.find(b => b.busNumber === decodedText || b._id === decodedText);
                            if (foundBus) {
                                setScannedBus(foundBus);
                            } else {
                                alert(`Bus not found for QR Code: ${decodedText}`);
                            }
                        }).catch(console.error);
                    },
                    () => { } // Ignore per-frame scan misses
                );
            } catch (err) {
                console.error("Camera error:", err);
                setScannerError("Unable to access camera. Please allow camera permissions and ensure you're on HTTPS.");
            }
        };

        startScanner();

        return () => {
            cancelled = true;
            if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                }).catch(() => { });
            }
        };
    }, [showScanner, buses]);

    const closeScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear();
                scannerRef.current = null;
                setShowScanner(false);
            }).catch(() => {
                setShowScanner(false);
            });
        } else {
            setShowScanner(false);
        }
    };

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
                        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm relative flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowQRModal(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">Scan to Track</h3>
                        <p className="text-gray-500 text-sm mb-6">{showQRModal.busNumber} • {showQRModal.route}</p>

                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-inner">
                            <QRCode
                                value={showQRModal.busNumber}
                                size={180}
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
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            <Navigation size={18} />
                            Track Live Location
                        </button>
                    </motion.div>
                </div>
            )}

            {/* QR Scanner — Full Screen */}
            <AnimatePresence>
                {showScanner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black"
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Header */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'
                        }}>
                            <div>
                                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: 0 }}>Scan QR Code</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' }}>Point at a bus QR code</p>
                            </div>
                            <button
                                onClick={closeScanner}
                                style={{
                                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                                    width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer', color: '#fff'
                                }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Camera container — the library renders video here */}
                        <div
                            id="qr-reader-container"
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        />

                        {/* Viewfinder corners overlay — pointer-events-none so it doesn't block */}
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: '260px', height: '260px', position: 'relative' }}>
                                {/* Corner brackets */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '12px 0 0 0' }} />
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 12px 0 0' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '0 0 0 12px' }} />
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderRadius: '0 0 12px 0' }} />
                                {/* Animated scan line */}
                                <motion.div
                                    style={{
                                        position: 'absolute', left: '8px', right: '8px', height: '2px',
                                        background: 'linear-gradient(to right, transparent, #60a5fa, transparent)'
                                    }}
                                    animate={{ top: ['10%', '90%', '10%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
                            textAlign: 'center', padding: '24px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, margin: '0 0 4px' }}>
                                Align QR code within the frame
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>
                                Scanning will happen automatically
                            </p>
                        </div>

                        {/* Error overlay */}
                        {scannerError && (
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 30,
                                background: 'rgba(0,0,0,0.85)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', padding: '24px'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '64px', height: '64px', background: 'rgba(239,68,68,0.2)',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', margin: '0 auto 16px'
                                    }}>
                                        <X size={32} style={{ color: '#f87171' }} />
                                    </div>
                                    <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>Camera Error</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 24px' }}>{scannerError}</p>
                                    <button
                                        onClick={closeScanner}
                                        style={{
                                            background: '#fff', color: '#000', border: 'none',
                                            padding: '12px 24px', borderRadius: '12px',
                                            fontWeight: 700, fontSize: '14px', cursor: 'pointer', minHeight: '48px'
                                        }}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative bg-dark text-white overflow-hidden pb-12 sm:pb-20 pt-20 sm:pt-24">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[20%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-secondary/30 blur-3xl animate-blob"></div>
                    <div className="absolute bottom-[-20%] right-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-primary/40 blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-8 heading-font leading-tight tracking-tight">
                            Smart Campus Commute <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Real-Time Tracking
                            </span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 font-light px-2">
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
                        <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center pointer-events-none text-gray-400">
                            <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find your bus..."
                            className="w-full pl-12 sm:pl-16 pr-14 sm:pr-16 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-secondary/50 shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="absolute inset-y-0 right-3 sm:right-4 flex items-center text-gray-400 hover:text-dark transition-colors p-1 min-w-[44px] min-h-[44px] justify-center"
                            onClick={() => setShowScanner(true)}
                            title="Scan QR Code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Bus Grid */}
            <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-dark">Available Buses</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Wifi size={14} className="text-green-500 animate-pulse sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Live Updates</span>
                        <span className="xs:hidden">Live</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mb-6 sm:mb-0 sm:mt-0">
                    <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-gray-100 px-4 py-2.5 rounded-full"
                        onClick={() => navigate('/complaint-status')}
                    >
                        <span className="text-sm font-medium">✨ Track a Complaint</span>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                        {[...Array(6)].map((_, i) => <BusCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
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
                                transition={{ delay: index * 0.05 }}
                                className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 overflow-hidden group flex flex-col p-4 sm:p-5 hover:border-blue-200 relative active:scale-[0.98]"
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowQRModal(bus);
                                    }}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-gray-600 transition-colors bg-white/50 p-2 rounded-lg hover:bg-white min-w-[40px] min-h-[40px] flex items-center justify-center"
                                    title="Show QR Code"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                                </button>

                                <div className="flex justify-between items-center mb-3 pr-10">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{bus.busNumber}</h3>
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
                                    className="mt-auto w-full flex items-center justify-center gap-2 bg-white text-gray-600 py-3 sm:py-2.5 rounded-lg font-semibold text-xs border border-blue-100 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 group-hover:shadow-blue-100 min-h-[44px]"
                                >
                                    <Navigation size={14} />
                                    Track Live
                                </button>
                            </motion.div>
                        ))}

                        {!loading && buses.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <p>No buses found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
