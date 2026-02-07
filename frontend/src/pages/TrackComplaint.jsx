import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Search, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TrackComplaint = () => {
    const { id } = useParams();
    const [searchId, setSearchId] = useState(id || '');
    const [complaint, setComplaint] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const fetchComplaint = async (complaintId) => {
        if (!complaintId) return;
        setStatus('loading');
        try {
            const { data } = await api.get(`/complaint/${complaintId}`);
            setComplaint(data);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setComplaint(null);
            setStatus('error');
        }
    };

    useEffect(() => {
        if (id) fetchComplaint(id);
    }, [id]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchComplaint(searchId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark mb-6">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
                    <h1 className="text-3xl font-bold text-dark mb-2">Track Complaint</h1>
                    <p className="text-gray-500 mb-6">Enter your Reference ID to check status.</p>

                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="e.g. 67a65..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-dark text-white px-6 rounded-lg font-bold hover:bg-black transition-colors"
                        >
                            Track
                        </button>
                    </form>
                </div>

                {status === 'loading' && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Retrieving records...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
                        <AlertTriangle size={32} className="mx-auto mb-2" />
                        <h3 className="font-bold text-lg">Complaint Not Found</h3>
                        <p className="text-sm">Please check the ID and try again.</p>
                    </div>
                )}

                {status === 'success' && complaint && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reference ID</span>
                                <h2 className="font-mono font-bold text-xl text-dark select-all">{complaint._id}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {complaint.status}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark">Description</h4>
                                    <p className="text-gray-600 leading-relaxed mt-1">
                                        {complaint.description}
                                    </p>
                                    <div className="mt-2 text-xs font-bold text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded">
                                        Type: {complaint.type}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start border-t border-gray-100 pt-6">
                                <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark">Timeline</h4>
                                    <div className="mt-2 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <p className="text-sm text-gray-600">
                                                Submitted on <span className="font-bold">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                        {complaint.status === 'resolved' && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <p className="text-sm text-gray-600">
                                                    Resolved on <span className="font-bold">{new Date(complaint.updatedAt).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {complaint.media && complaint.media.length > 0 && (
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-dark mb-4">Attached Evidence</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {complaint.media.map((file, i) => (
                                            <a key={i} href={`http://localhost:5000${file}`} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-xl border border-gray-200">
                                                {file.match(/\.(mp4|mov|avi)$/i) ? (
                                                    <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400">VIDEO</div>
                                                ) : (
                                                    <img src={`http://localhost:5000${file}`} alt="Evidence" className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackComplaint;
