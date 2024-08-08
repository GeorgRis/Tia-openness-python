import React, { useState } from 'react';
import axios from '../axiosConfig';

const ConfigureNetwork = () => {
    const [ipAddresses, setIpAddresses] = useState(['']);
    const [message, setMessage] = useState('');

    const handleIpAddressChange = (index, value) => {
        const newIpAddresses = [...ipAddresses];
        newIpAddresses[index] = value;
        setIpAddresses(newIpAddresses);
    };

    const handleAddIpAddress = () => {
        setIpAddresses([...ipAddresses, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/configure-network/', { ip_addresses: ipAddresses });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error configuring network');
        }
    };

    return (
        <div>
            <h2>Configure Network</h2>
            <form onSubmit={handleSubmit}>
                {ipAddresses.map((ipAddress, index) => (
                    <div key={index}>
                        <label>IP Address:</label>
                        <input 
                            type="text" 
                            value={ipAddress} 
                            onChange={(e) => handleIpAddressChange(index, e.target.value)} 
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddIpAddress}>Add Another IP Address</button>
                <button type="submit">Configure Network</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ConfigureNetwork;
