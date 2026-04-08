import { createContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // 🔥 store Firestore data
  const [loadingContext, setLoadingContext] = useState(true);

  // 🔥 Create user in Firestore (with role)
  const createUserDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        role: "user", // ✅ default role
        createdAt: serverTimestamp()
      };

      await setDoc(userRef, newUser);
      setUserData(newUser);
    } else {
      setUserData(userSnap.data());
    }
  };

  // 🔁 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await createUserDocument(currentUser);
      } else {
        setUserData(null);
      }

      setLoadingContext(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Email Login
  const loginWithEmail = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await createUserDocument(res.user);
    return res;
  };

  // 📝 Email Signup
  const signupWithEmail = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(res.user);
    return res;
  };

  // 🔵 Google Login
  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    await createUserDocument(res.user);
    return res;
  };

  // 🚪 Logout
  const logout = () => {
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,        // Firebase auth user
        userData,    // 🔥 Firestore user (with role)
        role: userData?.role, // ✅ easy access
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout
      }}
    >
      {!loadingContext && children}
    </AuthContext.Provider>
  );
};