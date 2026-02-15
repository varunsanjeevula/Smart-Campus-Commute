import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BarChart, Activity } from 'lucide-react';

const Analytics = () => {
    const [performance, setPerformance] = useState([]);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const { data } = await api.get('/analytics/performance');
                setPerformance(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPerformance();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-dark flex items-center gap-2">
                <BarChart className="text-blue-600" /> Fleet Performance
            </h3>

            <div className="grid gap-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="py-3">Bus Number</th>
                                <th className="py-3">Current Speed</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Performance Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {performance.map((bus, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="py-4 font-bold text-dark">{bus.busNumber}</td>
                                    <td className="py-4 text-gray-600">{bus.avgSpeed} km/h</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {bus.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${Math.min((bus.avgSpeed / 60) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
