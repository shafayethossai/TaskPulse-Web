import { createContext, useContext, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const res = await api.get('/users', { params: { email, password } });
    if (res.data.length !== 1) {
      throw new Error('Wrong email or password');
    }

    const foundUser = res.data[0];
    const fakeToken = 'fake-' + Date.now();

    localStorage.setItem('user', JSON.stringify(foundUser));
    localStorage.setItem('token', fakeToken);
    setUser(foundUser);
    setToken(fakeToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);