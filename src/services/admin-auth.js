import axios from 'axios'; // Add this import
import Cookies from 'js-cookie';

export const setToken = (token) => {
	Cookies.set('token', token, { expires: 3 });
};

export const getToken = () => {
	return Cookies.get('token');
};

export const isAuthenticated = async (redirectURL, router, reverse = false) => {
    // Check frontend sessionStorage
    const user = sessionStorage.getItem('user');

    if (!user && !reverse) {
        router.push(redirectURL);
        return false;
    }

    if (user && reverse) {
        router.push(redirectURL);
        return false;
    }

    // Optional: Verify backend session
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}checkSession.json`, {
            withCredentials: true,
        });

        if (res.status === 200 && res.data?.status === 'success') {
            // backend session valid
            return true;
        } else if (!reverse) {
            router.push(redirectURL);
            return false;
        }
	} catch (err) {
	console.error("Session check failed:", err); // Log error details
	if (!reverse) router.push(redirectURL);
	return false;
	}
};
