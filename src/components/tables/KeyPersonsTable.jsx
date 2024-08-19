import React, { useState, useEffect } from 'react';
import './styleTable.css';

const KeyPersonsTable = ({ keyPersons, keyPersonSearch, setKeyPersonSearch, handleNavigation, updateKeyPerson, deleteKeyPerson }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [showSelectAllCheckbox, setShowSelectAllCheckbox] = useState(true);

    useEffect(() => {
        if (selectedIds.length > 0) {
            setShowSelectAllCheckbox(false);
        }
    }, [selectedIds]);

    const filteredKeyPersons = keyPersons.filter((keyPerson) =>
        keyPerson.firstName.toLowerCase().includes(keyPersonSearch.toLowerCase()) ||
        keyPerson.lastName.toLowerCase().includes(keyPersonSearch.toLowerCase())
    );

    const handleSelectChange = (keyPersonId) => {
        setSelectedIds((prev) =>
            prev.includes(keyPersonId) ? prev.filter((id) => id !== keyPersonId) : [...prev, keyPersonId]
        );
    };

    const handleEditClick = () => {
        const keyPerson = keyPersons.find((kp) => kp.$id === selectedIds[0]);
        if (keyPerson) {
            setEditingId(keyPerson.$id);
            setEditedData({
                ...keyPerson,
                startupName: keyPerson.startupName
            });
        }
    };

    const handleDeleteClick = async () => {
        try {
            if (selectedIds.length === 0) {
                alert('No key persons selected for deletion.');
                return;
            }

            for (const id of selectedIds) {
                await deleteKeyPerson(id);
            }
            setSelectedIds([]);
            setShowSelectAllCheckbox(true);
            alert('Selected key persons have been deleted.');
        } catch (error) {
            console.error('Error deleting key persons:', error);
            alert('An error occurred while deleting key persons.');
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
            await updateKeyPerson(editedData);
            setEditingId(null);
            setEditedData({});
        } catch (error) {
            console.error("Error updating key person:", error);
        }
    };

    return (
        <div className="keypersons-view">
            <h2>Key Persons</h2>
            <div className='add-new key'>
                <div onClick={() => handleNavigation('/add-key-person')}>+New Key Person</div>
            </div>
            <input 
                type="text" 
                placeholder="Search by Key Person Name" 
                value={keyPersonSearch} 
                onChange={(e) => setKeyPersonSearch(e.target.value)} 
                className="search-bar"
            />
            <div className='edit-delete-buttons'>
                <button className='edit-button' onClick={handleEditClick} disabled={selectedIds.length !== 1}>Edit</button>
                <button className='delete-button' onClick={handleDeleteClick} disabled={selectedIds.length === 0}>Delete</button>
            </div>
            <table className="keypersons-table">
                <thead>
                    <tr>
                        <th className='select-box'>Select</th>
                        <th>Salutation</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Startup</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeyPersons.map((keyPerson) => (
                        <tr key={keyPerson.$id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(keyPerson.$id)}
                                    onChange={() => handleSelectChange(keyPerson.$id)}
                                />
                            </td>
                            {editingId === keyPerson.$id ? (
                                <>
                                    <td><input type="text" value={editedData.salutation} onChange={(e) => handleInputChange(e, 'salutation')} /></td>
                                    <td><input type="text" value={editedData.firstName} onChange={(e) => handleInputChange(e, 'firstName')} /></td>
                                    <td><input type="text" value={editedData.lastName} onChange={(e) => handleInputChange(e, 'lastName')} /></td>
                                    <td><input type="text" value={editedData.phoneNumber} onChange={(e) => handleInputChange(e, 'phoneNumber')} /></td>
                                    <td>{editedData.startupName}</td>
                                    <td><button className='btn-key' onClick={handleSaveClick}>Save</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{keyPerson.salutation}</td>
                                    <td>{keyPerson.firstName}</td>
                                    <td>{keyPerson.lastName}</td>
                                    <td>{keyPerson.phoneNumber}</td>
                                    <td>{keyPerson.startupName}</td>
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

export default KeyPersonsTable;
