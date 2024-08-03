"use client";
import React from 'react';
import Link from 'next/link';
import TodoForm from "../components/TodoForm/TodoForm";
import './page.css';


export default function Todo1() {
    return (
        <div className="wrapper">
            <Link href="/" className="back-button">
                Back To List
            </Link>
            <TodoForm />
        </div>
    );
}
