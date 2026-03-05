import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api, { API_BASE } from '../utils/api';
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

const ENDPOINT = API_BASE;

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
        <div style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden', background: '#f3f4f6' }}>
            {/* Map — fills entire screen */}
            <MapContainer center={[location.lat, location.lng]} zoom={15} scrollWheelZoom={true} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
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
            <Link to="/" style={{ position: 'absolute', top: '16px', left: '12px', zIndex: 400, background: '#fff', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', color: '#374151', textDecoration: 'none' }}>
                <ArrowLeft size={22} />
            </Link>

            {/* Floating Action Button for Complaints */}
            <button
                onClick={() => setIsComplaintOpen(true)}
                className="md:hidden"
                style={{ position: 'absolute', top: '16px', right: '12px', zIndex: 400, background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', cursor: 'pointer' }}
                title="Report Issue"
            >
                <AlertTriangle size={20} />
            </button>

            {/* Bus Info Card — Bottom Sheet */}
            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 400,
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                }}
                className="md:left-8 md:bottom-8 md:w-96 md:rounded-3xl md:max-h-[60vh]"
            >
                {/* Drag Handle (mobile only) */}
                <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
                    <div style={{ width: '40px', height: '4px', background: '#d1d5db', borderRadius: '9999px' }} />
                </div>

                <div style={{ padding: '16px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>{bus?.busNumber}</h2>
                            <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Navigation size={12} /> {bus?.route}
                            </p>
                        </div>
                        <div style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', animation: 'pulse 2s infinite' }}>
                            Live
                        </div>
                    </div>

                    {/* Stats — compact row */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, background: '#eff6ff', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #dbeafe' }}>
                            <Gauge size={16} style={{ color: '#3b82f6', margin: '0 auto 4px' }} />
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{location.speed || 0}</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>km/h</div>
                        </div>
                        <div style={{ flex: 1, background: '#faf5ff', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
                            <Clock size={16} style={{ color: '#8b5cf6', margin: '0 auto 4px' }} />
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{eta || '--'}</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>ETA</div>
                        </div>
                        <div style={{ flex: 1, background: '#fff7ed', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fed7aa' }}>
                            <MapPin size={16} style={{ color: '#ea580c', margin: '0 auto 4px' }} />
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ea580c' }}>~{location.speed ? (15 - (location.speed * 0.1)).toFixed(1) : '12.5'}</div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>km</div>
                        </div>
                    </div>

                    {/* Driver Info — compact */}
                    <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                            alt="Driver"
                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Driver</p>
                            <p style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b', margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bus?.driverId?.name || 'Mock Driver'}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef9c3', padding: '4px 8px', borderRadius: '8px', flexShrink: 0 }}>
                            <Star size={12} style={{ color: '#ca8a04' }} fill="#ca8a04" />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#a16207' }}>{bus?.driverId?.rating ? bus.driverId.rating.toFixed(1) : '5.0'}</span>
                        </div>
                        <button
                            onClick={() => setIsRatingOpen(true)}
                            style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '8px 4px' }}
                        >
                            Rate
                        </button>
                    </div>

                    {/* Route Stops */}
                    <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} style={{ color: '#9ca3af' }} /> Route & ETAs
                        </h4>
                        <div style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid #e5e7eb' }}>
                            {stops.map((stop, i) => (
                                <div key={i} style={{ position: 'relative', paddingLeft: '20px', marginBottom: i < stops.length - 1 ? '12px' : 0 }}>
                                    <div style={{
                                        position: 'absolute', left: '-11px', top: '2px', width: '18px', height: '18px', borderRadius: '50%',
                                        border: i === 0 ? '3px solid #3b82f6' : '3px solid #d1d5db',
                                        background: i === 0 ? '#3b82f6' : '#fff',
                                    }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#1e293b' : '#6b7280', margin: 0 }}>{stop}</p>
                                        <span style={{
                                            fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', flexShrink: 0,
                                            background: i === 0 ? '#dcfce7' : '#f3f4f6',
                                            color: i === 0 ? '#15803d' : '#6b7280',
                                        }}>
                                            {i === 0 ? 'Arrived' : `+${i * 15} min`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Report Issue - desktop only */}
                    <button
                        onClick={() => setIsComplaintOpen(true)}
                        className="hidden md:flex"
                        style={{ width: '100%', background: '#fef2f2', color: '#ef4444', padding: '14px', borderRadius: '16px', fontWeight: 700, border: '1px solid #fecaca', display: 'none', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', minHeight: '48px' }}
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
