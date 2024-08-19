import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwriteConfig';

const ForgotPassword = () => {
    const emailRef = useRef(null);
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const email = emailRef.current.value;

        try {
            await account.createRecovery(email, 'http://localhost:5173/reset-password');
            setStatus('Password reset email sent successfully!');
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        ref={emailRef}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {status && <p className="status">{status}</p>}

                <div className="form-field-wrapper">
                    <button type="submit" className="button2" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Password Reset Email'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
