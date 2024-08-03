import axios from 'axios';

const API_URL2 = 'https://66ac3627f009b9d5c73155d3.mockapi.io/todo2';

export const fetchTodos = async () => {
  return axios.get(API_URL2);
};

export const addTodo = async (todo2) => {
  return axios.post(API_URL2, todo2);
};

export const deleteTodo = async (id) => {
  return axios.delete(`${API_URL2}/${id}`);
};

export const updateTodo = async (id, todo2) => {
    try {
        const response = await axios.put(`${API_URL2}/${id}`, todo2, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Failed to update todo:', error.response ? error.response.data : error.message);
        throw error;
    }
};
