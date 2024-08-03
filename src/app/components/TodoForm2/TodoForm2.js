"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './page.css';
import ModalTodo2 from '../ModalTodo2/ModalTodo2';
import ModalUpdateTodo2 from '../ModalUpdateTodo2/ModalUpdateTodo2';
import { fetchTodos, addTodo, deleteTodo, updateTodo } from '../toDoService2/todoService2';

export default function TodoForm2() {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [expandedTodoId, setExpandedTodoId] = useState(null);
    const [todos2, setTodos2] = useState([]);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [filter, setFilter] = useState('');
    const [sortedTodos, setSortedTodos] = useState([]);
    const [currentTodo2, setCurrentTodo2] = useState(null);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenUpdateModal = (todo2) => {
        setCurrentTodo2(todo2);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setCurrentTodo2(null);
    };

    const handleToggleDetails = (id) => {
        setExpandedTodoId(prevId => prevId === id ? null : id);
    };

    const loadTodos2 = useCallback(async () => {
        try {
            const response = await fetchTodos();
            setTodos2(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load.');
        }
    }, []);

    const handleAddTodo2 = async (newTodo2) => {
        try {
            const response = await addTodo(newTodo2);
            setTodos2(prevTodos2 => [...prevTodos2, response.data]);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add todo:', error);
            setError('Failed to add.');
        }
    };

    const handleUpdateTodo2 = async (updatedTodo2) => {
        try {
            const response = await updateTodo(updatedTodo2.id, updatedTodo2);
            setTodos2(prevTodos2 => prevTodos2.map(todo2 => todo2.id === updatedTodo2.id ? response.data : todo2));
            setShowUpdateModal(false);
            setCurrentTodo2(null);
        } catch (error) {
            console.error('Failed to update todo:', error);
            setError('Failed to update.');
        }
    };

    const handleDeleteTodo2 = async (id, event) => {
        event.preventDefault();
        try {
            await deleteTodo(id);
            setTodos2(prevTodos2 => prevTodos2.filter(todo2 => todo2.id !== id));
        } catch (error) {
            console.error('Failed to delete todo:', error);
            setError('Failed to delete.');
        }
    };

    const handleCompleteTodo2 = async (id) => {
        try {
            const currentTodo2 = todos2.find(todo2 => todo2.id === id);
            const updatedTodo2 = { ...currentTodo2, completed: !currentTodo2.completed };
            await updateTodo(id, updatedTodo2);
            setTodos2(prevTodos2 => 
                prevTodos2.map(todo2 => 
                    todo2.id === id ? updatedTodo2 : todo2
                )
            );
        } catch (error) {
            console.error('Failed to complete todo:', error);
            setError('Failed to complete.');
        }
        setExpandedTodoId(null);
    };

    useEffect(() => {
        loadTodos2();
    }, [loadTodos2]);

    useEffect(() => {
        const priorityOrder = ['High', 'Medium', 'Low'];

        const filteredTodos2 = filter
            ? todos2.filter(todo2 => todo2.priority === filter)
            : todos2;

        const sorted = [...filteredTodos2].sort((a, b) => {
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
    }, [todos2, sortOrder, filter]);

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

                {showModal && <ModalTodo2 closeModal={handleCloseModal} onAddTodo={handleAddTodo2} />}
                {showUpdateModal && currentTodo2 && (
                    <ModalUpdateTodo2
                        todo2={currentTodo2} 
                        closeModal={handleCloseUpdateModal} 
                        onUpdateTodo={handleUpdateTodo2} 
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
                    {sortedTodos.map(todo2 => (
                        <div key={todo2.id} className={`todo-item ${todo2.completed ? 'completed' : ''} ${isCloseToMidnight(todo2.due_date) ? 'close-to-midnight' : ''}`}>
                            <div className='todo-header' onClick={() => handleToggleDetails(todo2.id)}>
                                <p>{todo2.title}</p>
                                <p className='priority2'>{todo2.priority}</p>
                                <p>{todo2.tags}</p>
                            </div>
                            {expandedTodoId === todo2.id && (
                                <motion.div
                                    className="details"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: expandedTodoId === todo2.id ? 'auto' : 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{todo2.description}</p>
                                    <p className='p2'>Due date: {todo2.due_date}</p>
                                    <div className="button-container">
                                        <button 
                                            type="button" 
                                            className="complete-button" 
                                            onClick={() => handleCompleteTodo2(todo2.id)}
                                        >
                                            {todo2.completed ? 'Undo' : 'Complete'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="edit-button" 
                                            onClick={() => handleOpenUpdateModal(todo2)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            type="button" 
                                            className="delete-button" 
                                            onClick={(event) => handleDeleteTodo2(todo2.id, event)}
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
