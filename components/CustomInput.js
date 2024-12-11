import React from 'react';

const CustomInput = ({ label, type = 'text', placeholder, required = true, value, handleChange }) => {
    return (
        <div>
            <label className="block text-lg font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};

export default CustomInput;
