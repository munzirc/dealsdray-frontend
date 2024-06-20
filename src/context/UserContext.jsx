import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    localStorage.getItem("username") || null
  );

  return (
    <UserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </UserContext.Provider>
  );
};
