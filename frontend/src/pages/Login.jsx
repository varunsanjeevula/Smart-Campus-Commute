import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bus, ArrowRight } from 'lucide-react';

const Login = () => {
    const [authMethod, setAuthMethod] = useState('login'); // 'login' or 'signup'

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup State
    const [name, setName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [signupStep, setSignupStep] = useState(1); // 1: Details, 2: OTP

    const { login, signup, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const result = await login(loginEmail, loginPassword);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    const handleSignupRequest = async (e) => {
        e.preventDefault();
        if (signupPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        setError('');
        const result = await signup(name, signupEmail, signupPassword);
        if (result.success) {
            setSignupStep(2);
            setIsLoading(false);
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    const handleVerifySignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const result = await verifyOtp(signupEmail, otp);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center text-white p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-white blur-3xl animate-blob"></div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl w-fit mb-8">
                        <Bus size={48} />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 heading-font">
                        {authMethod === 'login' ? 'Welcome Back!' : 'Join Us Today'}
                    </h1>
                    <p className="text-xl text-blue-100 leading-relaxed">
                        {authMethod === 'login'
                            ? 'Sign in to access real-time tracking, manage drivers, and monitor fleet status efficiently.'
                            : 'Create an account to start tracking your fleet and managing operations with ease.'}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-dark mb-2">
                            {authMethod === 'login' ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500">
                            {authMethod === 'login' ? 'Access your account securely.' : 'Fill in your details to get started.'}
                        </p>
                    </div>

                    {/* Auth Method Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'}`}
                            onClick={() => { setAuthMethod('login'); setError(''); }}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'}`}
                            onClick={() => { setAuthMethod('signup'); setSignupStep(1); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> {error}
                        </div>
                    )}

                    {authMethod === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                    placeholder="name@company.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? 'Signing In...' : (
                                    <>
                                        Sign In <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="animate-fade-in">
                            {signupStep === 1 ? (
                                <form onSubmit={handleSignupRequest} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                            placeholder="name@company.com"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                                placeholder="••••••••"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                            <input
                                                type="password"
                                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Sending OTP...' : (
                                            <>
                                                Sign Up <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifySignup} className="space-y-6 animate-fade-in">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                                            <Bus size={24} />
                                        </div>
                                        <h3 className="font-bold text-dark">Verify Email</h3>
                                        <p className="text-sm text-gray-500">We sent a code to <span className="font-bold">{signupEmail}</span></p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 hover:bg-white text-center text-2xl font-mono tracking-widest"
                                            placeholder="000000"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Verifying...' : (
                                            <>
                                                Verify & Create Account <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSignupStep(1)}
                                        className="w-full text-sm text-gray-500 hover:text-dark font-medium"
                                    >
                                        Edit Details
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
