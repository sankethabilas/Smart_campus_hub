import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            try {
                const decoded: any = jwtDecode(token);
                
                // Use navigate() for internal SPA routing
                switch (decoded.role) {
                    case 'ADMIN':
                        navigate('/admin');
                        break;
                    case 'TECHNICIAN':
                        navigate('/technician');
                        break;
                    default:
                        navigate('/dashboard');
                }
            } catch (err) {
                console.error("Invalid token received", err);
                navigate('/login');
            }
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600">Finalizing login...</span>
        </div>
    );
}