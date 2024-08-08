import React, { useState } from 'react';
import axios from '../axiosConfig';

const ListDevices = () => {
    const [devices, setDevices] = useState([]);
    const [message, setMessage] = useState('');

    const handleListDevices = async () => {
        try {
            const response = await axios.get('/list-devices/');
            setDevices(response.data);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error listing devices');
        }
    };

    return (
        <div>
            <h2>List Devices</h2>
            <button onClick={handleListDevices}>List Devices</button>
            {message && <p>{message}</p>}
            <ul>
                {devices.map((device, index) => (
                    <li key={index}>
                        <p>{device.name}</p>
                        <ul>
                            {device.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item.name} ({item.type})</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListDevices;
