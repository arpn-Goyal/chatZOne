// src/context/UserContext.js
import { createContext, useContext, useEffect, useState,useMemo } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useMemo(() => !!user, [user]); // ✅ now reactive
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        console.log(`UserContext -> useEffect  ${res.data.id}`)
  
        setUser(res.data); // ✅ SET THE USER
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setUser(null);
        } else {
          console.error("Error fetching user:", err);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  return (
    <UserContext.Provider value={{ user,setUser,isAuthenticated,loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
