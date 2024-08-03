"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './page.css';

// Predefined options for tags and priority
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

export default function ModalTodo1({ closeModal, onAddTodo, onUpdateTodo, todo }) {
    // Initialize state for new or existing todo
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        priority: '',
        due_date: '',
        tags: '',
        completed: false,
    });

    const [buttonColor, setButtonColor] = useState(''); // State for button color

    useEffect(() => {
        // If there's an existing todo, populate the form with its data
        if (todo) {
            setNewTodo({
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
        setNewTodo(prevTodo => ({
            ...prevTodo,
            [name]: value
        }));
    };

    const handleTagChange = (e) => {
        setNewTodo(prevTodo => ({
            ...prevTodo,
            tags: e.target.value
        }));
    };

    const handlePriorityChange = (e) => {
        const priority = e.target.value;
        setNewTodo(prevTodo => ({
            ...prevTodo,
            priority
        }));
        
        // Set button color based on selected priority
        switch (priority) {
            case 'High':
                setButtonColor('red');
                break;
            case 'Medium':
                setButtonColor('yellow');
                break;
            case 'Low':
                setButtonColor('green');
                break;
            default:
                setButtonColor('');
                break;
        }
    };

    const handleSaveTodo = () => {
        if (todo) {
            // Updating an existing todo
            onUpdateTodo && onUpdateTodo(todo.id, newTodo);
        } else {
            // Adding a new todo
            onAddTodo && onAddTodo(newTodo);
        }
        setNewTodo({
            title: '',
            description: '',
            priority: '',
            due_date: '',
            tags: ''
        });
        setButtonColor(''); // Reset button color
        closeModal();
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
                <h2>{todo ? 'Edit Todo' : 'Add New Todo'}</h2>
                <input
                    className='input'
                    type="text"
                    name="title"
                    value={newTodo.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <input
                    className='input'
                    type="text"
                    name="description"
                    value={newTodo.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <input
                    className='input'
                    type="date"
                    name="due_date"
                    value={newTodo.due_date}
                    onChange={handleChange}
                    placeholder="Due Date"
                />
                <select
                    className='input'
                    name="priority"
                    value={newTodo.priority}
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
                    value={newTodo.tags}
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
                    onClick={handleSaveTodo} 
                    style={{ 
                        padding: '10px', 
                        marginRight: '10px', 
                        backgroundColor: buttonColor 
                    }}
                >
                    {todo ? 'Update' : 'Add'}
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
