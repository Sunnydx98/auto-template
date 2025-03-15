import React, { useState } from 'react';
import axios from 'axios';
import '../css/FileUpload.css'; // 引入新的CSS样式

function FileUpload() {
    const [sheetName, setSheetName] = useState('');
    const [partitionNum, setPartitionNum] = useState('');
    const [file, setFile] = useState(null);
    const [factName, setFactName] = useState('');
    const [loadName, setLoadName] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // 每页显示10条
    const [env, setEnv] = useState('dev');

    // 新增的案件建议弹窗状态
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [batchFileSize, setBatchFileSize] = useState('');
    const [loadTimes, setLoadTimes] = useState('');
    const [suggestedValue, setSuggestedValue] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sheetName', sheetName);
        formData.append('partitionNum', partitionNum);
        formData.append('factName', factName);
        formData.append('loadName', loadName);

        try {
            const response = await axios.post('http://localhost:8080/upload/parse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponseData(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const downloadHql = async (fileName, hqlStatements) => {
        try {
            const response = await axios.get('http://localhost:8080/upload/download', {
                params: {
                    fileName: fileName,
                    hqlStatements: hqlStatements,
                },
                responseType: 'blob',
            });

            // Download the file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(response.data);
            link.download = `${fileName}.txt`;
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const renderPagination = () => {
        const totalPages = responseData?.totalPages || 0;
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    const renderHqlTable = (hqlStatements) => {
        const startIndex = (currentPage - 1) * pageSize;
        const currentPageData = hqlStatements.slice(startIndex, startIndex + pageSize);

        return (
            <div>
                {currentPageData.map((hql, index) => (
                    <pre key={index}>{hql}</pre>
                ))}
            </div>
        );
    };

    const handleShowSuggestionModal = () => {
        setShowSuggestionModal(true);
    };

    const handleCloseSuggestionModal = () => {
        setShowSuggestionModal(false);
        setBatchFileSize('');
        setLoadTimes('');
        setSuggestedValue(null);
    };

    const handleSubmitSuggestion = () => {
        // 这里假设根据 batchFileSize 和 loadTimes 来计算建议的数值
        const suggestedValue = parseInt(batchFileSize) * parseInt(loadTimes); // 简单示例
        setSuggestedValue(suggestedValue);
    };

    return (
        <div className="file-upload-container">
            <div className="input-container">
                <h2>File Upload</h2>

                {/* 环境选择（放在第一个位置） */}
                <div className="input-group env-group">
                    <label>
                        Environment <span className="required">*</span>
                        <span className="tooltip">Choose the environment for this upload (dev, uat, pra).</span>
                    </label>
                    <select className="env-select" value={env} onChange={(e) => setEnv(e.target.value)}>
                        <option value="dev">DEV</option>
                        <option value="uat">UAT</option>
                        <option value="pra">PROD</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>
                        Fact Name <span className="required">*</span>
                        <span className="tooltip">Set the name for fact table.</span>
                    </label>
                    <input
                        type="text"
                        value={factName}
                        onChange={(e) => setFactName(e.target.value)}
                        placeholder="Enter Fact Name"
                    />
                </div>

                <div className="input-group">
                    <label>
                        Load Name <span className="required">*</span>
                        <span className="tooltip">Set the name for load table.</span>
                    </label>
                    <input
                        type="text"
                        value={loadName}
                        onChange={(e) => setLoadName(e.target.value)}
                        placeholder="Enter Load Name"
                    />
                </div>


                <div className="input-group partition-group">
                    <label>
                        Partition Number <span className="required">*</span>
                        <span className="tooltip">If you're not clear, click the right button.</span>
                    </label>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                            type="number"
                            value={partitionNum}
                            onChange={(e) => setPartitionNum(e.target.value)}
                            placeholder="Enter Partition Number"
                            style={{flex: 1}}
                        />
                        <button className="suggestion-btn" onClick={handleShowSuggestionModal}>Get Suggestion</button>
                    </div>
                </div>

                <div className="input-group">
                    <label>Upload File</label>
                    <input type="file" onChange={handleFileChange}/>
                </div>

                <div className="input-group">
                    <label>
                        Sheet Name <span className="required">*</span>
                        <span className="tooltip">The name of the sheet that contains data structure.</span>
                    </label>
                    <input
                        type="text"
                        value={sheetName}
                        onChange={(e) => setSheetName(e.target.value)}
                        placeholder="Enter Sheet Name"
                    />
                </div>

                <button className="upload-btn" onClick={handleSubmit}>
                    Upload
                </button>
            </div>

            <div className="results-container">
                <h2>Generated HQL Statements</h2>
                {responseData ? (
                    <>
                        <h3>Fact Table HQL</h3>
                        {renderHqlTable(responseData.hqlStatementsFact)}
                        <h3>Load Table HQL</h3>
                        {renderHqlTable(responseData.hqlStatementsLoad)}

                        {renderPagination()}

                        {/* 两个并排的下载按钮 */}
                        <div className="download-btn-container">
                            <button className="download-btn"
                                    onClick={() => downloadHql('fact_table_hql', responseData.hqlStatementsFact)}
                            >
                                Download Fact Table HQL
                            </button>
                            <button className="download-btn"
                                    onClick={() => downloadHql('load_table_hql', responseData.hqlStatementsLoad)}
                            >
                                Download Load Table HQL
                            </button>
                        </div>
                    </>
                ) : (
                    <p>No data to display.</p>
                )}
            </div>

            {/* 弹窗部分 */}
            {showSuggestionModal && (
                <div className="suggestion-modal-overlay">
                    <div className="suggestion-modal">
                        <h3>Case Suggestion</h3>
                        <div className="input-group">
                            <label>Batch File Size</label>
                            <input
                                type="number"
                                value={batchFileSize}
                                onChange={(e) => setBatchFileSize(e.target.value)}
                                placeholder="Enter Batch File Size"
                            />
                        </div>
                        <div className="input-group">
                            <label>Load Times</label>
                            <input
                                type="number"
                                value={loadTimes}
                                onChange={(e) => setLoadTimes(e.target.value)}
                                placeholder="Enter Load Times"
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button className="submit-suggestion-btn" onClick={handleSubmitSuggestion}>
                                Submit
                            </button>
                            <button className="close-suggestion-btn" onClick={handleCloseSuggestionModal}>
                                Close
                            </button>
                        </div>
                        {suggestedValue !== null && (
                            <div className="suggestion-result">
                                <h4>Suggested Value: {suggestedValue}</h4>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
