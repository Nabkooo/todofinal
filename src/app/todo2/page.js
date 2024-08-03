"use client";
import React from 'react';
import Link from 'next/link';
import TodoForm2 from "../components/TodoForm2/TodoForm2";
import './page.css';


export default function Todo2() {
    return (
        <div className="wrapper">
            <Link href="/" className="back-button">
                Back To List
            </Link>
            <TodoForm2/>
        </div>
    );
}
