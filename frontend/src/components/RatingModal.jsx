import { useState } from 'react';
import api from '../utils/api';
import { Star, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const RatingModal = ({ driverId, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post(`/driver/${driverId}/rate`, { rating, comment });
            setStatus('success');
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[600] backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-dark">
                    <X size={20} />
                </button>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-dark">Thank You!</h3>
                        <p className="text-gray-500">Your feedback helps us improve.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-dark mb-2 text-center">Rate Your Driver</h3>
                        <p className="text-center text-gray-500 mb-6 text-sm">How was your ride?</p>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-all transform hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                >
                                    <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                            rows="3"
                            placeholder="Optional comments..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <button
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                            className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default RatingModal;
