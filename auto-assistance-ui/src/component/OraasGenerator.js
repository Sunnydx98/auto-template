import React, { useState } from "react";
import axios from "axios";
import "../css/FileUpload.css"; // 继续复用 FileUpload.css

function OraasGenerator() {
    const [env, setEnv] = useState("dev");
    const [fileNamePattern, setFileNamePattern] = useState("");
    const [file, setFile] = useState(null);
    const [responseData, setResponseData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("env", env);
        formData.append("fileNamePattern", fileNamePattern);

        try {
            const response = await axios.post("http://localhost:8080/upload/oraas", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResponseData(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const downloadTemplate = () => {
        const content = "flow=\nregion\n";
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "template.properties";
        link.click();
    };

    return (
        <div className="oraas-generator-container">
            <div className="input-container">
                <h2>Oraas Generator</h2>

                <div className="input-group">
                    <label>Environment</label>
                    <select className="env-select" value={env} onChange={(e) => setEnv(e.target.value)}>
                        <option value="dev">DEV</option>
                        <option value="uat">UAT</option>
                        <option value="pra">PROD</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>File Name Pattern</label>
                    <input
                        type="text"
                        value={fileNamePattern}
                        onChange={(e) => setFileNamePattern(e.target.value)}
                        placeholder="Enter file name pattern"
                    />
                </div>

                <div className="input-group">
                    <label>Upload File</label>
                    <input type="file" onChange={handleFileChange} />
                </div>

                <div className="button-group">
                    <button className="download-btn" onClick={downloadTemplate}>
                        Download Template
                    </button>
                    <button className="upload-btn" onClick={handleSubmit}>
                        Upload
                    </button>
                </div>
            </div>

            <div className="results-container">
                <h2>Generated Results</h2>
                {responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                ) : (
                    <p>No data to display.</p>
                )}
            </div>
        </div>
    );
}

export default OraasGenerator;
