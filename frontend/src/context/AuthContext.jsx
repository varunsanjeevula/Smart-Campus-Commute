import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            await api.post('/auth/register', { name, email, password });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const sendOtp = async (email) => {
        try {
            await api.post('/auth/send-otp', { email });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Verification failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, sendOtp, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
