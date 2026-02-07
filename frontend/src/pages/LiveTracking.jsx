import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Bus, Navigation } from 'lucide-react';
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

const center = [28.6139, 77.2090]; // New Delhi

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
        const interval = setInterval(fetchBuses, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleBusClick = (bus) => {
        setSelectedBus(bus);
        if (bus.lastLocation) {
            setMapCenter([bus.lastLocation.lat, bus.lastLocation.lng]);
        }
    };

    return (
        <div className="relative h-[calc(100vh-64px)] w-full">
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

            {/* Bus List Overlay */}
            <div className="absolute top-4 right-4 z-[400] hidden md:block w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 max-h-[80vh] overflow-y-auto border border-white/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
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

            {/* Selected Bus Mobile/Desktop Card */}
            {selectedBus && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-6 left-4 right-4 md:left-6 md:w-96 bg-white p-6 rounded-3xl shadow-2xl z-[400]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-dark">{selectedBus.busNumber}</h2>
                            <p className="text-gray-500 font-medium">{selectedBus.route}</p>
                        </div>
                        <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-dark">✕</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <div className="text-gray-500 text-xs font-bold uppercase mb-1">Status</div>
                            <div className="text-green-600 font-bold">{selectedBus.status}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <div className="text-gray-500 text-xs font-bold uppercase mb-1">Speed</div>
                            <div className="text-dark font-bold">{selectedBus.lastLocation?.speed || 0} km/h</div>
                        </div>
                    </div>

                    <Link
                        to={`/track/${selectedBus._id}`}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Navigation size={18} /> Track Full Details
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default LiveTracking;
