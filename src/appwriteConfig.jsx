import { Client, Account, Databases, ID } from 'appwrite';

export const API_ENDPOINT = 'http://localhost/v1';
export const PROJECT_ID = '66842607000cf7353bee'; 
export const DATABASE_ID = '668bcb86001fd316a2d8';
export const STARTUP_COLLECTION_ID = '6691795f0003f16f538d';
export const FUND_COLLECTION_ID = '66917b75000bb655d532';
export const KEYPERSONS_COLLECTION_ID = '66917a9f000cafe0f84f';

const client = new Client()
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);

export const databases = new Databases(client);
export {ID};

export const OAuthProvider = {
    Google: 'google', 
};


export default client;
