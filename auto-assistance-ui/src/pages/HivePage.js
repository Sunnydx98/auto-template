// UploadPage.js
import React, { useState } from 'react';
import FileUpload from '../component/FileUpload';

function HivePage() {
    const [responseData, setResponseData] = useState(null);
    const handleResponseData = (data) => {
        setResponseData(data);
    };

    return (
        <div className="UploadPage">
            <h1 style={{ textAlign: 'center' }}>Hive generator</h1>
            <FileUpload onResponse={handleResponseData} />
            <div style={{ marginTop: '20px', textAlign: 'center' }}></div>
        </div>
    );
}

export default HivePage;
