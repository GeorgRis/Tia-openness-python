import React, { useState } from 'react';
import axios from '../axiosConfig';

const SetPotentialGroup = () => {
    const [deviceName, setDeviceName] = useState('');
    const [deviceItemName, setDeviceItemName] = useState('');
    const [potentialGroupValue, setPotentialGroupValue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/set-potential-group/', {
                device_name: deviceName,
                device_item_name: deviceItemName,
                potential_group_value: potentialGroupValue
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error setting potential group');
        }
    };

    return (
        <div>
            <h2>Set Potential Group</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Device Name:</label>
                    <input 
                        type="text" 
                        value={deviceName} 
                        onChange={(e) => setDeviceName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Device Item Name:</label>
                    <input 
                        type="text" 
                        value={deviceItemName} 
                        onChange={(e) => setDeviceItemName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Potential Group Value:</label>
                    <input 
                        type="text" 
                        value={potentialGroupValue} 
                        onChange={(e) => setPotentialGroupValue(e.target.value)} 
                    />
                </div>
                <button type="submit">Set Potential Group</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetPotentialGroup;
