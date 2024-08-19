import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, DATABASE_ID, ID, KEYPERSONS_COLLECTION_ID, STARTUP_COLLECTION_ID } from '../../appwriteConfig';
import './Dashboard.css';

const AddKeyPerson = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        salutation: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        startup: ''
    });
    const [startups, setStartups] = useState([]);

    const fetchStartups = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, STARTUP_COLLECTION_ID);
            setStartups(response.documents);
        } catch (error) {
            console.error('Error fetching startups:', error);
        }
    };

    useEffect(() => {
        fetchStartups();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Fetch the selected startup's name
            const selectedStartup = startups.find(startup => startup.$id === formData.startup);
            const startupName = selectedStartup ? selectedStartup.name : '';

            // Add the startup name to the form data
            const keyPersonData = { ...formData, startupName };

            // Remove 'startup' from keyPersonData before creating the document
            const { startup, ...restKeyPersonData } = keyPersonData;

            await databases.createDocument(DATABASE_ID, KEYPERSONS_COLLECTION_ID, ID.unique(), restKeyPersonData);
            alert('Key Person added successfully');
            navigate('/');
        } catch (error) {
            console.error('Error adding key person:', error);
            alert('Failed to add key person: ' + error.message);
        }
    };

    return (
        <form className="add-keyperson-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Salutation:</label>
                <select className="form-select" name="salutation" value={formData.salutation} onChange={handleChange} required>
                    <option value="">Select Salutation</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">First Name:</label>
                <input className="form-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Last Name:</label>
                <input className="form-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Phone Number:</label>
                <input className="form-input" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Startup:</label>
                <select className="form-select" name="startup" value={formData.startup} onChange={handleChange} required>
                    <option value="">Select Startup</option>
                    {startups.map((startup) => (
                        <option key={startup.$id} value={startup.$id}>
                            {startup.name}
                        </option>
                    ))}
                </select>
            </div>
            <button className="form-button" type="submit">Add Key Person</button>
        </form>
    );
};

export default AddKeyPerson;
