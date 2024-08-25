import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook for using the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example of login function
  const login = (username, password) => {
    // Replace this with your actual login logic, such as an API call
    const fakeUser = { id: 1, name: 'John Doe', username: 'johndoe' };
    setUser(fakeUser);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  };

  // Example of logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Context value to be passed down to consuming components
  const value = {
    user,
    login,
    logout,
  };

  // Render the provider with the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
