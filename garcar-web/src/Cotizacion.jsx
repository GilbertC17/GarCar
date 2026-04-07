import React from 'react';
import { useCart } from './CartContext';
import { useNavigate, NavLink } from 'react-router-dom';

const Cotizacion = () => {
  // Importamos la nueva función restarDelCarrito
  const { carrito, agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const enviarWhatsApp = () => {
    const numero = "5212381325482"; 
    let mensaje = "Hola GarCar, me gustaría confirmar este pedido basado en los precios del día de hoy:\n\n";
    
    let totalEstimado = 0;
    let hayPreciosPendientes = false;

    carrito.forEach(item => {
      if (item.precio > 0) {
        const subtotal = item.cantidad * item.precio;
        totalEstimado += subtotal;
        mensaje += `▪️ ${item.cantidad} x *${item.nombre}* ($${item.precio} c/${item.unidad_medida}) = $${subtotal}\n`;
      } else {
        hayPreciosPendientes = true;
        mensaje += `▪️ ${item.cantidad} x *${item.nombre}* (Precio a consultar)\n`;
      }
    });

    mensaje += `\n*Total Estimado:* $${totalEstimado} MXN\n`;
    
    if (hayPreciosPendientes) {
      mensaje += `_(Nota: El total variará porque hay productos pendientes de precio)_\n`;
    }

    mensaje += "\n¿Me confirman este pedido y el tiempo de entrega? Quedo atento.";
    
    // encodeURIComponent formatea todo el texto perfectamente para URLs de WhatsApp
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center vh-100 d-flex flex-column justify-content-center">
        <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
        <h2 className="fw-bold text-dark">Tu lista está vacía</h2>
        <p className="text-secondary mb-4">Aún no has añadido productos para cotizar.</p>
        <NavLink to="/catalogo" className="btn btn-danger rounded-pill px-5 fw-bold shadow-sm">
          Ir al Catálogo
        </NavLink>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4 border-bottom pb-3">Mi Cotización</h2>

      <div className="row g-4">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">Producto</th>
                    <th className="text-center py-3">Cantidad</th>
                    <th className="text-end pe-4 py-3">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id_producto}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center">
                          <img src={item.imagen_url || '/assets/logo-garcar.png'} width="50" height="50" className="rounded-3 me-3 border shadow-sm" style={{objectFit: 'cover'}} />
                          <div>
                            <span className="fw-bold d-block text-dark">{item.nombre}</span>
                            <small className="text-muted">{item.unidad_medida}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className="btn-group border rounded-pill overflow-hidden shadow-sm" style={{height: '35px'}}>
                          {/* BOTÓN CONECTADO */}
                          <button className="btn btn-light btn-sm px-3 fw-bold text-danger border-end" onClick={() => restarDelCarrito(item.id_producto)}>-</button>
                          <span className="px-3 d-flex align-items-center fw-bold bg-white text-dark">{item.cantidad}</span>
                          {/* BOTÓN CONECTADO */}
                          <button className="btn btn-light btn-sm px-3 fw-bold text-success border-start" onClick={() => agregarAlCarrito(item)}>+</button>
                        </div>
                      </td>
                      <td className="text-end pe-4 py-3">
                        <button className="btn btn-outline-danger btn-sm border-0 rounded-circle" onClick={() => eliminarDelCarrito(item.id_producto)}>
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RESUMEN Y ENVÍO */}
        <div className="col-lg-4">
          {/* AQUÍ ESTÁ LA CORRECCIÓN DEL TOP: Cambiamos 100px a 150px y agregamos z-index */}
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '150px', zIndex: 1 }}>
            <h5 className="fw-bold mb-4 text-dark">Resumen de Pedido</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Productos distintos:</span>
              <span className="fw-bold text-dark">{carrito.length}</span>
            </div>
            <div className="d-flex justify-content-between mb-4 border-top pt-3">
              <span className="text-dark fw-bold fs-5">Total de bultos:</span>
              <span className="text-danger fw-bold fs-5">{carrito.reduce((t, i) => t + i.cantidad, 0)}</span>
            </div>
            
            <div className="alert alert-warning py-2 small border-0 mb-4 rounded-3 shadow-sm">
              <i className="bi bi-info-circle me-2"></i>
              Los precios finales se confirmarán vía WhatsApp según el mercado de hoy.
            </div>

            <button onClick={enviarWhatsApp} className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm mb-3 transition-all hover-scale">
              <i className="bi bi-whatsapp me-2 fs-5 align-middle"></i> Enviar Cotización
            </button>
            
            <button onClick={() => { if(window.confirm('¿Vaciar toda la lista?')) vaciarCarrito() }} className="btn btn-light text-danger w-100 py-2 rounded-pill fw-bold btn-sm border-0 transition-all hover-scale">
              Vaciar mi lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizacion;