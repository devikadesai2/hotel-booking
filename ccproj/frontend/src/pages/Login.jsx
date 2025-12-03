import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showRegisterHint, setShowRegisterHint] = useState(false)
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setShowRegisterHint(false)
    try {
      await login(email, password)
      nav('/')
    } catch (err) {
      // handle known error messages
      const serverMsg = err?.response?.data?.message || err.message || 'Login error'
      setErrorMsg(serverMsg)

      // If server says invalid credentials / user not found, offer register option
      if (/invalid credentials/i.test(serverMsg) || /user not found/i.test(serverMsg) || /no user/i.test(serverMsg)) {
        setShowRegisterHint(true)
      } else {
        // generic fallback: still offer register if the login failed (helps new users)
        setShowRegisterHint(true)
      }
    }
  }

  const goToRegister = () => {
    // pass email so register form pre-fills
    const query = email ? `?email=${encodeURIComponent(email)}` : ''
    nav('/register' + query)
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="w-full p-2 mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary w-full" type="submit">Login</button>
      </form>

      {errorMsg && <div className="mt-3 text-red-600">{errorMsg}</div>}

      {showRegisterHint ? (
        <div className="mt-4 p-3 bg-gray-50 rounded border">
          <div className="mb-2">No account found for that email or password is incorrect.</div>
          <div className="flex gap-2">
            <button onClick={goToRegister} className="btn btn-primary">Register with this email</button>
            <button onClick={() => { setShowRegisterHint(false); setErrorMsg('') }} className="btn">Dismiss</button>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm">
          Don't have an account? <button onClick={goToRegister} className="text-blue-700 underline">Register</button>
        </div>
      )}
    </div>
  )
}
