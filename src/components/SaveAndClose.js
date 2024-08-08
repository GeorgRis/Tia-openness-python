import React, { useState } from 'react';
import axios from '../axiosConfig';

const SaveAndClose = () => {
    const [message, setMessage] = useState('');

    const handleSaveAndClose = async () => {
        try {
            const response = await axios.post('/save-close/');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error saving and closing project');
        }
    };

    return (
        <div>
            <h2>Save and Close Project</h2>
            <button onClick={handleSaveAndClose}>Save and Close</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SaveAndClose;
