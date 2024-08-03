import axios from 'axios';

const API_URL = 'https://66ac3627f009b9d5c73155d3.mockapi.io/todo1';

export const fetchTodos = async () => {
  return axios.get(API_URL);
};

export const addTodo = async (todo) => {
  return axios.post(API_URL, todo);
};

export const deleteTodo = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};


export const updateTodo = async (id, todo) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, todo, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Return the updated todo if needed
    } catch (error) {
        console.error('Failed to update todo:', error.response ? error.response.data : error.message);
        throw error;
    }
};

