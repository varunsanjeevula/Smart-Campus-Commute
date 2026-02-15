import { useState, useContext } from 'react';
import api from '../utils/api';
import { AlertTriangle, CheckCircle, Send, Lock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = ({ busId }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [type, setType] = useState('Driving');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
    const [complaintId, setComplaintId] = useState(null);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setStatus('loading');

        const formData = new FormData();
        formData.append('busId', busId);
        formData.append('type', type);
        formData.append('description', description);

        files.forEach((file) => {
            formData.append('media', file);
        });

        try {
            const { data } = await api.post('/complaint', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('success');
            setComplaintId(data._id);
            setDescription('');
            setFiles([]);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') return (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl flex flex-col items-center gap-3 animate-fade-in text-center">
            <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-lg">Report Submitted!</h3>
            <p>Your Complaint Reference ID:</p>
            <div className="bg-white px-4 py-2 rounded-lg border border-green-200 font-mono font-bold select-all">
                {complaintId}
            </div>
            <p className="text-xs text-green-600">Save this ID to track your status.</p>
            <button
                onClick={() => setStatus(null)}
                className="text-sm font-bold underline mt-2"
            >
                Submit New Report
            </button>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-50 p-2 rounded-lg text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="font-bold text-xl text-dark">Report an Issue</h3>
            </div>

            {!user ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                        <Lock size={20} />
                    </div>
                    <h4 className="font-bold text-dark mb-1">Authentication Required</h4>
                    <p className="text-sm text-gray-500 mb-4 px-4">You need to be logged in to file a complaint or report an issue.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-500/20"
                    >
                        Login / Sign Up
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                        <select
                            className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Driving">Rash Driving</option>
                            <option value="Cleanliness">Cleanliness</option>
                            <option value="Behavior">Driver Behavior</option>
                            <option value="Delay">Delay</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Please describe the issue in detail..."
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attach Evidence</label>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-2 text-gray-400 pointer-events-none">
                                <span className="text-2xl">📷</span>
                                <span className="text-xs font-medium">
                                    {files.length > 0 ? `${files.length} file(s) selected` : "Tap to upload photo/video"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={status === 'loading'}
                        className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-70"
                    >
                        {status === 'loading' ? 'Submitting...' : (
                            <>
                                <Send size={18} /> Submit Report
                            </>
                        )}
                    </button>
                    {status === 'error' && <p className="text-red-500 text-sm text-center mt-2">Failed to submit complaint.</p>}
                </form>
            )}

        </div>
    );
};

export default ComplaintForm;
