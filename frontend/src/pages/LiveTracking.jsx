import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Navigation, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [9.9252, 78.1198]; // Madurai

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], 14);
    }, [lat, lng, map]);
    return null;
};

const LiveTracking = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [mapCenter, setMapCenter] = useState(center);
    const [showBusList, setShowBusList] = useState(false); // For mobile bus list toggle

    const fetchBuses = async () => {
        try {
            const { data } = await api.get('/bus');
            setBuses(data);
        } catch (error) {
            console.error("Error fetching buses", error);
        }
    };

    useEffect(() => {
        fetchBuses();
        const interval = setInterval(fetchBuses, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleBusClick = (bus) => {
        setSelectedBus(bus);
        setShowBusList(false);
        if (bus.lastLocation) {
            setMapCenter([bus.lastLocation.lat, bus.lastLocation.lng]);
        }
    };

    return (
        <div className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] w-full">
            <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />

                {buses.map(bus => (
                    bus.lastLocation && (
                        <Marker
                            key={bus._id}
                            position={[bus.lastLocation.lat, bus.lastLocation.lng]}
                            eventHandlers={{
                                click: () => handleBusClick(bus),
                            }}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold">{bus.busNumber}</h3>
                                    <p>{bus.route}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Desktop: Bus List Sidebar */}
            <div className="absolute top-20 right-4 z-[400] hidden md:block w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 max-h-[calc(100vh-120px)] overflow-y-auto border border-white/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 sticky top-0 bg-white/50 backdrop-blur-md py-2 z-10 rounded-lg px-2">
                    <Bus className="text-primary" size={20} /> Live Buses
                </h3>
                <div className="flex flex-col gap-3">
                    {buses.map(bus => (
                        <button
                            key={bus._id}
                            onClick={() => handleBusClick(bus)}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedBus?._id === bus._id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}
                        >
                            <div className="text-left">
                                <div className="font-bold">{bus.busNumber}</div>
                                <div className={`text-xs ${selectedBus?._id === bus._id ? 'text-white/80' : 'text-gray-500'}`}>{bus.route}</div>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-xs font-bold ${selectedBus?._id === bus._id ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                                {bus.status}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile: Floating Bus List Toggle */}
            <button
                onClick={() => setShowBusList(!showBusList)}
                className="md:hidden absolute top-20 right-3 z-[400] bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-bold text-gray-700 min-h-[48px] active:scale-95 transition-transform"
            >
                <Bus size={18} className="text-primary" />
                <span>{buses.length} Buses</span>
                {showBusList ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>

            {/* Mobile: Bus List Bottom Sheet */}
            <AnimatePresence>
                {showBusList && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-black/30 z-[399]"
                            onClick={() => setShowBusList(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 z-[400] bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-hidden flex flex-col"
                        >
                            {/* Drag Handle */}
                            <div className="flex items-center justify-center pt-3 pb-2">
                                <div className="w-10 h-1 bg-gray-300 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between px-4 pb-3">
                                <h3 className="font-bold text-base flex items-center gap-2 text-gray-800">
                                    <Bus className="text-primary" size={18} /> Live Buses
                                </h3>
                                <button
                                    onClick={() => setShowBusList(false)}
                                    className="text-gray-400 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                                {buses.map(bus => (
                                    <button
                                        key={bus._id}
                                        onClick={() => handleBusClick(bus)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all min-h-[52px] ${selectedBus?._id === bus._id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'}`}
                                    >
                                        <div className="text-left">
                                            <div className="font-bold text-sm">{bus.busNumber}</div>
                                            <div className={`text-xs ${selectedBus?._id === bus._id ? 'text-white/80' : 'text-gray-500'}`}>{bus.route}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-xs font-bold ${selectedBus?._id === bus._id ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                                            {bus.status}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Selected Bus Card */}
            <AnimatePresence>
                {selectedBus && !showBusList && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="absolute bottom-20 md:bottom-6 left-3 right-3 md:left-6 md:w-96 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl z-[400]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-dark">{selectedBus.busNumber}</h2>
                                <p className="text-gray-500 font-medium text-sm">{selectedBus.route}</p>
                            </div>
                            <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-dark p-1 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2">✕</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Status</div>
                                <div className="text-green-600 font-bold text-sm">{selectedBus.status}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Speed</div>
                                <div className="text-dark font-bold text-sm">{selectedBus.lastLocation?.speed || 0} km/h</div>
                            </div>
                        </div>

                        <Link
                            to={`/track/${selectedBus._id}`}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            <Navigation size={18} /> Track Full Details
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveTracking;
