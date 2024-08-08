import React, { useState } from 'react';
import axios from '../axiosConfig';

const AddDevicesJson = () => {
    const [devices, setDevices] = useState([{ order_number: '', device_name: '', item_name: '', cards: [] }]);
    const [message, setMessage] = useState('');

    const handleDeviceChange = (index, field, value) => {
        const newDevices = [...devices];
        newDevices[index][field] = value;
        setDevices(newDevices);
    };

    const handleAddDevice = () => {
        setDevices([...devices, { order_number: '', device_name: '', item_name: '', cards: [] }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/add-devices-json/', devices);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error adding devices');
        }
    };

    return (
        <div>
            <h2>DevicesJSON</h2>
            <form onSubmit={handleSubmit}>
                {devices.map((device, index) => (
                    <div key={index}>
                        <div>
                            <label>Order Number:</label>
                            <input 
                                type="text" 
                                value={device.order_number} 
                                onChange={(e) => handleDeviceChange(index, 'order_number', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label>Device Name:</label>
                            <input 
                                type="text" 
                                value={device.device_name} 
                                onChange={(e) => handleDeviceChange(index, 'device_name', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label>Item Name:</label>
                            <input 
                                type="text" 
                                value={device.item_name} 
                                onChange={(e) => handleDeviceChange(index, 'item_name', e.target.value)} 
                            />
                        </div>
                        <div>
                            <label>Cards (JSON format):</label>
                            <input 
                                type="text" 
                                value={JSON.stringify(device.cards)} 
                                onChange={(e) => handleDeviceChange(index, 'cards', JSON.parse(e.target.value))} 
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddDevice}>Add Another Device</button>
                <button type="submit">Add Devices</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddDevicesJson;
