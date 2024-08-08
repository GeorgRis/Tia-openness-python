import React, { useState } from 'react';
import axios from '../axiosConfig';

const CreateProject = () => {
    const [message, setMessage] = useState('');

    const handleCreateProject = async () => {
        try {
            const response = await axios.post('/create-project/');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error creating project');
        }
    };

    return (
        <div>
            <h2>Create Project</h2>
            <button onClick={handleCreateProject}>Create Project</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateProject;
