import React, { useState } from 'react';
import axios from '../axiosConfig';

const OpenProject = () => {
    const [message, setMessage] = useState('');

    const handleOpenProject = async () => {
        try {
            const response = await axios.post('/open-project/');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error opening project');
        }
    };

    return (
        <div>
            <h2>Open Project</h2>
            <button onClick={handleOpenProject}>Open Project</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OpenProject;
