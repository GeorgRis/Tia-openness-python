import React, { useState } from 'react';
import axios from '../axiosConfig';

const AddDevice = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [message, setMessage] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [subnetMasks, setSubnetMasks] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/add-device/', {
                order_number: orderNumber,
                device_name: deviceName,
                ip_address: ipAddress,
                subnet_masks: subnetMasks
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error adding device');
        }
    };

    return (
        <div>
            <h2>Add Device</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Order Number:</label>
                    <input 
                        type="text" 
                        value={orderNumber} 
                        onChange={(e) => setOrderNumber(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Device Name:</label>
                    <input 
                        type="text" 
                        value={deviceName} 
                        onChange={(e) => setDeviceName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>IP Address:</label>
                    <input 
                        type="text" 
                        value={ipAddress} 
                        onChange={(e) => setIpAddress(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Subnet Masks:</label>
                    <input 
                        type="text" 
                        value={subnetMasks} 
                        onChange={(e) => setSubnetMasks(e.target.value)} 
                    />
                </div>
                <button type="submit">Add Device</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddDevice;
