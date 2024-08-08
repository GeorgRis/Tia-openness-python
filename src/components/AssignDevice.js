import React, { useState } from 'react';
import axios from '../axiosConfig';

const AssignDevice = () => {
    const [deviceName, setDeviceName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [potential, setPotential] = useState('');
    const [name, setName] = useState('');
    const [slot, setSlot] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/assign-device/', {
                device_name: deviceName,
                order_number: orderNumber,
                p_value: potential,
                name,
                slot: parseInt(slot)
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error assigning device');
        }
    };

    return (
        <div>
            <h2>Assign Device</h2>
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
                    <label>Order Number:</label>
                    <input 
                        type="text" 
                        value={orderNumber} 
                        onChange={(e) => setOrderNumber(e.target.value)} 
                    />
                </div>
                <div>
                    <label>
                        Potential:
                        <select value={potential} onChange={(e) => setPotential(e.target.value)} required>
                            <option value="">Select Potential</option>
                            <option value="Dark">Dark</option>
                            <option value="Light">Light</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Slot:</label>
                    <input 
                        type="number" 
                        value={slot} 
                        onChange={(e) => setSlot(e.target.value)} 
                    />
                </div>
                <button type="submit">Assign Device</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AssignDevice;
