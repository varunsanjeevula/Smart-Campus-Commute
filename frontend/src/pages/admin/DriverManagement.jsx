import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { UserPlus, Star, Shield } from 'lucide-react';

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([]);
    const [newDriver, setNewDriver] = useState({ name: '', phone: '', licenseNumber: '' });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const { data } = await api.get('/driver');
            setDrivers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/driver', newDriver);
            setNewDriver({ name: '', phone: '', licenseNumber: '' });
            fetchDrivers();
        } catch (error) {
            alert('Failed to add driver');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-dark flex items-center gap-2">
                    <Shield className="text-purple-600" /> Driver Management
                </h3>
            </div>

            <form onSubmit={handleCreate} className="mb-8 bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                    <UserPlus size={18} /> Add New Driver
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Full Name"
                        value={newDriver.name}
                        onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                        required
                    />
                    <input
                        className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Phone Number"
                        value={newDriver.phone}
                        onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                        required
                    />
                    <input
                        className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="License Number"
                        value={newDriver.licenseNumber}
                        onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                        required
                    />
                    <button className="md:col-span-3 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
                        Create Driver Profile
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map(driver => (
                    <div key={driver._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-dark">{driver.name}</h4>
                                <p className="text-sm text-gray-500">{driver.licenseNumber}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 text-xs font-bold">
                                <Star size={12} className="fill-current" /> {driver.rating?.toFixed(1) || '0.0'}
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex justify-between">
                                <span>Phone:</span> <span className="font-medium text-dark">{driver.phone}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Total Trips:</span> <span className="font-medium text-dark">{driver.totalRatings || 0} (Rated)</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {driver.status || 'Active'}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverManagement;
