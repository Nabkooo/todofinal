"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './page.css';
import ModalTodo1 from '../ModalTodo1/ModalTodo1';
import ModalUpdateTodo1 from '../ModalUpdateTodo1/ModalUpdateTodo1';
import { fetchTodos, addTodo, deleteTodo, updateTodo } from '../toDoService/todoService';

export default function TodoForm() {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [expandedTodoId, setExpandedTodoId] = useState(null);
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [filter, setFilter] = useState('');
    const [sortedTodos, setSortedTodos] = useState([]);
    const [currentTodo, setCurrentTodo] = useState(null);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenUpdateModal = (todo) => {
        setCurrentTodo(todo);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setCurrentTodo(null);
    };

    const handleToggleDetails = (id) => {
        setExpandedTodoId(prevId => prevId === id ? null : id);
    };

    const loadTodos = useCallback(async () => {
        try {
            const response = await fetchTodos();
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load.');
        }
    }, []);

    const handleAddTodo = async (newTodo) => {
        try {
            const response = await addTodo(newTodo);
            setTodos(prevTodos => [...prevTodos, response.data]);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add todo:', error);
            setError('Failed to add.');
        }
    };

    const handleUpdateTodo = async (updatedTodo) => {
        try {
            const response = await updateTodo(updatedTodo.id, updatedTodo);
            setTodos(prevTodos => prevTodos.map(todo => todo.id === updatedTodo.id ? response.data : todo));
            setShowUpdateModal(false);
            setCurrentTodo(null);
        } catch (error) {
            console.error('Failed to update todo:', error);
            setError('Failed to update.');
        }
    };

    const handleDeleteTodo = async (id, event) => {
        event.preventDefault();
        try {
            await deleteTodo(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Failed to delete todo:', error);
            setError('Failed to delete.');
        }
    };

    const handleCompleteTodo = async (id) => {
        try {
            const currentTodo = todos.find(todo => todo.id === id);
            const updatedTodo = { ...currentTodo, completed: !currentTodo.completed };
            await updateTodo(id, updatedTodo);
            setTodos(prevTodos => 
                prevTodos.map(todo => 
                    todo.id === id ? updatedTodo : todo
                )
            );
        } catch (error) {
            console.error('Failed to complete todo:', error);
            setError('Failed to complete.');
        }
        setExpandedTodoId(null);
    };

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    useEffect(() => {
        const priorityOrder = ['High', 'Medium', 'Low'];

        const filteredTodos = filter
            ? todos.filter(todo => todo.priority === filter)
            : todos;

        const sorted = [...filteredTodos].sort((a, b) => {
            const aPriorityIndex = priorityOrder.indexOf(a.priority);
            const bPriorityIndex = priorityOrder.indexOf(b.priority);

            if (sortOrder === 'High to Low') {
                return bPriorityIndex - aPriorityIndex;
            } else if (sortOrder === 'Low to High') {
                return aPriorityIndex - bPriorityIndex;
            } else {
                return 0;
            }
        });

        setSortedTodos(sorted);
    }, [todos, sortOrder, filter]);

    const isCloseToMidnight = (dueDate) => {
        const now = new Date();
        const deadline = new Date(dueDate);

        const diffMinutes = (deadline - now) / 1000 / 60;

        const threshold = 60;

        return diffMinutes > 0 && diffMinutes <= threshold;
    };

    return (
        <div>
            <form className="TodoWrapper" onSubmit={(e) => e.preventDefault()}>
                <h1 className='text'>Plan your day!</h1>

                <button 
                    type="button" 
                    className='button1' 
                    onClick={handleOpenModal}
                >
                    Open Modal
                </button>

                {showModal && <ModalTodo1 closeModal={handleCloseModal} onAddTodo={handleAddTodo} />}
                {showUpdateModal && currentTodo && (
                    <ModalUpdateTodo1 
                        todo={currentTodo} 
                        closeModal={handleCloseUpdateModal} 
                        onUpdateTodo={handleUpdateTodo} 
                    />
                )}

                <div className="sort-container">
                    <button 
                        type="button" 
                        className={`sort-button ${sortOrder === 'High to Low' ? 'active' : ''}`} 
                        onClick={() => setSortOrder('High to Low')}
                    >
                        High to Low
                    </button>
                    <button 
                        type="button" 
                        className={`sort-button ${sortOrder === 'Low to High' ? 'active' : ''}`} 
                        onClick={() => setSortOrder('Low to High')}
                    >
                        Low to High
                    </button>
                </div>

                <div className="filter-container">
                    <button 
                        type="button" 
                        className={`filter-button ${filter === '' ? 'active' : ''}`} 
                        onClick={() => setFilter('')}
                    >
                        All
                    </button>
                    <button 
                        type="button" 
                        className={`filter-button ${filter === 'High' ? 'active' : ''}`} 
                        onClick={() => setFilter('High')}
                    >
                        High
                    </button>
                    <button 
                        type="button" 
                        className={`filter-button ${filter === 'Medium' ? 'active' : ''}`} 
                        onClick={() => setFilter('Medium')}
                    >
                        Medium
                    </button>
                    <button 
                        type="button" 
                        className={`filter-button ${filter === 'Low' ? 'active' : ''}`} 
                        onClick={() => setFilter('Low')}
                    >
                        Low
                    </button>
                </div>

                <div className='todo-container'>
                    {sortedTodos.map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${isCloseToMidnight(todo.due_date) ? 'close-to-midnight' : ''}`}>
                            <div className='todo-header' onClick={() => handleToggleDetails(todo.id)}>
                                <p>{todo.title}</p>
                                <p className='priority2'>{todo.priority}</p>
                                <p>{todo.tags}</p>
                            </div>
                            {expandedTodoId === todo.id && (
                                <motion.div
                                    className="details"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: expandedTodoId === todo.id ? 'auto' : 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{todo.description}</p>
                                    <p className='p2'>Due date: {todo.due_date}</p>
                                    <div className="button-container">
                                        <button 
                                            type="button" 
                                            className="complete-button" 
                                            onClick={() => handleCompleteTodo(todo.id)}
                                        >
                                            {todo.completed ? 'Undo' : 'Complete'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="edit-button" 
                                            onClick={() => handleOpenUpdateModal(todo)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            type="button" 
                                            className="delete-button" 
                                            onClick={(event) => handleDeleteTodo(todo.id, event)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}
