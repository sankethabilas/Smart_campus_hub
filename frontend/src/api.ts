export const apiFetch = async(url: string, options: any = {}) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const token = localStorage.getItem('token');
    const resposnse = await fetch(`${BACKEND_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
    return resposnse;
}