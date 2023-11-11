// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();
const authInstance = auth;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  const signup = (email, password) => createUserWithEmailAndPassword(authInstance, email, password);
  const login = (email, password) => signInWithEmailAndPassword(authInstance, email, password);
  const logout = () => auth.signOut();
  const resetPassword = (email) => sendPasswordResetEmail(authInstance, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  });

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

