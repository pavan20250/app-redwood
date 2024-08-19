import React, { useState, useEffect } from 'react';
import './styleTable.css';

const FundsTable = ({ funds, fundSearch, setFundSearch, handleNavigation, updateFund, deleteFund }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const filteredFunds = funds.filter((fund) =>
        fund.startupName && fund.startupName.toLowerCase().includes(fundSearch.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleEditClick = () => {
        if (selectedIds.length === 1) {
            const fundToEdit = funds.find(fund => fund.$id === selectedIds[0]);
            setEditingId(fundToEdit.$id);
            setEditedData(fundToEdit);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await Promise.all(selectedIds.map(id => deleteFund(id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting funds:", error);
        }
    };

    const handleInputChange = (e, field) => {
        setEditedData({
            ...editedData,
            [field]: e.target.value,
        });
    };

    const handleSaveClick = async () => {
        try {
            await updateFund(editedData);
            setEditingId(null);
            setEditedData({});
        } catch (error) {
            console.error("Error updating fund:", error);
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prevSelected => 
            prevSelected.includes(id) 
            ? prevSelected.filter(selectedId => selectedId !== id) 
            : [...prevSelected, id]
        );
    };

    return (
        <div className="funds-view">
            <h2>Funds</h2>
            <div className='add-new funds'>
                <div onClick={() => handleNavigation('/add-fund')}>+New Fund</div>
            </div>
            <input
                type="text"
                placeholder="Search by Startup Name"
                value={fundSearch}
                onChange={(e) => setFundSearch(e.target.value)}
                className="search-bar"
            />
            <div className='edit-delete-buttons'>
                <button className='edit-button' onClick={handleEditClick} disabled={selectedIds.length !== 1}>Edit</button>
                <button className='delete-button' onClick={handleDeleteClick} disabled={selectedIds.length === 0}>Delete</button>
            </div>
            <table className="funds-table">
                <thead>
                    <tr>
                        <th className='select-box'>Select</th>
                        <th>Startup</th>
                        <th>Financial Year</th>
                        <th>Amount</th>
                        <th>Fund Type</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFunds.map((fund) => (
                        <tr key={fund.$id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(fund.$id)}
                                    onChange={() => toggleSelection(fund.$id)}
                                />
                            </td>
                            <td>{fund.startupName}</td>
                            {editingId === fund.$id ? (
                                <>
                                    <td>
                                        <select value={editedData.financialYear} onChange={(e) => handleInputChange(e, 'financialYear')}>
                                            <option value="">Select Financial Year</option>
                                            <option value="2021-22">2021-22</option>
                                            <option value="2022-23">2022-23</option>
                                            <option value="2023-24">2023-24</option>
                                            <option value="2024-25">2024-25</option>
                                            <option value="2025-26">2025-26</option>
                                            <option value="2026-27">2026-27</option>
                                        </select>
                                    </td>
                                    <td><input type="number" value={editedData.amount} onChange={(e) => handleInputChange(e, 'amount')} /></td>
                                    <td>
                                        <select value={editedData.fundType} onChange={(e) => handleInputChange(e, 'fundType')}>
                                            <option value="">Select Fund Type</option>
                                            <option value="TANSIM">TANSIM</option>
                                            <option value="Investment Raise">Investment Raise</option>
                                        </select>
                                    </td>
                                    <td>{formatDate(fund.date)}</td>
                                    <td><button className='btn-fund' onClick={handleSaveClick}>Save</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{fund.financialYear}</td>
                                    <td>{fund.amount}</td>
                                    <td>{fund.fundType}</td>
                                    <td>{formatDate(fund.date)}</td>
                                    <td></td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FundsTable;
