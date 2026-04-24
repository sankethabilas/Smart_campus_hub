import { Eye, EyeOff, Lock, Mail, Phone, User, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterProps {
    onBack?: () => void;
}

interface RegisterFormData {
    name: string;
    role: 'ADMIN' | 'TECHNICIAN';
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export default function AdminRegister({ onBack }: RegisterProps) {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        role: 'TECHNICIAN', // Default role
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setvalidationErrors] = useState<Partial<RegisterFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        if (error) setError('');
        if (validationErrors[name as keyof RegisterFormData]) {
            setvalidationErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<RegisterFormData> = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        const phoneRegex = /^\d{10}$/;
        if (!formData.phone.trim()) {
            errors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm Password is required';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setvalidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    role: formData.role,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            if (!response.ok) throw new Error('Registration failed');

            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/login';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Join the Smart Campus Hub
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validationErrors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
                        </div>

                        {/* Role Selection (Radio Buttons) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${formData.role === 'ADMIN' ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="ADMIN"
                                        checked={formData.role === 'ADMIN'}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <span className={`text-sm font-medium ${formData.role === 'ADMIN' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>Admin</span>
                                </label>
                                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${formData.role === 'TECHNICIAN' ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="TECHNICIAN"
                                        checked={formData.role === 'TECHNICIAN'}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <span className={`text-sm font-medium ${formData.role === 'TECHNICIAN' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>Technician</span>
                                </label>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validationErrors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validationErrors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            {validationErrors.phone && <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validationErrors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                                    placeholder="Create a password"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${validationErrors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                                    placeholder="Confirm your password"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>

                    <div className="text-center">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
                                Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}