const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const api = {
    getProjects: async () => {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    getProject: async (id) => {
        const response = await fetch(`${API_URL}/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return response.json();
    }
};
