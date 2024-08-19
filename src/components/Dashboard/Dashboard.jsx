import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, DATABASE_ID, STARTUP_COLLECTION_ID, KEYPERSONS_COLLECTION_ID, FUND_COLLECTION_ID } from '../../appwriteConfig';
import './Dashboard.css';
import { useAuth } from '../../utils/AuthContext';
import Pie3DChart from '../charts/Pi3DChart';
import VerticalBarChart from '../charts/VerticalBarChart';
import FundSpeedometers from '../charts/TargetGraph';
import StartupsTable from '../tables/StartupsTable';
import KeyPersonsTable from '../tables/KeyPersonsTable';
import FundsTable from '../tables/FundsTable';
import Profile from '../../pages/Profile';


import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [startups, setStartups] = useState([]);
    const [keyPersons, setKeyPersons] = useState([]);
    const [funds, setFunds] = useState([]);
    const [view, setView] = useState('dashboard');
    const [statusCounts, setStatusCounts] = useState({});
    const [startupCountsByYear, setStartupCountsByYear] = useState([]);
    const [startupSearch, setStartupSearch] = useState('');
    const [keyPersonSearch, setKeyPersonSearch] = useState('');
    const [fundSearch, setFundSearch] = useState('');

    useEffect(() => {
        fetchStartups();
        fetchKeyPersons();
        fetchFunds();
    }, []);

    useEffect(() => {
        if (view === 'startups') {
            fetchStartups();
        } else if (view === 'keyPersons') {
            fetchKeyPersons();
        }
    }, [view]);

    const fetchStartups = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, STARTUP_COLLECTION_ID);
            setStartups(response.documents);
            processStartupData(response.documents);
            processStatusData(response.documents);
        } catch (error) {
            console.error('Error fetching startups:', error);
        }
    };

    const fetchKeyPersons = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, KEYPERSONS_COLLECTION_ID);
            setKeyPersons(response.documents);
        } catch (error) {
            console.error('Error fetching key persons:', error);
        }
    };

    const fetchFunds = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, FUND_COLLECTION_ID);
            setFunds(response.documents);
        } catch (error) {
            console.error('Error fetching funds:', error);
        }
    };

    const processStartupData = (documents) => {
        const yearMap = new Map();
        documents.forEach(doc => {
            const year = doc.financialYear;
            if (yearMap.has(year)) {
                yearMap.set(year, yearMap.get(year) + 1);
            } else {
                yearMap.set(year, 1);
            }
        });

        const years = Array.from(yearMap.keys());
        const counts = Array.from(yearMap.values());

        const startupCounts = years.map((year, index) => ({
            year: year,
            count: counts[index]
        }));

        setStartupCountsByYear(startupCounts);
    };

    const processStatusData = (documents) => {
        const statusMap = {};
        documents.forEach(doc => {
            const status = doc.status;
            if (statusMap[status]) {
                statusMap[status]++;
            } else {
                statusMap[status] = 1;
            }
        });

        setStatusCounts(statusMap);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleViewChange = (viewName) => {
        setView(viewName);
    };

    const updateStartup = async (startup) => {
        try {
            const { $id, name, client, serviceType, financialYear, status, receivedDate, connectDate, stage } = startup;
            const updatedData = { name, client, serviceType, financialYear, status, receivedDate, connectDate, stage };
            
            await databases.updateDocument(DATABASE_ID, STARTUP_COLLECTION_ID, $id, updatedData);
            fetchStartups();
        } catch (error) {
            console.error('Error updating startup:', error);
        }
    };

    const updateKeyPerson = async (keyPerson) => {
        try {
            const { $id, salutation, firstName, lastName, phoneNumber, startup } = keyPerson;
            const updatedData = { salutation, firstName, lastName, phoneNumber, startup };
            
            await databases.updateDocument(DATABASE_ID, KEYPERSONS_COLLECTION_ID, $id, updatedData);
            fetchKeyPersons(); 
        } catch (error) {
            console.error('Error updating startup:', error);
        }
    };

    const updateFund = async (fund) => {
        try {
            const { $id, startupName, financialYear, fundType, amount, date } = fund;
            const updatedData = { startupName, financialYear, fundType, amount:parseInt(amount), date };
            
            await databases.updateDocument(DATABASE_ID, FUND_COLLECTION_ID, $id, updatedData);
            fetchFunds(); 
        } catch (error) {
            console.error('Error updating startup:', error);
        }
    };

    const addStartup = async (newStartupData) => {
        try {
            const uniqueId = uuidv4(); // Generate a unique ID
            await databases.createDocument(DATABASE_ID, STARTUP_COLLECTION_ID, uniqueId, newStartupData);
            fetchStartups();
            console.log('Startup added successfully:', newStartupData);
        } catch (error) {
            console.error('Error adding startup:', error);
            alert('Failed to add startup. Please try again.');
        }
    };

    const deleteStartup = async (startupId) => {
        try {
            await databases.deleteDocument(DATABASE_ID, STARTUP_COLLECTION_ID, startupId);
            setStartups(prev => prev.filter(startup => startup.$id !== startupId));
            console.log('Startup deleted successfully');
        } catch (error) {
            console.error('Error deleting startup:', error);
            alert('Failed to delete startup. Please try again.');
        }
    };

    const deleteKeyPerson = async (keyPersonId) => {
        try {
            await databases.deleteDocument(DATABASE_ID, KEYPERSONS_COLLECTION_ID, keyPersonId);
            setKeyPersons(prev => prev.filter(keyPerson => keyPerson.$id !== keyPersonId));
            console.log('Key Person deleted successfully');
        } catch (error) {
            console.error('Error deleting key person:', error);
            alert('Failed to delete key person. Please try again.');
        }
    };

    const deleteFund = async (fundId) => {
        try {
            await databases.deleteDocument(DATABASE_ID, FUND_COLLECTION_ID, fundId);
            setFunds(prevFunds => prevFunds.filter(fund => fund.$id !== fundId));
            console.log('Fund deleted successfully');
        } catch (error) {
            console.error('Error deleting fund:', error);
            alert('Failed to delete fund. Please try again.');
        }
    };
    

    
    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <ul>
                    <li className='top-profile'>
                        <svg stroke="currentColor" strokeWidth="2" width="20px" height="20px" viewBox="2 -2 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" strokeLinejoin="round" strokeLinecap="round"></path>
                        </svg>
                        {user?.name}
                    </li>
                    <li onClick={() => handleViewChange('dashboard')}>Dashboard</li>
                    <li onClick={() => handleViewChange('profile')}>Profile</li>
                    <li onClick={() => handleViewChange('startups')}>Startups</li>
                    <li onClick={() => handleViewChange('keyPersons')}>Key Persons</li>
                    <li onClick={() => handleViewChange('funds')}>Funds</li>
                </ul>
            </nav>
            <div className="dashboard-content">
                {view === 'dashboard' && (
                    <>
                        <div className="dashboard-top">
                            <div onClick={() => handleViewChange('startups')} className="dashboard-box">Startups: {startups.length}</div>
                            <div onClick={() => handleViewChange('keyPersons')} className="dashboard-box">Founders: {keyPersons.length}</div>
                        </div>
    
                        <div className="dashboard-charts">
                            <div className="pie-chart-container chart-container ">
                                <h3>Startups by Status</h3>
                                <Pie3DChart data={statusCounts} width={200} height={100} />
                            </div>
                            <div className="chart-container">
                                <h3>Startups by Fiscal Year</h3>
                                <VerticalBarChart data={startupCountsByYear} width="300px" height="300px"  />
                            </div>
                            <div className="chart-container speed">
                                <FundSpeedometers />
                            </div>
                        </div>
                    </>
                )}
                
                {view === 'profile' && <Profile />}

                {view === 'startups' && (
                    <StartupsTable
                        startups={startups}
                        startupSearch={startupSearch}
                        setStartupSearch={setStartupSearch}
                        handleNavigation={handleNavigation}
                        updateStartup={updateStartup}
                        addStartup={addStartup}
                        deleteStartup={deleteStartup}
                    />
                )}
                {view === 'keyPersons' && (
                    <KeyPersonsTable
                        keyPersons={keyPersons}
                        keyPersonSearch={keyPersonSearch}
                        setKeyPersonSearch={setKeyPersonSearch}
                        handleNavigation={handleNavigation}
                        updateKeyPerson={updateKeyPerson}
                        deleteKeyPerson={deleteKeyPerson}
                    />
                )}
                {view === 'funds' && (
                    <FundsTable
                        funds={funds}
                        fundSearch={fundSearch}
                        setFundSearch={setFundSearch}
                        handleNavigation={handleNavigation}
                        updateFund={updateFund}
                        deleteFund={deleteFund}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard;