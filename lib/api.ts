// lib/api.ts
export const API = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${process.env.APP_BASE_URL}/api/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    },

    async post<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${process.env.APP_BASE_URL}/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }
}