import React, { useState } from 'react';
import axios from '../axiosConfig';

const CompileSoftware = () => {
    const [message, setMessage] = useState('');

    const handleCompileSoftware = async () => {
        try {
            const response = await axios.post('/compile-software/');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error compiling software');
        }
    };

    return (
        <div>
            <h2>Compile Software</h2>
            <button onClick={handleCompileSoftware}>Compile Software</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CompileSoftware;
