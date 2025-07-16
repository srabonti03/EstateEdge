import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const updateUser = (newUserData) => {
    if (!newUserData) {
      localStorage.removeItem("user");
      setCurrentUser(null);
      return;
    }

    setCurrentUser((prev) => {
      const updatedUser = {
        ...prev,
        ...newUserData,
        token: newUserData.token || prev?.token || null,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    console.log("AuthContext currentUser changed:", currentUser);
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
