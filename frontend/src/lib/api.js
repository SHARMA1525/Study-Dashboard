const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
console.log(`[API_URL_DEBUG] Current API URL: ${API_URL}`);

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    async get(endpoint) {
        console.log(`[API] GET ${endpoint}`);
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders(),
        });
        console.log(`[API] GET ${endpoint} Status: ${res.status}`);
        if (!res.ok) {
            let errorMsg = `Server error: ${res.status}`;
            const rawBody = await res.text().catch(() => '');
            console.error(`[API] Error Status: ${res.status}, Body: ${rawBody.substring(0, 200)}`);
            try {
                const errorData = JSON.parse(rawBody);
                errorMsg = errorData.message || errorData.Message || errorMsg;
            } catch (err) {
                console.warn(`[API] Response was not valid JSON for GET ${endpoint}`);
            }
            throw new Error(errorMsg);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
            return data.map(item => ({ ...item, id: item._id || item.id }));
        }
        return { ...data, id: data._id || data.id };
    },

    async post(endpoint, data) {
        console.log(`[API] POST ${endpoint}`, data);
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            console.log(`[API] POST ${endpoint} Status: ${res.status}`);
            if (!res.ok) {
                let errorMsg = `Server error: ${res.status}`;
                const rawBody = await res.text().catch(() => '');
                console.error(`[API] Error Status: ${res.status}, Body: ${rawBody.substring(0, 200)}`);
                try {
                    const errorData = JSON.parse(rawBody);
                    errorMsg = errorData.message || errorData.Message || errorMsg;
                } catch (err) {
                    console.warn(`[API] Response was not valid JSON for POST ${endpoint}`);
                }
                throw new Error(errorMsg);
            }
            const result = await res.json();
            return { ...result, id: result._id || result.id };
        } catch (error) {
            console.error(`[API_FETCH_ERROR] POST ${endpoint} failed:`, error);
            throw error;
        }
    },

    async put(endpoint, data) {
        console.log(`[API] PUT ${endpoint}`, data);
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        console.log(`[API] PUT ${endpoint} Status: ${res.status}`);
        if (!res.ok) {
            let errorMsg = `Server error: ${res.status}`;
            const rawBody = await res.text().catch(() => '');
            console.error(`[API] Error Status: ${res.status}, Body: ${rawBody.substring(0, 200)}`);
            try {
                const errorData = JSON.parse(rawBody);
                errorMsg = errorData.message || errorData.Message || errorMsg;
            } catch (err) {
                console.warn(`[API] Response was not valid JSON for PUT ${endpoint}`);
            }
            throw new Error(errorMsg);
        }
        const result = await res.json();
        return { ...result, id: result._id || result.id };
    },

    async delete(endpoint) {
        console.log(`[API] DELETE ${endpoint}`);
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        console.log(`[API] DELETE ${endpoint} Status: ${res.status}`);
        if (!res.ok) {
            let errorMsg = `Server error: ${res.status}`;
            const rawBody = await res.text().catch(() => '');
            console.error(`[API] Error Status: ${res.status}, Body: ${rawBody.substring(0, 200)}`);
            try {
                const errorData = JSON.parse(rawBody);
                errorMsg = errorData.message || errorData.Message || errorMsg;
            } catch (err) {
                console.warn(`[API] Response was not valid JSON for DELETE ${endpoint}`);
            }
            throw new Error(errorMsg);
        }
        return res.json();
    },

    async login(email, password) {
        const data = await this.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    async signup(name, email, password) {
        return this.post('/auth/signup', { name, email, password });
    },

    logout() {
        localStorage.removeItem('token');
    },
};
