import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, DATABASE_ID, FUND_COLLECTION_ID, STARTUP_COLLECTION_ID, ID } from '../../appwriteConfig';
import './Dashboard.css';

const AddFund = ({ onSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        startupName: '',
        financialYear: '',
        fundType: '',
        amount: '',
        date: ''
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

    const handleStartupChange = (e) => {
        const selectedStartupId = e.target.value;
        const selectedStartup = startups.find(startup => startup.$id === selectedStartupId);
        if (selectedStartup) {
            setFormData(prevFormData => ({
                ...prevFormData,
                startupName: selectedStartup.name
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                startupName: ''
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === 'amount' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const uniqueId = ID.unique();
            await databases.createDocument(DATABASE_ID, FUND_COLLECTION_ID, uniqueId, formData);
            alert('Fund added successfully');
            navigate('/');
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error adding fund:', error);
            if (error.message.includes('Document with the requested ID already exists')) {
                alert('Failed to add fund: Document with the same ID already exists. Please try again.');
            } else {
                alert('Failed to add fund');
            }
        }
    };

    return (
        <form className="add-fund-form" onSubmit={handleSubmit}>
            <label>
                Startup:
                <select name="startupId" value={startups.find(startup => startup.name === formData.startupName)?.$id || ''} onChange={handleStartupChange} required>
                    <option value="">Select Startup</option>
                    {startups.map((startup) => (
                        <option key={startup.$id} value={startup.$id}>
                            {startup.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Financial Year:
                <select name="financialYear" value={formData.financialYear} onChange={handleChange} required>
                    <option value="">Select Financial Year</option>
                    <option value="2021-22">2021-22</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                </select>
            </label>
            <label>
                Fund Type:
                <select name="fundType" value={formData.fundType} onChange={handleChange} required>
                    <option value="">Select Fund Type</option>
                    <option value="TANSIM">TANSIM</option>
                    <option value="Investment Raise">Investment Raise</option>
                </select>
            </label>
            <label>
                Amount:
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </label>
            <label>
                Date:
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </label>
            <button type="submit">Add Fund</button>
        </form>
    );
};

export default AddFund;
