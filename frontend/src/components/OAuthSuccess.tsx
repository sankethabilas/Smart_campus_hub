import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function OAuthSuccess() {
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");

		if (token) {
			localStorage.setItem("token", token);
			const decoded: any = jwtDecode(token);

			switch (decoded.role) {
				case 'ADMIN':
					window.location.href = '/admin-dashboard';
					break;
				case 'TECHNICIAN':
					window.location.href = '/technician-dashboard';
					break;
				case 'USER':
				default:
					window.location.href = '/dashboard';
			}
		}
	}, [])

	return <div>Logging you in...</div>
}