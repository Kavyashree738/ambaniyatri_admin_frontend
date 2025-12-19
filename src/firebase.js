import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
   apiKey: 'AIzaSyDPdTJYGMEO2fcfyM9jzZ7DD5r7mh4xgXE',
  authDomain: "ambaniyatri.firebaseapp.com",
  projectId: 'ambaniyatri',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
