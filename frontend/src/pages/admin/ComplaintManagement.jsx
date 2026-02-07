import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaint');
            setComplaints(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/complaint/${id}/resolve`);
            fetchComplaints();
        } catch (error) {
            alert('Failed to resolve');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-dark flex items-center gap-2">
                <AlertCircle className="text-red-500" /> Complaints
            </h3>
            {complaints.length === 0 ? <p className="text-gray-500">No complaints.</p> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="py-3 font-medium">Bus</th>
                                <th className="py-3 font-medium">Type</th>
                                <th className="py-3 font-medium">Description</th>
                                <th className="py-3 font-medium">Status</th>
                                <th className="py-3 font-medium">Evidence</th>
                                <th className="py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {complaints.map(c => (
                                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-dark">{c.busId?.busNumber || 'Unknown'}</td>
                                    <td className="py-4 text-gray-600">{c.type}</td>
                                    <td className="py-4 text-gray-600 max-w-xs truncate" title={c.description}>{c.description}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${c.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        {c.media && c.media.length > 0 ? (
                                            <a href={`http://localhost:5000${c.media[0]}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">View ({c.media.length})</a>
                                        ) : <span className="text-gray-400 text-sm">None</span>}
                                    </td>
                                    <td className="py-4">
                                        {c.status === 'open' ? (
                                            <button onClick={() => handleResolve(c._id)} className="text-primary hover:text-blue-700 font-medium text-sm">
                                                Mark Resolved
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 flex items-center gap-1 text-sm"><CheckCircle size={14} /> Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ComplaintManagement;
