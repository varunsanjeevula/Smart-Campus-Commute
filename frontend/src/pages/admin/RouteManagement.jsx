import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Map, Plus, Trash2 } from 'lucide-react';

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [newRoute, setNewRoute] = useState({ name: '', startPoint: '', endPoint: '', totalDistance: '', estimatedDuration: '' });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const { data } = await api.get('/route');
            setRoutes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/route', newRoute);
            setNewRoute({ name: '', startPoint: '', endPoint: '', totalDistance: '', estimatedDuration: '' });
            fetchRoutes();
        } catch (error) {
            alert('Failed to create route');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete route?')) {
            try {
                await api.delete(`/route/${id}`);
                fetchRoutes();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-dark flex items-center gap-2">
                <Map className="text-green-600" /> Route Management
            </h3>

            <form onSubmit={handleCreate} className="mb-8 bg-green-50 p-6 rounded-2xl border border-green-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="md:col-span-2 font-bold text-dark mb-2">Create New Route</h4>
                <input className="p-3 rounded-xl border border-gray-200" placeholder="Route Name (e.g. Route 101)" value={newRoute.name} onChange={e => setNewRoute({ ...newRoute, name: e.target.value })} required />
                <input className="p-3 rounded-xl border border-gray-200" placeholder="Start Point" value={newRoute.startPoint} onChange={e => setNewRoute({ ...newRoute, startPoint: e.target.value })} required />
                <input className="p-3 rounded-xl border border-gray-200" placeholder="End Point" value={newRoute.endPoint} onChange={e => setNewRoute({ ...newRoute, endPoint: e.target.value })} required />
                <div className="grid grid-cols-2 gap-4">
                    <input className="p-3 rounded-xl border border-gray-200" placeholder="Distance (km)" type="number" value={newRoute.totalDistance} onChange={e => setNewRoute({ ...newRoute, totalDistance: e.target.value })} required />
                    <input className="p-3 rounded-xl border border-gray-200" placeholder="Duration (min)" type="number" value={newRoute.estimatedDuration} onChange={e => setNewRoute({ ...newRoute, estimatedDuration: e.target.value })} required />
                </div>
                <button className="md:col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex justify-center items-center gap-2">
                    <Plus size={18} /> Create Route
                </button>
            </form>

            <div className="space-y-4">
                {routes.map(route => (
                    <div key={route._id} className="bg-white border border-gray-100 p-4 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div>
                            <h4 className="font-bold text-dark">{route.name}</h4>
                            <p className="text-sm text-gray-500">{route.startPoint} ➝ {route.endPoint}</p>
                            <p className="text-xs text-gray-400 mt-1">{route.totalDistance} km • {route.estimatedDuration} mins</p>
                        </div>
                        <button onClick={() => handleDelete(route._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RouteManagement;
