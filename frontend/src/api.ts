export const apiFetch = async(url: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    const resposnse = await fetch(`http://localhost:8080${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
    return resposnse;
}