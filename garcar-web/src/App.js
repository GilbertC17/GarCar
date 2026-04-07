import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import Catalogo from './Catalogo';
import Admin from './Admin';
import Login from './Login';
import Cotizacion from './Cotizacion';
import Contacto from './Contacto';

// IMPORTAMOS EL PROVIDER
import { CartProvider } from './CartContext'; 

function App() {
  return (
    <CartProvider> {/* <-- ENVUELVE TODO EL ROUTER */}
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/cotizacion" element={<Cotizacion />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/admin-garcar-exclusivo" element={<Admin />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;