"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './page.css'
import { updateTodo } from '../todoService2/todoService2';

const predefinedTags = [
    'Learning',
    'Household',
    'Meetings',
    'Follow-Up',
    'Health'
];

const priorityOptions = [
    'Low',
    'Medium',
    'High'
];

export default function ModalUpdateTodo2({ todo, closeModal, onUpdateTodo }) {
    const [updatedTodo, setUpdatedTodo] = useState({
        title: '',
        description: '',
        priority: '',
        due_date: '',
        tags: ''
    });

    useEffect(() => {
        if (todo) {
            setUpdatedTodo({
                title: todo.title || '',
                description: todo.description || '',
                priority: todo.priority || '',
                due_date: todo.due_date || '',
                tags: todo.tags || ''
            });
        }
    }, [todo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTodo(prevTodo => ({
            ...prevTodo,
            [name]: value
        }));
    };

    const handleTagChange = (e) => {
        setUpdatedTodo(prevTodo => ({
            ...prevTodo,
            tags: e.target.value
        }));
    };

    const handlePriorityChange = (e) => {
        setUpdatedTodo(prevTodo => ({
            ...prevTodo,
            priority: e.target.value
        }));
    };

    const handleUpdateTodo = async () => {
        if (todo && onUpdateTodo) {
            try {
                // Call the updateTodo function with the todo.id and updatedTodo
                await updateTodo(todo.id, updatedTodo);
                console.log('Update successful');
                // Reload the page after updating
                window.location.reload();
            } catch (error) {
                console.error('Failed to update todo:', error);
                // Handle error (e.g., show an error message)
            }
        }
    };

    return (
        <div className='modal-overlay' onClick={closeModal}>
            <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Update Todo</h2>
                <input
                    className='input'
                    type="text"
                    name="title"
                    value={updatedTodo.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <input
                    className='input'
                    type="text"
                    name="description"
                    value={updatedTodo.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <input
                    className='input'
                    type="date"
                    name="due_date"
                    value={updatedTodo.due_date}
                    onChange={handleChange}
                    placeholder="Due Date"
                />
                <select
                    className='input'
                    name="priority"
                    value={updatedTodo.priority}
                    onChange={handlePriorityChange}
                >
                    <option value="">Select Priority</option>
                    {priorityOptions.map(priority => (
                        <option key={priority} value={priority}>
                            {priority}
                        </option>
                    ))}
                </select>
                <select
                    className='input'
                    name="tags"
                    value={updatedTodo.tags}
                    onChange={handleTagChange}
                >
                    <option value="">Select a tag</option>
                    {predefinedTags.map(tag => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <button 
                    className='button3' 
                    onClick={handleUpdateTodo} 
                    style={{ 
                        padding: '10px', 
                        marginRight: '10px', 
                        backgroundColor: 'blue' // Choose a specific color or style
                    }}
                >
                    Update
                </button>
                <button 
                    className='button3' 
                    onClick={closeModal} 
                    style={{ 
                        padding: '10px' 
                    }}
                >
                    Cancel
                </button>
            </motion.div>
        </div>
    );
}
