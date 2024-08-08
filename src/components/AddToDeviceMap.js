import React, { useState } from 'react';
import axios from 'axios';

const AddToDeviceMap = () => {
  const [name, setName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [version, setVersion] = useState('');
  const [typeCard, setTypeCard] = useState('iocards');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        order_number: `OrderNumber:${orderNumber}/V${version}`,
        type_card: typeCard,
      };
      console.log('Sending payload:', payload); // For debugging
      const response = await axios.post('http://localhost:8000/add-to-device-map/', payload);
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Error adding to device map:', err);
      if (err.response) {
        const errorDetails = err.response.data.detail;
        if (Array.isArray(errorDetails)) {
          setError(errorDetails.map(err => `${err.loc.join(' -> ')}: ${err.msg}`).join(', '));
        } else {
          setError(errorDetails);
        }
      } else {
        setError('Failed to add to device map.');
      }
    }
  };

  return (
    <div>
      <h2>Add to Device Map</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Order Number:
            <div style={{ display: 'flex' }}>
              <input type="text" value="OrderNumber:" readOnly style={{ width: '85px' }} />
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
              <input type="text" value="/V" readOnly style={{ width: '15px' }} />
              <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required />
            </div>
          </label>
        </div>
        <div>
          <label>
            Type Card:
            <select value={typeCard} onChange={(e) => setTypeCard(e.target.value)} required>
              <option value="iocards">IO Cards</option>
              <option value="cpucards">CPU Cards</option>
              <option value="riocards">RIO Cards</option>
            </select>
          </label>
        </div>
        <button type="submit">Add to Map</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddToDeviceMap;
