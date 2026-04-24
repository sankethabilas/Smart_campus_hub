import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterProps {
	onBack?: () => void;
}

interface RegisterFormData {
	name: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

export default function Register({ onBack }: RegisterProps) {
	const [formData, setFormData] = useState<RegisterFormData>({
		name: '',
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
		// Clear error when user starts typing
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

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('http://localhost:8080/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					password: formData.password,
				}),
			});

			if (!response.ok) {
				throw new Error('Registration failed');
			}

			const data = await response.json();
			console.log('Registration successful:', data);
			localStorage.setItem('token', data.token);
			// Redirect to login page
			window.location.href = '/login';
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Registration failed');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = () => {
		window.location.href = 'http://localhost:8080/oauth2/authorization/google';
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
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
									autoComplete="name"
									required
									value={formData.name}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
										}`}
									placeholder="Enter your full name"
								/>
							</div>
							{validationErrors.name && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
							)}
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-slate-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleInputChange}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
										}`}
									placeholder="Enter your email"
								/>
							</div>
							{validationErrors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
							)}
						</div>
					</div>

					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Phone Number
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Phone className="h-5 w-5 text-slate-400" />
							</div>
							<input
								id="phone"
								name="phone"
								type="tel"
								autoComplete="tel"
								required
								value={formData.phone}
								onChange={handleInputChange}
								className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
									}`}
								placeholder="Enter your phone number"
							/>
						</div>
						{validationErrors.phone && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
						)}
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-slate-400" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleInputChange}
								className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
									}`}
								placeholder="Create a password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
								) : (
									<Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
								)}
							</button>
						</div>
						{validationErrors.password && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
						)}
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Confirm Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-slate-400" />
							</div>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type={showConfirmPassword ? 'text' : 'password'}
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleInputChange}
								className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
									}`}
								placeholder="Confirm your password"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
								) : (
									<Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
								)}
							</button>
						</div>
						{validationErrors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
						)}
					</div>

					{error && (
						<div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isLoading ? 'Creating account...' : 'Create account'}
					</button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span>
						</div>
					</div>

					<div className="space-y-4">
						<button
							onClick={handleGoogleSignIn}
							className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
						>
							<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Sign up with Google
						</button>
					</div>

					<div className="text-center">
						<div className="text-sm text-slate-600 dark:text-slate-400">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
							>
								Login
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
