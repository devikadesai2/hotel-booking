import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useContext(AuthContext)
  const nav = useNavigate()
  const query = useQuery()

  useEffect(() => {
    const prefill = query.get('email')
    if (prefill) setEmail(prefill)
  }, [query])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      nav('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Register error')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <input className="w-full p-2 mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input className="w-full p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="w-full p-2 mb-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="btn btn-primary" type="submit">Register</button>
    </form>
  )
}
