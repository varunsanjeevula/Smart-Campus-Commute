import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ComplaintForm from '../../components/ComplaintForm';
import RatingModal from '../../components/RatingModal';
import { ArrowLeft, Navigation, Gauge, Clock, AlertTriangle, X, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const TrackBusMobile = ({ bus, location, eta, stops, isComplaintOpen, setIsComplaintOpen, isRatingOpen, setIsRatingOpen, handleTrack }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden', background: '#f3f4f6' }}>
      {/* Map — fills entire screen */}
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>{bus?.busNumber}</h3>
              <p>Speed: {location.speed} km/h</p>
            </div>
          </Popup>
        </Marker>
        <RecenterMap lat={location.lat} lng={location.lng} />
      </MapContainer>

      {/* Back Button */}
      <Link
        to="/"
        style={{
          position: 'absolute', top: '16px', left: '12px', zIndex: 400,
          background: '#fff', padding: '10px', borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          width: '44px', height: '44px', color: '#374151', textDecoration: 'none'
        }}
      >
        <ArrowLeft size={22} />
      </Link>

      {/* Complaint FAB */}
      <button
        onClick={() => setIsComplaintOpen(true)}
        style={{
          position: 'absolute', top: '16px', right: '12px', zIndex: 400,
          background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '48px', height: '48px', cursor: 'pointer'
        }}
      >
        <AlertTriangle size={20} />
      </button>

      {/* Bottom Sheet Info Card */}
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 400,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.12)',
          maxHeight: '42vh', overflowY: 'auto',
        }}
      >
        {/* Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
          <div style={{ width: '40px', height: '4px', background: '#d1d5db', borderRadius: '9999px' }} />
        </div>

        <div style={{ padding: '14px 16px 20px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{bus?.busNumber}</h2>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={12} /> {bus?.route}
              </p>
            </div>
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
              ● LIVE
            </div>
          </div>

          {/* Stats Row — 3 equal columns */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ flex: 1, background: '#eff6ff', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #dbeafe' }}>
              <Gauge size={18} style={{ color: '#3b82f6', margin: '0 auto 2px', display: 'block' }} />
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{location.speed || 0}</div>
              <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>KM/H</div>
            </div>
            <div style={{ flex: 1, background: '#faf5ff', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
              <Clock size={18} style={{ color: '#8b5cf6', margin: '0 auto 2px', display: 'block' }} />
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{eta || '--'}</div>
              <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ETA</div>
            </div>
            <div style={{ flex: 1, background: '#fff7ed', padding: '10px 8px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fed7aa' }}>
              <MapPin size={18} style={{ color: '#ea580c', margin: '0 auto 2px', display: 'block' }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#ea580c', lineHeight: 1.2 }}>~{location.speed ? (15 - (location.speed * 0.1)).toFixed(1) : '12.5'}</div>
              <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>KM</div>
            </div>
          </div>

          {/* Driver Info — single row */}
          <div style={{ background: '#f9fafb', padding: '10px 12px', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
              alt="Driver"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>DRIVER</p>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b', margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {bus?.driverId?.name || 'Mock Driver'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#fef9c3', padding: '4px 8px', borderRadius: '8px', flexShrink: 0 }}>
              <Star size={12} style={{ color: '#ca8a04' }} fill="#ca8a04" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#a16207' }}>
                {bus?.driverId?.rating ? bus.driverId.rating.toFixed(1) : '5.0'}
              </span>
            </div>
            <button
              onClick={() => setIsRatingOpen(true)}
              style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '6px 2px' }}
            >
              Rate
            </button>
          </div>

          {/* Route Stops */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: '#9ca3af' }} /> Route & ETAs
            </h4>
            <div style={{ paddingLeft: '14px', borderLeft: '2px solid #e5e7eb' }}>
              {stops.map((stop, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '18px', marginBottom: i < stops.length - 1 ? '10px' : 0 }}>
                  <div style={{
                    position: 'absolute', left: '-10px', top: '2px', width: '16px', height: '16px', borderRadius: '50%',
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
        </div>
      </motion.div>

      {/* Complaint Modal */}
      <AnimatePresence>
        {isComplaintOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsComplaintOpen(false)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'relative', width: '100%', background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 501, maxHeight: '90vh' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
                <div style={{ width: '40px', height: '4px', background: '#d1d5db', borderRadius: '9999px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                <h3 style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>Report Incident</h3>
                <button
                  onClick={() => setIsComplaintOpen(false)}
                  style={{ background: '#e5e7eb', border: 'none', padding: '6px', borderRadius: '50%', color: '#6b7280', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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

export default TrackBusMobile;
