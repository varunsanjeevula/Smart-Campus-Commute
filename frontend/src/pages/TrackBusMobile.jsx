import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ComplaintForm from '../../components/ComplaintForm';
import RatingModal from '../../components/RatingModal';
import { Navigation, Gauge, Clock, AlertTriangle, X, Star, MapPin, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const TrackBusMobile = ({ bus, location, eta, stops, isComplaintOpen, setIsComplaintOpen, isRatingOpen, setIsRatingOpen }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100dvh - 56px)', overflow: 'hidden', background: '#f3f4f6' }}>
      {/* Map — fills the area below header */}
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

      {/* Bottom Sheet Info Card */}
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 400,
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
          maxHeight: '45vh', overflowY: 'auto',
        }}
      >
        {/* Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '6px' }}>
          <div style={{ width: '36px', height: '4px', background: '#d1d5db', borderRadius: '9999px' }} />
        </div>

        <div style={{ padding: '8px 16px 20px' }}>
          {/* Header Row — Bus number + LIVE badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{bus?.busNumber}</h2>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                <Navigation size={13} /> {bus?.route}
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
              padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '1px',
              boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              LIVE
            </div>
          </div>

          {/* Stats Row — 3 equal columns */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              flex: 1, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', padding: '12px 8px',
              borderRadius: '16px', textAlign: 'center', border: '1px solid #bfdbfe'
            }}>
              <Gauge size={20} style={{ color: '#2563eb', margin: '0 auto 4px', display: 'block' }} />
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', lineHeight: 1.1 }}>{location.speed || 0}</div>
              <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>KM/H</div>
            </div>
            <div style={{
              flex: 1, background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', padding: '12px 8px',
              borderRadius: '16px', textAlign: 'center', border: '1px solid #c4b5fd'
            }}>
              <Clock size={20} style={{ color: '#7c3aed', margin: '0 auto 4px', display: 'block' }} />
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', lineHeight: 1.1 }}>{eta || '--'}</div>
              <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>ETA</div>
            </div>
            <div style={{
              flex: 1, background: 'linear-gradient(135deg, #fff7ed, #fed7aa)', padding: '12px 8px',
              borderRadius: '16px', textAlign: 'center', border: '1px solid #fdba74'
            }}>
              <MapPin size={20} style={{ color: '#ea580c', margin: '0 auto 4px', display: 'block' }} />
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ea580c', lineHeight: 1.1 }}>
                ~{location.speed ? (15 - (location.speed * 0.1)).toFixed(1) : '12.5'}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>KM</div>
            </div>
          </div>

          {/* Driver Info + Rate + Report — single row */}
          <div style={{
            background: '#f8fafc', padding: '10px 12px', borderRadius: '14px',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '14px'
          }}>
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
              alt="Driver"
              style={{
                width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover',
                border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>DRIVER</p>
              <p style={{
                fontWeight: 700, fontSize: '14px', color: '#1e293b', margin: '1px 0 0',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
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
              style={{
                fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff',
                border: '1px solid #bfdbfe', cursor: 'pointer', flexShrink: 0,
                padding: '6px 10px', borderRadius: '8px'
              }}
            >
              Rate
            </button>
          </div>

          {/* Route Stops */}
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: '#94a3b8' }} /> Route & ETAs
            </h4>
            <div style={{ paddingLeft: '14px', borderLeft: '2px solid #e2e8f0' }}>
              {stops.map((stop, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '18px', marginBottom: i < stops.length - 1 ? '10px' : 0 }}>
                  <div style={{
                    position: 'absolute', left: '-10px', top: '2px', width: '16px', height: '16px', borderRadius: '50%',
                    border: i === 0 ? '3px solid #2563eb' : '3px solid #cbd5e1',
                    background: i === 0 ? '#2563eb' : '#fff',
                    boxShadow: i === 0 ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#0f172a' : '#64748b', margin: 0 }}>{stop}</p>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', flexShrink: 0,
                      background: i === 0 ? '#dcfce7' : '#f1f5f9',
                      color: i === 0 ? '#15803d' : '#64748b',
                    }}>
                      {i === 0 ? 'Arrived' : `+${i * 15} min`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Issue Button — inside bottom sheet */}
          <button
            onClick={() => setIsComplaintOpen(true)}
            style={{
              width: '100%', background: '#fef2f2', color: '#dc2626',
              padding: '12px', borderRadius: '14px', fontWeight: 700, fontSize: '13px',
              border: '1px solid #fecaca', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <Flag size={16} /> Report an Issue
          </button>
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
