import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api, { API_BASE } from '../utils/api';
import useIsMobile from '../hooks/useIsMobile';
import TrackBusMobile from './TrackBusMobile';
import TrackBusDesktop from './TrackBusDesktop';

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

const TrackBus = () => {
    const { busId } = useParams();
    const isMobile = useIsMobile(768);
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

    const sharedProps = {
        bus,
        location,
        eta,
        stops,
        isComplaintOpen,
        setIsComplaintOpen,
        isRatingOpen,
        setIsRatingOpen,
    };

    // Render completely separate components for mobile and desktop
    return isMobile ? <TrackBusMobile {...sharedProps} /> : <TrackBusDesktop {...sharedProps} />;
};

export default TrackBus;
