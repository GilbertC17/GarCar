import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.auth) {
        // --- AQUÍ ESTÁ LA MAGIA DEL JWT ---
        localStorage.setItem('token', data.token); // GUARDAMOS LA LLAVE SECRETA
        localStorage.setItem('user_auth', 'true'); // Guardamos la sesión
        
        window.dispatchEvent(new Event('authChange'));
        navigate('/admin-garcar-exclusivo'); // Vamos al panel
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg border-0" style={{ width: '350px' }}>
        <div className="text-center mb-4">
          <img src="/assets/logo-garcar.png" alt="Logo" width="80" />
          <h4 className="fw-bold mt-2">Acceso Administrativo</h4>
        </div>
        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Usuario</label>
            <input 
              type="text" className="form-control" 
              onChange={(e) => setUsername(e.target.value)} required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Contraseña</label>
            <input 
              type="password" className="form-control" 
              onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="btn btn-danger w-100 fw-bold py-2 rounded-pill">
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;