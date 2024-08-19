import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, DATABASE_ID, STARTUP_COLLECTION_ID, ID } from '../../appwriteConfig';
import './Dashboard.css';

const AddStartup = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        serviceType: '',
        financialYear: '',
        status: '',
        receivedDate: '',
        connectDate: '',
        stage: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await databases.createDocument(DATABASE_ID, STARTUP_COLLECTION_ID, ID.unique(), formData);
            alert('Startup added successfully');
            navigate('/'); // Navigate to home page after success
        } catch (error) {
            console.error('Error adding startup:', error);
            alert('Failed to add startup');
        }
    };

    const fetchStartupData = async () => {
        try {
          const response = await fetch('your-backend-url/api/startups');
          if (!response.ok) {
            throw new Error('Failed to fetch startup data');
          }
          const data = await response.json();
          return data; // Assuming data is an array of startup objects
        } catch (error) {
          console.error('Error fetching startup data:', error);
          return [];
        }
      };

    return (
        <form className="add-startup-form" onSubmit={handleSubmit}>
            <label className="add-startup-label">
                Startup Name: 
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="add-startup-input"/>
            </label>
            <label className="add-startup-label">
                Client: 
                <select name="client" value={formData.client} onChange={handleChange} required className="add-startup-select">
                    <option value="">Select Client</option>
                    <option value="TANSIM">TANSIM</option>
                    <option value="Standalone">Standalone</option>
                    <option value="Deftech">Deftech</option>
                </select>
            </label>
            <label className="add-startup-label">
                Service Type: 
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} required className="add-startup-select">
                    <option value="">Select Service Type</option>
                    <option value="Investment Raise">Investment Raise</option>
                    <option value="Business Due Diligence">Business Due Diligence</option>
                </select>
            </label>
            <label className="add-startup-label">
                Financial Year: 
                <select name="financialYear" value={formData.financialYear} onChange={handleChange} required className="add-startup-select">
                    <option value="">Select Financial Year</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                </select>
            </label>
            <label className="add-startup-label">
                Status: 
                <select name="status" value={formData.status} onChange={handleChange} required className="add-startup-select">
                    <option value="">Select Status</option>
                    <option value="Pipeline">Pipeline</option>
                    <option value="Under Process">Under Process</option>
                    <option value="On-Hold">On-Hold</option>
                    <option value="Non-Responsive">Non-Responsive</option>
                    <option value="Backed out">Backed out</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                </select>
            </label>
            <label className="add-startup-label">
                Startup Received Date: 
                <input type="date" name="receivedDate" value={formData.receivedDate} onChange={handleChange} required className="add-startup-input"/>
            </label>
            <label className="add-startup-label">
                First Start Connect Date: 
                <input type="date" name="connectDate" value={formData.connectDate} onChange={handleChange} required className="add-startup-input"/>
            </label>
            <label className="add-startup-label">
                Stage: 
                <select name="stage" value={formData.stage} onChange={handleChange} required className="add-startup-select">
                    <option value="">Select Stage</option>
                    <option value="First Connect">First Connect</option>
                    <option value="Queries Raised">Queries Raised</option>
                    <option value="Deep Dive">Deep Dive</option>
                    <option value="SME validation">SME validation</option>
                </select>
            </label>
            <button type="submit" className="add-startup-button">Add Startup</button>
        </form>
    );
};

export default AddStartup;
