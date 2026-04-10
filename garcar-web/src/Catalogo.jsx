import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const Catalogo = () => {
  // --- ESTADOS ---
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  const { agregarAlCarrito } = useCart();

  // --- OBTENCIÓN DE DATOS ---
useEffect(() => {
    fetch('https://garcar-api.onrender.com/api/productos')
      .then(res => {
          if (!res.ok) throw new Error('El servidor reportó un problema');
          return res.json();
      })
      .then(data => {
          // Verificamos estrictamente que la base de datos nos mandó una lista (Array)
          if (Array.isArray(data)) {
              setProductos(data); // Si todo está bien, guardamos los productos
          } else {
              setProductos([]); // Si mandó basura o un error, guardamos una lista vacía
          }
      })
      .catch(err => {
          console.error("Error al cargar los productos:", err);
          setProductos([]); // Si se cae el internet o el servidor, no explotamos, solo listamos vacío
      });
  }, []);
  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter(p => {
    if (p.estado === 'Inactivo') return false;
    const coincideCategoria = categoriaSeleccionada === 'Todos' || 
                               p.categoria.toLowerCase().includes(categoriaSeleccionada.toLowerCase());
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideNombre;
  });

  const categorias = ['Todos', 'Pollo', 'Huevo'];

  // --- LÓGICA INTELIGENTE DE PRECIOS (NUEVO) ---
  const renderDesglosePrecios = (p) => {
    if (!p.precio || p.precio <= 0) return null; // Si no hay precio, no mostramos cálculo

    const esHuevo = p.categoria.toLowerCase().includes('huevo');
    const esPollo = p.categoria.toLowerCase().includes('pollo');

    // 1. CÁLCULOS PARA HUEVO
    if (esHuevo) {
      let precioCaja, precioCono;
      if (p.unidad_medida === 'Caja') {
        precioCaja = parseFloat(p.precio);
        precioCono = precioCaja / 12; // 1 Caja = 12 Conos
      } else if (p.unidad_medida === 'Cono') {
        precioCono = parseFloat(p.precio);
        precioCaja = precioCono * 12;
      } else {
        return null;
      }

      return (
        <div className={`d-flex justify-content-between p-2 rounded-3 mt-3 mb-3 border border-2 ${p.estado === 'Agotado' ? 'bg-light border-secondary opacity-50' : 'bg-white border-warning'}`}>
          <div className="text-center w-50 border-end">
            <small className="d-block text-muted fw-bold" style={{fontSize: '0.6rem'}}>POR CAJA (360 pz)</small>
            <span className="fw-bold text-dark">${precioCaja.toFixed(2)}</span>
          </div>
          <div className="text-center w-50">
            <small className="d-block text-muted fw-bold" style={{fontSize: '0.6rem'}}>POR CONO (30 pz)</small>
            <span className="fw-bold text-dark">${precioCono.toFixed(2)}</span>
          </div>
        </div>
      );
    }

    // 2. CÁLCULOS PARA POLLO
    if (esPollo) {
      let pesoPromedio = 3.2; // Peso por defecto si no escribes nada
      
      // Si escribiste "3.000 kg - 3.400 kg", extraemos los números para sacar el promedio exacto
      if (p.rango_peso) {
        const numeros = p.rango_peso.match(/[\d.]+/g); // Busca números en el texto
        if (numeros && numeros.length >= 2) {
          pesoPromedio = (parseFloat(numeros[0]) + parseFloat(numeros[1])) / 2;
        } else if (numeros && numeros.length === 1) {
          pesoPromedio = parseFloat(numeros[0]);
        }
      }

      let precioPieza, precioKg;
      // Heurística: Si el precio es mayor a 50 pesos, asumimos que lo diste por Pieza. Si es menor, por Kilo.
      if (p.precio > 50 || p.unidad_medida === 'Pieza') {
        precioPieza = parseFloat(p.precio);
        precioKg = precioPieza / pesoPromedio;
      } else {
        precioKg = parseFloat(p.precio);
        precioPieza = precioKg * pesoPromedio;
      }

      return (
        <>
          <div className={`d-flex justify-content-between p-2 rounded-3 mt-3 border border-2 ${p.estado === 'Agotado' ? 'bg-light border-secondary opacity-50' : 'bg-white border-danger'}`}>
            <div className="text-center w-50 border-end">
              <small className="d-block text-muted fw-bold" style={{fontSize: '0.6rem'}}>POR PIEZA</small>
              <span className="fw-bold text-dark">${precioPieza.toFixed(2)}</span>
            </div>
            <div className="text-center w-50">
              <small className="d-block text-muted fw-bold" style={{fontSize: '0.6rem'}}>POR KILO (Aprox)</small>
              <span className="fw-bold text-dark">${precioKg.toFixed(2)}</span>
            </div>
          </div>
          {p.rango_peso && (
            <small className="text-muted d-block text-center mt-1 mb-3 fst-italic" style={{fontSize: '0.65rem'}}>
              *Basado en peso promedio de {p.rango_peso}
            </small>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* 1. CABECERA DEL CATÁLOGO */}
      <div className="bg-dark text-white py-5 text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-2">Catálogo de Productos</h1>
          <p className="lead text-warning mb-0">Precios actualizados diariamente para tu negocio.</p>
        </div>
      </div>

      {/* 2. BARRA DE BÚSQUEDA */}
      <section className="container mt-n4">
        <div className="card shadow-sm border-0 p-4 rounded-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group border rounded-pill overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-3">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" className="form-control border-0 shadow-none" 
                  placeholder="¿Buscas algo específico? (ej: Doble yema)" 
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-2 flex-wrap">
                {categorias.map(cat => (
                  <button key={cat} onClick={() => setCategoriaSeleccionada(cat)}
                    className={`btn btn-sm px-4 rounded-pill fw-bold transition-all ${categoriaSeleccionada === cat ? 'btn-danger shadow' : 'btn-outline-secondary'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LISTADO DE PRODUCTOS */}
      <main className="container py-5 flex-grow-1">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-3 text-muted">Actualizando inventario...</p>
          </div>
        ) : (
          <div className="row g-4">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div className="col-12 col-sm-6 col-lg-3" key={producto.id_producto}>
                  <div className={`card h-100 border-0 shadow-hover rounded-4 overflow-hidden transition-all bg-white border-bottom border-4 ${producto.estado === 'Agotado' ? 'border-secondary' : 'border-transparent hover-border-danger'}`}>
                    
                    {/* IMAGEN Y ETIQUETAS */}
                    <div style={{ height: '220px', position: 'relative' }}>
                      <img src={producto.imagen_url || '/assets/logo-garcar.png'} alt={producto.nombre} 
                        className={`w-100 h-100 ${producto.estado === 'Agotado' ? 'opacity-50' : ''}`} style={{ objectFit: 'cover' }} />
                      
                      {producto.estado === 'Agotado' && (
                        <span className="badge bg-dark position-absolute top-50 start-50 translate-middle py-2 px-4 shadow rounded-pill fs-6" style={{ letterSpacing: '2px' }}>
                          AGOTADO
                        </span>
                      )}
                    </div>

                    {/* CONTENIDO DE LA TARJETA */}
                    <div className="card-body d-flex flex-column p-4">
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-muted border text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>
                          {producto.categoria}
                        </span>
                        <small className={producto.estado === 'Agotado' ? 'text-muted fw-bold' : 'text-success fw-bold'} style={{ fontSize: '0.7rem' }}>
                          {producto.estado === 'Agotado' ? <><i className="bi bi-dash-circle-fill me-1"></i> Sin stock</> : <><i className="bi bi-check-circle-fill me-1"></i> Disponible</>}
                        </small>
                      </div>
                      
                      <h5 className={`card-title fw-bold mb-1 ${producto.estado === 'Agotado' ? 'text-muted' : 'text-dark'}`}>
                        {producto.nombre}
                      </h5>

                      <p className="card-text text-secondary small mb-0 flex-grow-1">
                        {producto.descripcion}
                      </p>

                      {/* --- AQUÍ SE INYECTA EL CÁLCULO DE PRECIOS AUTOMÁTICO --- */}
                      {renderDesglosePrecios(producto)}

                      {/* BOTÓN AÑADIR (Manteniéndolo al fondo siempre alineado) */}
                      <div className={!producto.rango_peso || !producto.categoria.toLowerCase().includes('pollo') ? 'mt-auto' : ''}>
                        {producto.estado === 'Agotado' ? (
                          <button className="btn btn-secondary w-100 fw-bold py-2 shadow-sm rounded-pill" disabled>
                            <i className="bi bi-x-circle me-2"></i> Agotado
                          </button>
                        ) : (
                          <button className="btn btn-success w-100 fw-bold py-2 shadow-sm rounded-pill" onClick={() => agregarAlCarrito(producto)}>
                            <i className="bi bi-cart-plus me-2"></i> Añadir a Cotización
                          </button>
                        )}
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="display-1 text-muted opacity-25 mb-3">🥚</div>
                <h3 className="text-secondary fw-bold">Sin resultados</h3>
                <p className="text-muted">No encontramos "{busqueda}" en la categoría {categoriaSeleccionada}.</p>
                <button className="btn btn-link text-danger fw-bold" onClick={() => {setBusqueda(''); setCategoriaSeleccionada('Todos');}}>
                  Mostrar todos los productos
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="bg-white border-top py-3 text-center">
        <div className="container">
          <p className="text-muted mb-0 small fst-italic">
            Nota: Debido a la naturaleza del mercado, los precios pueden variar sin previo aviso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;