// src/components/DetailsForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(location.state.data);

    const handleChange = (deviceName, cardNumber, field, value) => {
        const updatedFormData = { ...formData };
        updatedFormData[deviceName].Cards[cardNumber][field] = value;
        setFormData(updatedFormData);
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8000/submit-json', formData);
            alert('Data submitted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            {Object.keys(formData).map(deviceName => (
                <div key={deviceName}>
                    <h3>{deviceName}</h3>
                    {Object.keys(formData[deviceName].Cards).map(cardNumber => (
                        <div key={cardNumber}>
                            <h4>Card {cardNumber}</h4>
                            <input
                                type="text"
                                placeholder="Device Type"
                                value={formData[deviceName].Cards[cardNumber].DeviceType || ''}
                                onChange={(e) => handleChange(deviceName, cardNumber, 'DeviceType', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="IP Address"
                                value={formData[deviceName].Cards[cardNumber].IPAddr || ''}
                                onChange={(e) => handleChange(deviceName, cardNumber, 'IPAddr', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Subnet Mask"
                                value={formData[deviceName].Cards[cardNumber].SubnetMask || ''}
                                onChange={(e) => handleChange(deviceName, cardNumber, 'SubnetMask', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default DetailsForm;
