import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { account } from '../appwriteConfig';

const Verify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');
            const secret = params.get('secret');

            try {
                await account.updateVerification(userId, secret);
                
                
                const session = await account.createMagicURLSession(userId, secret);
                
                setStatus('Email verified successfully! Redirecting to your profile...');
                setTimeout(() => navigate('/profile'), 3000);
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('Verification failed. Please try again.');
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div className="container">
            <h1>{status}</h1>
        </div>
    );
};

export default Verify;
