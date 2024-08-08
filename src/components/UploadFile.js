import React, { useState } from 'react';

function UploadFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [sheetsData, setSheetsData] = useState([]);
    const [inputData, setInputData] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/upload-file/', { 
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            console.log("Uploaded file, received sheet names:", data.sheets);  // Debug print

            // Skip the first two sheets
            const sheetsToProcess = data.sheets.slice(2);
            setSheetsData(sheetsToProcess);
            setInputData(sheetsToProcess.map(() => ({ de_type: '', ip: '', sub: '' })));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const newInputData = [...inputData];
        newInputData[index][field] = value;
        setInputData(newInputData);
    };

    const handleSubmit = async () => {
        console.log("Submitting data:", { sheets: sheetsData, inputData });  // Debug print
        try {
            const response = await fetch('http://localhost:8000/process-sheets/', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sheets: sheetsData, inputData }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            console.log("Received response:", result);  // Debug print
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {sheetsData.length > 0 && (
                <div>
                    <h3>Enter Data for Each Sheet</h3>
                    {sheetsData.map((sheet, index) => (
                        <div key={index}>
                            <h4>{sheet}</h4>
                            <input
                                type="text"
                                placeholder="Device Type"
                                value={inputData[index].de_type}
                                onChange={(e) => handleChange(index, 'de_type', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="IP Address"
                                value={inputData[index].ip}
                                onChange={(e) => handleChange(index, 'ip', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Subnet Mask"
                                value={inputData[index].sub}
                                onChange={(e) => handleChange(index, 'sub', e.target.value)}
                            />
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit Data</button>
                </div>
            )}
        </div>
    );
}

export default UploadFile;
