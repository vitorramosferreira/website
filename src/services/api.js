const API_URL = 'http://localhost:3000';

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
