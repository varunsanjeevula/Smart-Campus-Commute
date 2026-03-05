import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../utils/api';
import ComplaintForm from '../components/ComplaintForm';
import RatingModal from '../components/RatingModal';
import { ArrowLeft, Navigation, Gauge, Clock, AlertTriangle, X, User, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const TrackBus = () => {
    const { busId } = useParams();
    const [bus, setBus] = useState(null);
    const [location, setLocation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [eta, setEta] = useState(null);
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [stops, setStops] = useState([]);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const { data } = await api.get(`/bus/${busId}`);
                setBus(data);
                if (data.lastLocation && data.lastLocation.lat) {
                    setLocation(data.lastLocation);
                } else {
                    setLocation({ lat: 9.9252, lng: 78.1198, speed: 0 });
                }

                if (data.route.includes('Madurai')) {
                    setStops(['Madurai Mattuthavani', 'Periyar Bus Stand', 'Thirumangalam', 'Virudhunagar', 'Kalasalingam College']);
                } else {
                    setStops(['Campus Gate', 'Hostel Block A', 'Library', 'Main Building', 'Sports Complex']);
                }
            } catch (error) {
                console.error("Error fetching bus", error);
            }
        };
        fetchBus();

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [busId]);

    useEffect(() => {
        if (!socket || !bus) return;

        socket.emit('join_bus_room', bus._id);

        socket.on('location_update', (data) => {
            setLocation({
                lat: data.lat,
                lng: data.lng,
                speed: data.speed,
                timestamp: data.timestamp
            });
            setEta(`${Math.floor(Math.random() * 10) + 5} mins`);
        });

        return () => {
            socket.emit('leave_bus_room', bus._id);
            socket.off('location_update');
        };
    }, [socket, bus]);

    if (!location) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Connecting to satellite...</p>
            </div>
        </div>
    );

    return (
        <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-100">
            {/* Map */}
            <MapContainer center={[location.lat, location.lng]} zoom={15} scrollWheelZoom={true} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold">{bus?.busNumber}</h3>
                            <p>Speed: {location.speed} km/h</p>
                        </div>
                    </Popup>
                </Marker>
                <RecenterMap lat={location.lat} lng={location.lng} />
            </MapContainer>

            {/* Back Button */}
            <Link to="/" className="absolute top-4 left-3 sm:left-4 z-[400] bg-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <ArrowLeft size={22} />
            </Link>

            {/* Floating Action Button for Complaints */}
            <button
                onClick={() => setIsComplaintOpen(true)}
                className="md:hidden absolute top-4 right-3 z-[400] bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                title="Report Issue"
            >
                <AlertTriangle size={20} />
            </button>

            {/* Bus Info Card */}
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 md:left-8 md:bottom-8 md:w-96 md:rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[400] border-t md:border border-white/50 max-h-[55vh] md:max-h-[60vh] overflow-y-auto rounded-t-3xl"
            >
                {/* Drag Handle (mobile only) */}
                <div className="md:hidden flex items-center justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-dark">{bus?.busNumber}</h2>
                            <p className="text-gray-500 font-medium text-xs sm:text-sm flex items-center gap-1">
                                <Navigation size={12} className="sm:w-[14px] sm:h-[14px]" /> {bus?.route}
                            </p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase animate-pulse">
                            Live
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 border border-blue-100">
                            <Gauge size={20} className="text-primary mb-0.5 sm:mb-1 sm:w-6 sm:h-6" />
                            <span className="text-xl sm:text-2xl font-bold text-dark">{location.speed || 0}</span>
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">km/h</span>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 border border-purple-100">
                            <Clock size={20} className="text-secondary mb-0.5 sm:mb-1 sm:w-6 sm:h-6" />
                            <span className="text-xl sm:text-2xl font-bold text-dark">{eta || '--'}</span>
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">ETA</span>
                        </div>
                        <div className="col-span-2 bg-orange-50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-between px-4 sm:px-6 border border-orange-100">
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">Distance</span>
                            <span className="text-base sm:text-lg font-bold text-orange-600">~{location.speed ? (15 - (location.speed * 0.1)).toFixed(1) : '12.5'} km</span>
                        </div>
                    </div>

                    {/* Driver Info */}
                    <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 flex items-center gap-3 sm:gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                            alt="Driver"
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase">Driver</p>
                                    <p className="font-bold text-dark text-base sm:text-lg truncate">{bus?.driverId?.name || 'Unknown Driver'}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg shrink-0">
                                    <Star size={12} className="text-yellow-600 fill-current sm:w-[14px] sm:h-[14px]" />
                                    <span className="text-[10px] sm:text-xs font-bold text-yellow-700">
                                        {bus?.driverId?.rating ? bus.driverId.rating.toFixed(1) : 'New'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRatingOpen(true)}
                                className="text-xs font-bold text-primary hover:underline min-h-[32px] flex items-center"
                            >
                                Rate Driver
                            </button>
                        </div>
                    </div>

                    {/* Route Stops */}
                    <div className="mb-4 sm:mb-6">
                        <h4 className="font-bold text-dark mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <MapPin size={14} className="text-gray-400 sm:w-4 sm:h-4" /> Route & ETAs
                        </h4>
                        <div className="relative pl-4 border-l-2 border-gray-200 space-y-4 sm:space-y-6">
                            {stops.map((stop, i) => (
                                <div key={i} className="relative pl-5 sm:pl-6">
                                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 ${i === 0 ? 'bg-primary border-white ring-2 ring-primary' : 'bg-white border-gray-300'}`}></div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p className={`text-xs sm:text-sm ${i === 0 ? 'font-bold text-dark' : 'text-gray-600'}`}>{stop}</p>
                                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shrink-0 ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {i === 0 ? 'Arrived' : `+${i * 15} min`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Report Issue - hidden on mobile (FAB replaces it) */}
                    <button
                        onClick={() => setIsComplaintOpen(true)}
                        className="hidden md:flex w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-100 transition-colors items-center justify-center gap-2 border border-red-100 min-h-[48px]"
                    >
                        <AlertTriangle size={18} /> Report Incident
                    </button>
                </div>
            </motion.div>

            {/* Complaint Modal */}
            <AnimatePresence>
                {isComplaintOpen && (
                    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsComplaintOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-[501] max-h-[90vh]"
                        >
                            {/* Drag Handle */}
                            <div className="sm:hidden flex items-center justify-center pt-3 pb-1">
                                <div className="w-10 h-1 bg-gray-300 rounded-full" />
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-lg">Report Incident</h3>
                                <button onClick={() => setIsComplaintOpen(false)} className="bg-gray-200 p-1.5 rounded-full text-gray-500 hover:bg-gray-300 min-w-[36px] min-h-[36px] flex items-center justify-center">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="max-h-[80vh] overflow-y-auto">
                                <ComplaintForm busId={bus?._id} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Rating Modal */}
            {isRatingOpen && (
                <RatingModal
                    driverId={bus?.driverId?._id}
                    onClose={() => setIsRatingOpen(false)}
                />
            )}
        </div>
    );
};

export default TrackBus;
