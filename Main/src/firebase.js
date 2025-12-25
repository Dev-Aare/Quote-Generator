import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM1qP86CutNuvR1FiGdDpEtYptKV9S0tk",
  authDomain: "career-guidancee.firebaseapp.com",
  projectId: "career-guidancee",
  storageBucket: "career-guidancee.firebasestorage.app",
  messagingSenderId: "323488394071",
  appId: "1:323488394071:web:b69d84d7fa8d65cd44ac12",
  measurementId: "G-DHZ075SLSP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);