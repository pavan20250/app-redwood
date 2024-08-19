import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { account } from '../appwriteConfig';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');
        const secret = params.get('secret');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await account.updateRecovery(userId, secret, password, confirmPassword);
            setStatus('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        ref={passwordRef}
                        required
                    />
                </div>

                <div className="form-field-wrapper">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        ref={confirmPasswordRef}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {status && <p className="status">{status}</p>}

                <div className="form-field-wrapper">
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
