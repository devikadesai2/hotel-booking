import React, { createContext, useState, useEffect } from 'react';
import api from '../api/client';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('user')) }catch{return null} });
  useEffect(()=>{ if(user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user'); },[user]);
  const login = async (email,password)=>{ const res = await api.post('/auth/login',{email,password}); localStorage.setItem('token', res.data.token); setUser(res.data.user); return res.data; };
  const register = async (name,email,password)=>{ const res = await api.post('/auth/register',{name,email,password}); localStorage.setItem('token', res.data.token); setUser(res.data.user); return res.data; };
  const logout = ()=>{ localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{user,login,register,logout}}>{children}</AuthContext.Provider>
}
