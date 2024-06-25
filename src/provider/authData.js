import React, { createContext, useState } from "react";

const AuthInfo = createContext({});

export const AuthProvider = ({ children }) => {
    const [data, setData] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)
    
    return (
        <AuthInfo.Provider value={{ data, setData, persist, setPersist }}>
            {children}
        </AuthInfo.Provider>
    );
};

export default AuthInfo;