import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, Bus as BusIcon } from 'lucide-react';

const BusManagement = () => {
    const [buses, setBuses] = useState([]);
    const [editingBus, setEditingBus] = useState(null);
    const [formData, setFormData] = useState({ busNumber: '', route: '', status: 'active', driverId: '' });
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        fetchBuses();
        fetchDrivers();
    }, []);

    const fetchBuses = async () => {
        try {
            const { data } = await api.get('/bus');
            setBuses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const { data } = await api.get('/driver');
            setDrivers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBus) {
                await api.put(`/bus/${editingBus._id}`, formData);
            } else {
                await api.post('/bus', formData);
            }
            fetchBuses();
            setEditingBus(null);
            setFormData({ busNumber: '', route: '', status: 'active', driverId: '' });
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleEdit = (bus) => {
        setEditingBus(bus);
        setFormData({
            busNumber: bus.busNumber,
            route: bus.route,
            status: bus.status,
            driverId: bus.driverId?._id || ''
        });
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                await api.delete(`/bus/${id}`);
                fetchBuses();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-dark flex items-center gap-2">
                <BusIcon className="text-primary" /> Bus Management
            </h3>

            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Bus Number"
                    value={formData.busNumber}
                    onChange={e => setFormData({ ...formData, busNumber: e.target.value })}
                    required
                />
                <input
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Route"
                    value={formData.route}
                    onChange={e => setFormData({ ...formData, route: e.target.value })}
                    required
                />
                <select
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.driverId}
                    onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                >
                    <option value="">Select Driver</option>
                    {drivers.map(d => (
                        <option key={d._id} value={d._id}>{d.name} ({d.status})</option>
                    ))}
                </select>
                <select
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button className="md:col-span-4 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                    {editingBus ? <Edit2 size={18} /> : <Plus size={18} />}
                    {editingBus ? 'Update Bus' : 'Add New Bus'}
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-sm border-b border-gray-100">
                            <th className="py-4 font-medium">Bus Number</th>
                            <th className="py-4 font-medium">Route</th>
                            <th className="py-4 font-medium">Driver</th>
                            <th className="py-4 font-medium">Status</th>
                            <th className="py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {buses.map(bus => (
                            <tr key={bus._id} className="hover:bg-gray-50">
                                <td className="py-4 font-bold text-dark">{bus.busNumber}</td>
                                <td className="py-4 text-gray-600">{bus.route}</td>
                                <td className="py-4 text-gray-600">{bus.driverId?.name || 'Unassigned'}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${bus.status === 'active' ? 'bg-green-100 text-green-700' :
                                            bus.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {bus.status}
                                    </span>
                                </td>
                                <td className="py-4 flex gap-2">
                                    <button onClick={() => handleEdit(bus)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(bus._id)} className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BusManagement;
