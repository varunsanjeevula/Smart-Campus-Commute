import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Phone, Clock, AlertCircle, CheckCircle, Headphones, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
    const { user, login } = useContext(AuthContext); // Re-login to update user state if needed
    const [activeTab, setActiveTab] = useState('details');
    const [complaints, setComplaints] = useState([]);
    const [loadingComplaints, setLoadingComplaints] = useState(false);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editPassword, setEditPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        if (activeTab === 'complaints') {
            fetchComplaints();
        }
    }, [activeTab]);

    const fetchComplaints = async () => {
        setLoadingComplaints(true);
        try {
            const { data } = await api.get('/complaints/my-complaints');
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoadingComplaints(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/auth/profile', {
                name: editName,
                password: editPassword || undefined
            });
            // Update local user context (hacky way: re-login or just update state if exposed)
            // ideally AuthContext exposes update function. For now, we assume user is updated on next refresh or just show success.
            setUpdateMessage('Profile updated successfully!');
            setIsEditing(false);
            setEditPassword('');
        } catch (error) {
            setUpdateMessage('Failed to update profile.');
        }
    };

    if (!user) return <div className="p-10 text-center">Please log in to view your profile.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-dark">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                        <div className="p-6 bg-primary text-white text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="font-bold text-lg">{user.name}</h2>
                            <p className="text-blue-100 text-sm">{user.email}</p>
                        </div>
                        <nav className="p-2">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'details' ? 'bg-blue-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} /> My Details
                            </button>
                            <button
                                onClick={() => setActiveTab('complaints')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'complaints' ? 'bg-blue-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <AlertCircle size={18} /> My Complaints
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'support' ? 'bg-blue-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Headphones size={18} /> Customer Care
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-full md:w-3/4">
                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-dark">Profile Details</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                )}
                            </div>

                            {updateMessage && (
                                <div className={`p-4 rounded-lg mb-6 ${updateMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {updateMessage}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                            value={user.email}
                                            disabled
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password (Optional)</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="Leave blank to keep current"
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex border-b border-gray-100 pb-4">
                                        <div className="w-1/3 text-gray-500">Full Name</div>
                                        <div className="w-2/3 font-medium text-dark">{user.name}</div>
                                    </div>
                                    <div className="flex border-b border-gray-100 pb-4">
                                        <div className="w-1/3 text-gray-500">Email Address</div>
                                        <div className="w-2/3 font-medium text-dark">{user.email}</div>
                                    </div>
                                    <div className="flex border-b border-gray-100 pb-4">
                                        <div className="w-1/3 text-gray-500">Role</div>
                                        <div className="w-2/3 font-medium text-dark capitalize">{user.role}</div>
                                    </div>
                                    <div className="flex pb-4">
                                        <div className="w-1/3 text-gray-500">Status</div>
                                        <div className="w-2/3 font-medium text-green-600 flex items-center gap-2">
                                            <CheckCircle size={16} /> Verified
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COMPLAINTS TAB */}
                    {activeTab === 'complaints' && (
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6">Complaint History</h2>

                            {loadingComplaints ? (
                                <div className="text-center py-12 text-gray-500">Loading complaints...</div>
                            ) : complaints.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Complaints Found</h3>
                                    <p className="text-gray-500">You haven't submitted any complaints yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {complaints.map((complaint) => (
                                        <div key={complaint._id} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 transition-colors bg-white hover:shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {complaint.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock size={14} /> {new Date(complaint.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-gray-400">#{complaint._id.slice(-6)}</span>
                                            </div>

                                            <h3 className="font-bold text-lg text-dark mb-2">{complaint.type}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">Bus: {complaint.busId?.busNumber || 'Unknown'}</span>
                                                </div>
                                                <a href={`/complaint-status/${complaint._id}`} className="text-primary hover:underline font-medium text-sm">
                                                    View Details
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUPPORT TAB */}
                    {activeTab === 'support' && (
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-dark mb-6">Customer Care</h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <div className="w-12 h-12 bg-blue-100 text-primary rounded-lg flex items-center justify-center mb-4">
                                        <Phone size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Phone Support</h3>
                                    <p className="text-gray-600 mb-4 text-sm">Available Mon-Sat, 9am - 6pm</p>
                                    <a href="tel:+18001234567" className="text-xl font-bold text-primary hover:underline">+1 (800) 123-4567</a>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                                        <Mail size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Email Support</h3>
                                    <p className="text-gray-600 mb-4 text-sm">We usually reply within 24 hours</p>
                                    <a href="mailto:support@bustracker.com" className="text-xl font-bold text-purple-600 hover:underline">support@bustracker.com</a>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span>How do I track a bus?</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                                            Use the search bar on the home page to find a bus by its number. Alternatively, click on "Live Map" to view all active buses in real-time.
                                        </p>
                                    </details>
                                    <div className="h-px bg-gray-200"></div>
                                    <details className="group">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span>How do I file a complaint?</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                                            Search for the bus you want to report, click "Report Issue", and fill out the form. You must be logged in to file a complaint.
                                        </p>
                                    </details>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
