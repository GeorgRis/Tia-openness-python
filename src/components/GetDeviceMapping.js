import React, { useState } from 'react';
import axios from '../axiosConfig';

const GetDeviceMapping = () => {
    const [mappingType, setMappingType] = useState('');
    const [deviceMapping, setDeviceMapping] = useState({});
    const [message, setMessage] = useState('');

    const handleGetDeviceMapping = async () => {
        try {
            const response = await axios.get('/get-device-mapping/', {
                params: { mapping_type: mappingType }
            });
            setDeviceMapping(response.data);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error getting device mapping');
        }
    };

    return (
        <div>
            <h2>Get Device Mapping</h2>
            <div>
                <label>Select Mapping Type:</label>
                <select value={mappingType} onChange={(e) => setMappingType(e.target.value)}>
                    <option value="">Merged List</option>
                    <option value="iocards">IO Cards</option>
                    <option value="cpucards">CPU Cards</option>
                    <option value="riocards">RIO Cards</option>
                </select>
            </div>
            <button onClick={handleGetDeviceMapping}>Get Device Mapping</button>
            {message && <p>{message}</p>}
            <pre>{JSON.stringify(deviceMapping, null, 2)}</pre>
        </div>
    );
};

export default GetDeviceMapping;
