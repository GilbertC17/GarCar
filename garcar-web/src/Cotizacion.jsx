import React from 'react';
import { useCart } from './CartContext';
import { NavLink } from 'react-router-dom';

const Cotizacion = () => {
  const { carrito, agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad } = useCart();

  // --- 1. LÓGICA INTELIGENTE DE PRECIOS ---
  const obtenerPrecioUnitario = (item) => {
    const qty = parseInt(item.cantidad) || 0; 
    
    if (item.precio_mayoreo && item.precio_menudeo) {
      return qty >= 100 ? parseFloat(item.precio_mayoreo) : parseFloat(item.precio_menudeo);
    }
    return parseFloat(item.precio || 0);
  };

  const calcularSubtotal = (item) => {
    const qty = parseInt(item.cantidad) || 0;
    return obtenerPrecioUnitario(item) * qty;
  };

  // Sumatorias globales
  const totalEstimado = carrito.reduce((total, item) => total + calcularSubtotal(item), 0);
  const totalBultos = carrito.reduce((total, item) => total + (parseInt(item.cantidad) || 0), 0);

  // --- 2. GENERADOR DEL MENSAJE DE WHATSAPP ---
  const enviarWhatsApp = () => {
    const numero = "5212381325482"; 
    let mensaje = "Hola GarCar, me gustaría confirmar este pedido basado en los precios del día de hoy:\n\n";
    
    let hayPreciosPendientes = false;

    carrito.forEach(item => {
      const precioU = obtenerPrecioUnitario(item);
      const qty = parseInt(item.cantidad) || 0;
      
      if (qty === 0) return; 

      if (precioU > 0) {
        const subtotal = calcularSubtotal(item);
        const etiquetaMayoreo = (item.precio_mayoreo && qty >= 100) ? " *(Mayoreo)*" : "";
        
        mensaje += `▪️ ${qty} x *${item.nombre}*${etiquetaMayoreo} ($${precioU.toFixed(2)} c/${item.unidad_medida}) = $${subtotal.toFixed(2)}\n`;
      } else {
        hayPreciosPendientes = true;
        mensaje += `▪️ ${qty} x *${item.nombre}* (Precio a consultar)\n`;
      }
    });

    mensaje += `\n*Total Estimado:* $${totalEstimado.toFixed(2)} MXN\n`;
    
    if (hayPreciosPendientes || carrito.some(i => i.categoria.toLowerCase().includes('pollo'))) {
      mensaje += `_(Nota: El total variará porque hay productos pendientes de precio o el pollo se vende por peso exacto en báscula)_\n`;
    }

    mensaje += "\n¿Me confirman este pedido y el tiempo de entrega? Quedo atento.";
    
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer'); 
  };

  // --- 3. VISTA CUANDO ESTÁ VACÍO ---
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

  // --- 4. VISTA PRINCIPAL (CON PRODUCTOS) ---
  return (
    <div className="container py-5 min-vh-100">
      <h2 className="fw-bold mb-4 border-bottom pb-3">Mi Cotización</h2>

      <div className="row g-4">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ minWidth: '450px' }}>
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">Producto</th>
                    <th className="text-center py-3">Cantidad</th>
                    <th className="text-center py-3">Subtotal</th>
                    <th className="text-end pe-4 py-3">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => {
                    const precioU = obtenerPrecioUnitario(item);
                    const subtotal = calcularSubtotal(item);
                    const qty = parseInt(item.cantidad) || 0;
                    const aplicaMayoreo = item.precio_mayoreo && qty >= 100;

                    return (
                      <tr key={item.id_producto}>
                        <td className="ps-3 ps-md-4 py-3">
                          <div className="d-flex align-items-center">
                            <img src={item.imagen_url || '/assets/logo-garcar.png'} alt={item.nombre} width="50" height="50" className="rounded-3 me-3 border shadow-sm" style={{objectFit: 'cover'}} />
                            <div>
                              <span className="fw-bold d-block text-dark">{item.nombre}</span>
                              <div className="d-flex align-items-center flex-wrap gap-1 mt-1">
                                <small className="text-muted border bg-white rounded px-1">${precioU.toFixed(2)} c/u</small>
                                {aplicaMayoreo && (
                                  <small className="text-success fw-bold ms-1" style={{ fontSize: '0.7rem' }}>
                                    <i className="bi bi-tag-fill"></i> Mayoreo
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3">
                          {/* CORRECCIÓN MÓVIL: flex-nowrap y ancho ajustado */}
                          <div className="btn-group border rounded-pill overflow-hidden shadow-sm mx-auto d-flex flex-nowrap" style={{height: '35px', width: 'fit-content'}}>
                            <button className="btn btn-light btn-sm px-2 px-sm-3 fw-bold text-danger border-end" onClick={() => restarDelCarrito(item.id_producto)}>-</button>
                            
                            {/* CORRECCIÓN MÓVIL: minWidth obliga al navegador a no aplastar la caja */}
                            <input 
                              type="number" 
                              className="form-control border-0 text-center fw-bold text-dark px-0 bg-white shadow-none" 
                              value={item.cantidad} 
                              onChange={(e) => actualizarCantidad(item.id_producto, e.target.value)}
                              onBlur={(e) => {
                                if (item.cantidad === '' || item.cantidad < 1) {
                                  actualizarCantidad(item.id_producto, 1);
                                }
                              }}
                              style={{ appearance: 'textfield', MozAppearance: 'textfield', minWidth: '40px', maxWidth: '50px' }} 
                            />
                            
                            <button className="btn btn-light btn-sm px-2 px-sm-3 fw-bold text-success border-start" onClick={() => agregarAlCarrito(item)}>+</button>
                          </div>
                        </td>
                        <td className="text-center py-3">
                          <span className="fw-bold text-dark">${subtotal.toFixed(2)}</span>
                        </td>
                        <td className="text-end pe-3 pe-md-4 py-3">
                          <button className="btn btn-outline-danger btn-sm border-0 rounded-circle" onClick={() => eliminarDelCarrito(item.id_producto)}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RESUMEN Y ENVÍO */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '150px', zIndex: 1 }}>
            <h5 className="fw-bold mb-4 text-dark">Resumen de Pedido</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Productos distintos:</span>
              <span className="fw-bold text-dark">{carrito.length}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-3 border-top pt-3">
              <span className="text-dark fw-bold fs-5">Total de bultos:</span>
              <span className="text-danger fw-bold fs-5">{totalBultos}</span>
            </div>

            <div className="d-flex justify-content-between mb-4 align-items-end bg-light p-3 rounded-3 border">
              <span className="text-dark fw-bold fs-5 mb-1">Total Estimado:</span>
              <span className="text-success fw-bold fs-3 lh-1">${totalEstimado.toFixed(2)}</span>
            </div>
            
            <div className="alert alert-warning py-2 small border-0 mb-4 rounded-3 shadow-sm d-flex gap-2">
              <i className="bi bi-info-circle mt-1"></i>
              <span>Los precios finales se confirmarán vía WhatsApp según el mercado de hoy (y el pesaje en caso del pollo).</span>
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