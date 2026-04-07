import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; 

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('user_auth') === 'true');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const { carrito } = useCart();
  const totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(localStorage.getItem('user_auth') === 'true');
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const confirmarCerrarSesion = () => {
    localStorage.removeItem('user_auth');
    localStorage.removeItem('token');
    setIsAuth(false);
    setShowModal(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/'); 
  };

  const cerrarMenuMovil = () => {
    const menu = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');
    if (menu && menu.classList.contains('show')) {
      toggler.click();
    }
  };

  return (
    <>
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/" onClick={cerrarMenuMovil}>
            <img src="/assets/logo-garcar.png" alt="GarCar Logo" width="60" className="me-2" />
            <img src="/assets/logodistribuidora.png" alt="GarCar Texto" width="220" style={{ marginTop: '10px' }} />
          </NavLink>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center mb-3 mb-lg-0">
              
              <li className="nav-item">
                <NavLink to="/" onClick={cerrarMenuMovil} className={({ isActive }) => isActive ? "nav-link active fw-bold text-dark" : "nav-link"}>Inicio</NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#nosotros" onClick={cerrarMenuMovil}>Nosotros</a>
              </li>
              <li className="nav-item">
                <NavLink to="/catalogo" onClick={cerrarMenuMovil} className={({ isActive }) => isActive ? "nav-link active fw-bold text-dark" : "nav-link"}>Catálogo</NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#compra" onClick={cerrarMenuMovil}>Cómo Comprar</a>
              </li>
              <li className="nav-item">
                <NavLink to="/contacto" onClick={cerrarMenuMovil} className={({ isActive }) => isActive ? "nav-link active fw-bold text-dark" : "nav-link"}>Contacto</NavLink>
              </li>
              
              {/* --- CARRITO DE COTIZACIÓN HOMOLOGADO --- */}
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">
                <NavLink to="/cotizacion" onClick={cerrarMenuMovil} className="btn btn-light position-relative fw-bold text-dark border shadow-sm rounded-pill px-4 py-2 d-flex align-items-center justify-content-center w-100">
                  <i className="bi bi-cart3 me-2 fs-5"></i> Cotización
                  {totalArticulos > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                      {totalArticulos}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* --- ZONA CONDICIONAL DE ADMINISTRADOR HOMOLOGADA --- */}
              {isAuth ? (
                <>
                  <li className="nav-item ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">
                    <NavLink className="btn btn-warning px-4 py-2 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center w-100" to="/admin-garcar-exclusivo" onClick={cerrarMenuMovil}>
                      <i className="bi bi-speedometer2 me-2 fs-5"></i> Panel
                    </NavLink>
                  </li>
                  <li className="nav-item ms-lg-2 mt-3 mt-lg-0 w-100 w-lg-auto">
                    <button 
                      className="btn btn-outline-danger px-4 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center w-100" 
                      onClick={() => { cerrarMenuMovil(); setShowModal(true); }}
                    >
                      <i className="bi bi-box-arrow-right me-2 fs-5"></i> Salir
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item ms-lg-3 mt-3 mt-lg-0 w-100 w-lg-auto">
                  <NavLink className="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center w-100" to="/login" onClick={cerrarMenuMovil}>
                    <i className="bi bi-person-fill me-2 fs-5"></i> Acceso Personal
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>

      {/* MODAL DE CONFIRMACIÓN */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered mx-3 mx-sm-auto">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-exclamation-circle text-warning display-1 mb-3 d-block"></i>
                <h4 className="fw-bold text-dark mb-2">¿Cerrar sesión?</h4>
                <p className="text-secondary mb-0">Saldrás del panel de administración de GarCar.</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center pt-0 pb-4 gap-2">
                <button type="button" className="btn btn-light px-4 rounded-pill fw-bold w-100 w-sm-auto" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger px-4 rounded-pill fw-bold w-100 w-sm-auto" onClick={confirmarCerrarSesion}>
                  Sí, salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;