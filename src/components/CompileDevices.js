import React, { useState } from 'react';
import axios from '../axiosConfig';

const CompileDevices = () => {
    const [message, setMessage] = useState('');

    const handleCompileDevices = async () => {
        try {
            const response = await axios.post('/compile-devices/');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error compiling devices');
        }
    };

    return (
        <div>
            <h2>Compile Devices</h2>
            <button onClick={handleCompileDevices}>Compile Devices</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CompileDevices;
