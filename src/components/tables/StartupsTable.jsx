import React, { useState } from 'react';
import './styleTable.css'

const StartupsTable = ({ startups, startupSearch, setStartupSearch, handleNavigation, updateStartup, addStartup, deleteStartup }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [newStartupData, setNewStartupData] = useState({
        name: '',
        client: '',
        serviceType: '',
        financialYear: '',
        status: '',
        receivedDate: '',
        connectDate: '',
        stage: ''
    });

    const filteredStartups = startups.filter((startup) =>
        startup.name.toLowerCase().includes(startupSearch.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleSelectChange = (startupId) => {
        setSelectedIds((prev) =>
            prev.includes(startupId) ? prev.filter((id) => id !== startupId) : [...prev, startupId]
        );
    };

    const handleEditClick = () => {
        const startup = startups.find((startup) => startup.$id === selectedIds[0]);
        if (startup) {
            setEditingId(startup.$id);
            setEditedData(startup);
        }
    };

    const handleDeleteClick = async () => {
        try {
            for (const id of selectedIds) {
                await deleteStartup(id);
            }
            setSelectedIds([]);
        } catch (error) {
            console.error('Error deleting startups:', error);
        }
    };

    const handleInputChange = (e, field, isNew = false) => {
        if (isNew) {
            setNewStartupData({
                ...newStartupData,
                [field]: e.target.value,
            });
        } else {
            setEditedData({
                ...editedData,
                [field]: e.target.value,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            await updateStartup(editedData);
            setEditingId(null);
        } catch (error) {
            console.error('Error updating startup:', error);
        }
    };

    const handleAddClick = async () => {
        try {
            await addStartup(newStartupData);
            setNewStartupData({
                name: '',
                client: '',
                serviceType: '',
                financialYear: '',
                status: '',
                receivedDate: '',
                connectDate: '',
                stage: ''
            });
            alert("New startup added successfully!");
        } catch (error) {
            console.error("Error adding startup:", error);
        }
    };

    return (
        <div className="startups-view">
            <h2>Startups</h2>
            <div className='add-new startups'>
                <div onClick={() => handleNavigation('/add-startup')}>+New Startup</div>
            </div>
            <input
                type="text"
                placeholder="Search by Startup Name"
                value={startupSearch}
                onChange={(e) => setStartupSearch(e.target.value)}
                className="search-bar"
            />
            <div className='edit-delete-buttons'>
                <button className='edit-button' onClick={handleEditClick} disabled={selectedIds.length !== 1}>Edit</button>
                <button className='delete-button' onClick={handleDeleteClick} disabled={selectedIds.length === 0}>Delete</button>
            </div>
            <table className="startups-table">
                <thead>
                    <tr>
                        <th className='select-box'>Select</th>
                        <th>Name</th>
                        <th>Client</th>
                        <th>Service Type</th>
                        <th>Financial Year</th>
                        <th>Status</th>
                        <th>Received Date</th>
                        <th>Connect Date</th>
                        <th>Stage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStartups.map((startup) => (
                        <tr key={startup.$id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(startup.$id)}
                                    onChange={() => handleSelectChange(startup.$id)}
                                />
                            </td>
                            {editingId === startup.$id ? (
                                <>
                                    <td><input type="text" value={editedData.name} onChange={(e) => handleInputChange(e, 'name')} /></td>
                                    <td>
                                        <select value={editedData.client} onChange={(e) => handleInputChange(e, 'client')}>
                                            <option value="">Select Client</option>
                                            <option value="TANSIM">TANSIM</option>
                                            <option value="Standalone">Standalone</option>
                                            <option value="Deftech">Deftech</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={editedData.serviceType} onChange={(e) => handleInputChange(e, 'serviceType')}>
                                            <option value="">Select Service Type</option>
                                            <option value="Investment Raise">Investment Raise</option>
                                            <option value="Business Due Diligence">Business Due Diligence</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={editedData.financialYear} onChange={(e) => handleInputChange(e, 'financialYear')}>
                                            <option value="">Select Financial Year</option>
                                            <option value="2022-23">2022-23</option>
                                            <option value="2023-24">2023-24</option>
                                            <option value="2024-25">2024-25</option>
                                            <option value="2025-26">2025-26</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={editedData.status} onChange={(e) => handleInputChange(e, 'status')}>
                                            <option value="">Select Status</option>
                                            <option value="Pipeline">Pipeline</option>
                                            <option value="Under Process">Under Process</option>
                                            <option value="On-Hold">On-Hold</option>
                                            <option value="Non-Responsive">Non-Responsive</option>
                                            <option value="Backed out">Backed out</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td><input type="date" value={editedData.receivedDate} onChange={(e) => handleInputChange(e, 'receivedDate')} /></td>
                                    <td><input type="date" value={editedData.connectDate} onChange={(e) => handleInputChange(e, 'connectDate')} /></td>
                                    <td>
                                        <select value={editedData.stage} onChange={(e) => handleInputChange(e, 'stage')}>
                                            <option value="">Select Stage</option>
                                            <option value="First Connect">First Connect</option>
                                            <option value="Queries Raised">Queries Raised</option>
                                            <option value="Deep Dive">Deep Dive</option>
                                            <option value="SME validation">SME validation</option>
                                        </select>
                                    </td>
                                    <td><button onClick={handleSaveClick}>Save</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{startup.name}</td>
                                    <td>{startup.client}</td>
                                    <td>{startup.serviceType}</td>
                                    <td>{startup.financialYear}</td>
                                    <td>{startup.status}</td>
                                    <td>{formatDate(startup.receivedDate)}</td>
                                    <td>{formatDate(startup.connectDate)}</td>
                                    <td>{startup.stage}</td>
                                    <td></td>
                                </>
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td><input type="text" value={newStartupData.name} onChange={(e) => handleInputChange(e, 'name', true)} /></td>
                        <td>
                            <select value={newStartupData.client} onChange={(e) => handleInputChange(e, 'client', true)}>
                                <option value="">Select Client</option>
                                <option value="TANSIM">TANSIM</option>
                                <option value="Standalone">Standalone</option>
                                <option value="Deftech">Deftech</option>
                            </select>
                        </td>
                        <td>
                            <select value={newStartupData.serviceType} onChange={(e) => handleInputChange(e, 'serviceType', true)}>
                                <option value="">Select Service Type</option>
                                <option value="Investment Raise">Investment Raise</option>
                                <option value="Business Due Diligence">Business Due Diligence</option>
                            </select>
                        </td>
                        <td>
                            <select value={newStartupData.financialYear} onChange={(e) => handleInputChange(e, 'financialYear', true)}>
                                <option value="">Select Financial Year</option>
                                <option value="2022-23">2022-23</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2025-26">2025-26</option>
                            </select>
                        </td>
                        <td>
                            <select value={newStartupData.status} onChange={(e) => handleInputChange(e, 'status', true)}>
                                <option value="">Select Status</option>
                                <option value="Pipeline">Pipeline</option>
                                <option value="Under Process">Under Process</option>
                                <option value="On-Hold">On-Hold</option>
                                <option value="Non-Responsive">Non-Responsive</option>
                                <option value="Backed out">Backed out</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </td>
                        <td><input type="date" value={newStartupData.receivedDate} onChange={(e) => handleInputChange(e, 'receivedDate', true)} /></td>
                        <td><input type="date" value={newStartupData.connectDate} onChange={(e) => handleInputChange(e, 'connectDate', true)} /></td>
                        <td>
                            <select value={newStartupData.stage} onChange={(e) => handleInputChange(e, 'stage', true)}>
                                <option value="">Select Stage</option>
                                <option value="First Connect">First Connect</option>
                                <option value="Queries Raised">Queries Raised</option>
                                <option value="Deep Dive">Deep Dive</option>
                                <option value="SME validation">SME validation</option>
                            </select>
                        </td>
                        <td><button onClick={handleAddClick}>Add</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StartupsTable;
