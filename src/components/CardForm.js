// src/components/CardForm.js
import React, { useState, useEffect } from 'react';

const CardForm = ({ data, onSubmit }) => {
    const [formData, setFormData] = useState(data);

    useEffect(() => {
        setFormData(data); // Update formData when data changes
    }, [data]);

    const handleChange = (deviceName, cardNumber, field, value) => {
        const updatedFormData = { ...formData };
        updatedFormData[deviceName].Cards[cardNumber][field] = value;
        setFormData(updatedFormData);
    };

    const handleSubmit = () => {
        onSubmit(formData);
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

export default CardForm;
