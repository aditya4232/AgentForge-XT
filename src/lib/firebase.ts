import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    Auth,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is valid
const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
}

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Auth functions
export async function signInWithGoogle() {
    if (!auth) {
        return { user: null, error: new Error("Firebase is not configured. Please add your Firebase credentials to .env.local") };
    }
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error as Error };
    }
}

export async function signInWithGithub() {
    if (!auth) {
        return { user: null, error: new Error("Firebase is not configured. Please add your Firebase credentials to .env.local") };
    }
    try {
        const result = await signInWithPopup(auth, githubProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error as Error };
    }
}

export async function signOut() {
    if (!auth) {
        return { error: new Error("Firebase is not configured") };
    }
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
}

export { auth, onAuthStateChanged, isFirebaseConfigured };
export type { User };
