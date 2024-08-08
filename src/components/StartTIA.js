// src/components/StartTIA.js
import React, { useState } from 'react';
import axios from '../axiosConfig';

const StartTIA = () => {
    const [projectPath, setProjectPath] = useState('');
    const [projectName, setProjectName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/start-tia/', {
                project_path: projectPath,
                project_name: projectName
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error starting TIA Portal');
        }
    };

    return (
        <div>
            <h2>Start TIA Portal</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Path:</label>
                    <input 
                        type="text" 
                        value={projectPath} 
                        onChange={(e) => setProjectPath(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Project Name:</label>
                    <input 
                        type="text" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                    />
                </div>
                <button type="submit">Start TIA</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default StartTIA;
