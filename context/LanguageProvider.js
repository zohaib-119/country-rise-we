'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for language
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => {
    return useContext(LanguageContext);
};

// Language provider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default language is English

    // Load language preference from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        } else {
            localStorage.setItem('language', 'en'); // Default language
        }
    }, []);

    // Function to change the language
    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang); // Save language to localStorage
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
