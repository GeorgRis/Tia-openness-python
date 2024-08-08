import React, { useState } from 'react';
import axios from '../axiosConfig';

const DeleteDevice = () => {
    const [deviceName, setDeviceName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/delete-device/', {
                device_name: deviceName
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error deleting device');
        }
    };

    return (
        <div>
            <h2>Delete Device</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Device Name:</label>
                    <input 
                        type="text" 
                        value={deviceName} 
                        onChange={(e) => setDeviceName(e.target.value)} 
                    />
                </div>
                <button type="submit">Delete Device</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteDevice;
