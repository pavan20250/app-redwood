// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { account, OAuthProvider } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);
        try {
            let response = await account.createEmailSession(userInfo.email, userInfo.password);
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        await account.deleteSession('current');
        setUser(null);
        navigate('/login');
    };

    const registerUser = async (userInfo) => {
        setLoading(true);
        try {
            let response = await account.create(ID.unique(), userInfo.email, userInfo.password1, userInfo.name);
            console.log('Account creation response:', response);
            alert("Successful")
            navigate('/')

            //verification email
            //await account.createEmailSession(userInfo.email, userInfo.password1);
            //await account.createVerification('http://localhost:5173/verify');
            //alert('Verification email sent. Please check your email to verify your account.');
        } catch (error) {
            console.error('Error during registration:', error);
            alert(`Registration failed: ${error.message}`);
            throw new Error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const checkUserStatus = async () => {
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.log('User not logged in');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => {
        try {
            account.createOAuth2Session(
                OAuthProvider.Google,
                'http://localhost:5173/',
                'http://localhost:5173/login'
            );
            let accountDetails = account.get();
            setUser(accountDetails);
            navigate('/');
        } catch (error) {
            console.error('Error during Google login:', error);
            alert(`Google login failed: ${error.message}`);
        }
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);

export default AuthContext;
