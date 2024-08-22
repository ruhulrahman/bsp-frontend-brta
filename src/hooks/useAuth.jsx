import { useState, useEffect, useContext, createContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    // Mock API call to authenticate the user
    const response = await fakeAuthApi(username, password);
    if (response.success) {
      setUser({ username: response.username });
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}

// Mock function to simulate an API call
const fakeAuthApi = (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, username });
    }, 1000);
  });
};
