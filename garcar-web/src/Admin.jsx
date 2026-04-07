import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  // --- ESTADOS PRODUCTOS ---
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [seccion, setSeccion] = useState('menu'); 
  const [vistaProductos, setVistaProductos] = useState('lista'); 
  const [productoEditando, setProductoEditando] = useState(null); 
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [categoriaAdmin, setCategoriaAdmin] = useState('Todos');
  const [formularioProd, setFormularioProd] = useState({
    nombre: '', categoria: '', precio: '', unidad_medida: 'Caja', rango_peso: '', descripcion: ''
  });
  const [imagenProd, setImagenProd] = useState(null);

  // --- ESTADOS EDITAR HOME ---
  const [configHome, setConfigHome] = useState({
    hero_headline: '',
    hero_subheadline: '',
    hero_image_url: '' 
  });
  const [bannerFile, setBannerFile] = useState(null); 
  const [previewBanner, setPreviewBanner] = useState(null); 

  const navigate = useNavigate();

  // --- EFECTOS ---
  useEffect(() => {
    const auth = localStorage.getItem('user_auth');
    if (auth !== 'true') navigate('/login');
    else {
      cargarProductos();
      cargarConfiguracionHome();
    }
  }, [navigate]);

  const cargarProductos = () => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err));
  };

  const cargarConfiguracionHome = () => {
    fetch('http://localhost:3001/api/config')
      .then(res => res.json())
      .then(data => setConfigHome(data))
      .catch(err => console.error(err));
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  // ==========================================
  // FUNCIONES PROTEGIDAS (CON TOKEN JWT)
  // ==========================================

  const guardarPrecio = (id, nuevoPrecio) => {
    const token = localStorage.getItem('token'); // Recuperamos la llave

    fetch(`http://localhost:3001/api/productos/${id}`, { 
      method: 'PUT', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Mostramos la llave
      }, 
      body: JSON.stringify({ precio: nuevoPrecio }) 
    })
    .then(res => {
      if(!res.ok) throw new Error('No autorizado');
      return res.json();
    })
    .then(() => mostrarMensaje('Precio actualizado ✅', 'success'))
    .catch(() => mostrarMensaje('Error de autorización o servidor ❌', 'danger'));
  };

  const manejarCambioInputProd = (id, valor) => { 
    setProductos(productos.map(p => p.id_producto === id ? { ...p, precio: valor } : p)); 
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    const token = localStorage.getItem('token'); // Recuperamos la llave
    try { 
      const response = await fetch(`http://localhost:3001/api/productos/${id}/estado`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Mostramos la llave
        }, 
        body: JSON.stringify({ estado: nuevoEstado }) 
      });
      if (!response.ok) throw new Error('No autorizado');
      
      cargarProductos(); 
      mostrarMensaje(`Producto marcado como ${nuevoEstado}`, 'warning'); 
    }
    catch (error) { mostrarMensaje('Acceso denegado o error de red ❌', 'danger'); }
  };

  const abrirFormularioNuevoProd = () => { setFormularioProd({ nombre: '', categoria: '', precio: '', unidad_medida: 'Caja', rango_peso: '', descripcion: '' }); setProductoEditando(null); setImagenProd(null); setVistaProductos('formulario'); };
  const abrirFormularioEdicionProd = (prod) => { setFormularioProd({ nombre: prod.nombre, categoria: prod.categoria, precio: prod.precio, unidad_medida: prod.unidad_medida, rango_peso: prod.rango_peso || '', descripcion: prod.descripcion || '' }); setProductoEditando(prod.id_producto); setImagenProd(null); setVistaProductos('formulario'); };
  
  const handleGuardarProducto = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token'); // Recuperamos la llave

    const formData = new FormData(); 
    Object.keys(formularioProd).forEach(key => formData.append(key, formularioProd[key])); 
    if (imagenProd) formData.append('imagen', imagenProd); 
    
    const url = productoEditando ? `http://localhost:3001/api/productos/${productoEditando}/editar` : 'http://localhost:3001/api/productos';
    
    try { 
      const response = await fetch(url, { 
        method: productoEditando ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Mostramos la llave (no ponemos Content-Type porque es FormData)
        },
        body: formData 
      }); 
      if (response.ok) { 
        mostrarMensaje(productoEditando ? 'Actualizado ✅' : 'Añadido ✅', 'success'); 
        cargarProductos(); 
        setVistaProductos('lista'); 
      } else {
        throw new Error('No autorizado');
      }
    }
    catch (error) { mostrarMensaje('Acceso denegado o error de servidor ❌', 'danger'); }
  };

  const manejarCambioBanner = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewBanner(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarHome = async (e) => {
    e.preventDefault();
    mostrarMensaje('Guardando cambios del Home...', 'warning');
    const token = localStorage.getItem('token'); // Recuperamos la llave

    const formData = new FormData();
    formData.append('hero_headline', configHome.hero_headline);
    formData.append('hero_subheadline', configHome.hero_subheadline);
    if (bannerFile) formData.append('banner', bannerFile);

    try {
      const response = await fetch('http://localhost:3001/api/config/home', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Mostramos la llave
        },
        body: formData 
      });

      if (response.ok) {
        mostrarMensaje('¡Sección de Inicio actualizada correctamente! ✅', 'success');
        setBannerFile(null); 
        setPreviewBanner(null); 
        cargarConfiguracionHome(); 
        setTimeout(() => setSeccion('menu'), 2000); 
      } else {
        throw new Error('No autorizado');
      }
    } catch (error) {
      mostrarMensaje('Acceso denegado al guardar cambios ❌', 'danger');
    }
  };

  const productosFiltrados = productos.filter(p => (categoriaAdmin === 'Todos' || p.categoria === categoriaAdmin) && p.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()));

  // ==========================================
  // RENDER DE LA INTERFAZ
  // ==========================================
  return (
    <div className="container py-5 min-vh-100">
      
      {/* CABECERA DINÁMICA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold mb-0 text-dark">
            {seccion === 'menu' ? 'Panel de Control: GarCar' : 
             seccion === 'productos' ? 'Gestión de Inventario' : 
             'Configuración de la Pantalla de Inicio'}
          </h2>
          {seccion !== 'menu' && (
            <button className="btn btn-link text-danger p-0 fw-bold text-decoration-none mt-2" 
              onClick={() => { setSeccion('menu'); setVistaProductos('lista'); setMensaje({texto:'', tipo:''}); setPreviewBanner(null); setBannerFile(null);}}>
              <i className="bi bi-arrow-left me-1"></i> Volver al menú
            </button>
          )}
        </div>
      </div>

      {mensaje.texto && <div className={`alert alert-${mensaje.tipo} shadow-sm py-2 mb-4 animate__animated animate__fadeIn`}>{mensaje.texto}</div>}

      {/* MENÚ PRINCIPAL */}
      {seccion === 'menu' && (
        <div className="row g-4 mt-2 justify-content-center">
          <div className="col-12 col-md-5">
            <button onClick={() => setSeccion('productos')} className="btn btn-danger w-100 shadow-sm d-flex flex-column align-items-center justify-content-center rounded-4 border-0 transition-all hover-scale" style={{ height: '200px' }}>
              <i className="bi bi-box-seam-fill display-4 mb-3"></i>
              <span className="fw-bold fs-5">Gestión de Productos</span>
            </button>
          </div>
          <div className="col-12 col-md-5">
            <button onClick={() => setSeccion('home')} className="btn btn-danger w-100 shadow-sm d-flex flex-column align-items-center justify-content-center rounded-4 border-0 transition-all hover-scale" style={{ height: '200px' }}>
              <i className="bi bi-images display-4 mb-3"></i>
              <span className="fw-bold fs-5">Editar Inicio (Banner)</span>
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN: GESTIÓN PRODUCTOS */}
      {seccion === 'productos' && vistaProductos === 'lista' && (
         <div className="animate__animated animate__fadeIn">
          {/* BARRA HERRAMIENTAS */}
          <div className="row mb-4 align-items-center g-3 bg-white p-3 rounded-4 shadow-sm mx-0">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control bg-light border-start-0" placeholder="Buscar..." value={busquedaAdmin} onChange={(e) => setBusquedaAdmin(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select bg-light" value={categoriaAdmin} onChange={(e) => setCategoriaAdmin(e.target.value)}>
                <option value="Todos">Todas las categorías</option>
                <option value="Pollo">Pollo</option><option value="Huevo">Huevo</option><option value="Huevo Especial">Huevo Especial</option><option value="Huevo Económico">Huevo Económico</option>
              </select>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <button className="btn btn-success rounded-pill fw-bold px-4 shadow-sm w-100 w-md-auto" onClick={abrirFormularioNuevoProd}>
                <i className="bi bi-plus-circle me-2"></i> Nuevo Producto
              </button>
            </div>
          </div>

          {/* VISTA MÓVIL (TARJETAS) */}
          <div className="d-block d-lg-none">
            {productosFiltrados.map(p => (
                <div key={p.id_producto} className={`card mb-3 border-0 shadow-sm rounded-4 ${p.estado === 'Inactivo' ? 'bg-light opacity-75' : ''}`}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-3">
                        <img src={p.imagen_url || '/assets/logo-garcar.png'} width="50" height="50" className="rounded-circle me-3 border" style={{ objectFit: 'cover' }} />
                        <div><span className="fw-bold d-block text-dark lh-sm">{p.nombre}</span><div className="mt-1 d-flex gap-2"><span className="badge bg-light text-secondary border">{p.categoria}</span><span className={`badge ${p.estado === 'Activo' ? 'bg-success' : p.estado === 'Agotado' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{p.estado || 'Activo'}</span></div></div>
                    </div>
                    <div className="d-flex flex-column gap-2 border-top pt-3">
                      <div className="d-flex gap-2"><div className="input-group input-group-sm flex-grow-1"><span className="input-group-text bg-light border-end-0">$</span><input type="number" className="form-control fw-bold text-danger text-center" value={p.precio} onChange={(e) => manejarCambioInputProd(p.id_producto, e.target.value)} disabled={p.estado === 'Inactivo'}/></div><button className="btn btn-primary btn-sm px-3 shadow-sm" onClick={() => guardarPrecio(p.id_producto, p.precio)} disabled={p.estado === 'Inactivo'}><i className="bi bi-check-lg me-1"></i> Guardar</button></div>
                      <div className="d-flex justify-content-end gap-1 mt-1"><button className="btn btn-outline-primary btn-sm rounded-pill flex-fill" onClick={() => abrirFormularioEdicionProd(p)}><i className="bi bi-pencil-square"></i> Editar</button>{p.estado !== 'Inactivo' && (<button className={`btn btn-outline-${p.estado === 'Activo' ? 'warning' : 'success'} btn-sm rounded-pill flex-fill`} onClick={() => cambiarEstado(p.id_producto, p.estado === 'Activo' ? 'Agotado' : 'Activo')}><i className={`bi ${p.estado === 'Activo' ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i> {p.estado === 'Activo' ? 'Agotar' : 'Activar'}</button>)}{p.estado !== 'Inactivo' ? (<button className="btn btn-outline-danger btn-sm rounded-pill flex-fill" onClick={() => {if(window.confirm('¿Ocultar?')) cambiarEstado(p.id_producto, 'Inactivo')}}><i className="bi bi-trash3-fill"></i> Baja</button>) : (<button className="btn btn-outline-success btn-sm rounded-pill flex-fill" onClick={() => cambiarEstado(p.id_producto, 'Activo')}><i className="bi bi-arrow-counterclockwise"></i> Restaurar</button>)}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* VISTA ESCRITORIO (TABLA) */}
          <div className="d-none d-lg-block card border-0 shadow-sm rounded-4 overflow-hidden"><table className="table table-hover align-middle mb-0 bg-white"><thead className="bg-dark text-white"><tr><th className="py-3 ps-4">Producto</th><th className="py-3" style={{ width: '180px' }}>Precio Rápido</th><th className="py-3 text-center">Estado</th><th className="py-3 text-end pe-4">Acciones</th></tr></thead><tbody>{productosFiltrados.map(p => (<tr key={p.id_producto} className={p.estado === 'Inactivo' ? 'table-light text-muted' : ''}><td className="ps-4"><div className="d-flex align-items-center"><img src={p.imagen_url || '/assets/logo-garcar.png'} width="50" height="50" className={`rounded-circle me-3 shadow-sm border ${p.estado === 'Inactivo' && 'opacity-50'}`} style={{ objectFit: 'cover' }} /><div><span className="fw-bold d-block text-dark">{p.nombre}</span><span className="badge bg-light text-secondary border px-2 py-0 mt-1">{p.categoria}</span></div></div></td><td><div className="input-group input-group-sm mb-1"><span className="input-group-text bg-light border-end-0">$</span><input type="number" className="form-control border-start-0 fw-bold text-danger" value={p.precio} onChange={(e) => manejarCambioInputProd(p.id_producto, e.target.value)} disabled={p.estado === 'Inactivo'}/></div><button className="btn btn-primary btn-sm w-100 fw-bold shadow-sm" style={{ fontSize: '0.7rem' }} onClick={() => guardarPrecio(p.id_producto, p.precio)} disabled={p.estado === 'Inactivo'}><i className="bi bi-check2-circle me-1"></i> Actualizar</button></td><td className="text-center"><span className={`badge border px-3 py-2 rounded-pill ${p.estado === 'Activo' ? 'bg-success' : p.estado === 'Agotado' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{p.estado || 'Activo'}</span></td><td className="text-end pe-4"><div className="btn-group shadow-sm"><button className="btn btn-light btn-sm text-primary border" title="Editar" onClick={() => abrirFormularioEdicionProd(p)}><i className="bi bi-pencil-square"></i></button>{p.estado !== 'Inactivo' && (<button className={`btn btn-light btn-sm border ${p.estado === 'Activo' ? 'text-warning' : 'text-success'}`} title={p.estado === 'Activo' ? 'Marcar Agotado' : 'Marcar Activo'} onClick={() => cambiarEstado(p.id_producto, p.estado === 'Activo' ? 'Agotado' : 'Activo')}><i className={`bi ${p.estado === 'Activo' ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i></button>)}{p.estado !== 'Inactivo' ? (<button className="btn btn-light btn-sm text-danger border" title="Dar de baja" onClick={() => {if(window.confirm('¿Ocultar?')) cambiarEstado(p.id_producto, 'Inactivo')}}><i className="bi bi-trash3-fill"></i></button>) : (<button className="btn btn-light btn-sm text-success border" title="Restaurar" onClick={() => cambiarEstado(p.id_producto, 'Activo')}><i className="bi bi-arrow-counterclockwise"></i></button>)}</div></td></tr>))}</tbody></table></div>
        </div>
      )}

      {/* SECCIÓN PRODUCTOS: FORMULARIO */}
      {seccion === 'productos' && vistaProductos === 'formulario' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 animate__animated animate__fadeIn"><div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"><h4 className="fw-bold text-dark mb-0">{productoEditando ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h4><button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setVistaProductos('lista')}>Cancelar</button></div><form className="row g-4" onSubmit={handleGuardarProducto}><div className="col-md-6"><label className="form-label fw-bold text-dark">Nombre del Producto</label><input type="text" className="form-control bg-light border-0 shadow-sm" required value={formularioProd.nombre} onChange={e => setFormularioProd({...formularioProd, nombre: e.target.value})} /></div><div className="col-md-6"><label className="form-label fw-bold text-dark">Categoría</label><select className="form-select bg-light border-0 shadow-sm" required value={formularioProd.categoria} onChange={e => setFormularioProd({...formularioProd, categoria: e.target.value})}><option value="">Selecciona...</option><option value="Huevo">Huevo</option><option value="Pollo">Pollo</option><option value="Huevo Especial">Huevo Especial</option><option value="Huevo Económico">Huevo Económico</option></select></div><div className="col-md-4"><label className="form-label fw-bold text-dark">Precio Base ($)</label><input type="number" className="form-control bg-light border-0 shadow-sm" required value={formularioProd.precio} onChange={e => setFormularioProd({...formularioProd, precio: e.target.value})} /></div><div className="col-md-4"><label className="form-label fw-bold text-dark">Unidad de Medida</label><select className="form-select bg-light border-0 shadow-sm" value={formularioProd.unidad_medida} onChange={e => setFormularioProd({...formularioProd, unidad_medida: e.target.value})}><option value="Caja">Caja (360 pzas)</option><option value="Pieza/Kg">Pieza / Kg</option><option value="Cono">Cono (30 pzas)</option></select></div><div className="col-md-4"><label className="form-label fw-bold text-dark">Rango de Peso</label><input type="text" className="form-control bg-light border-0 shadow-sm" value={formularioProd.rango_peso} onChange={e => setFormularioProd({...formularioProd, rango_peso: e.target.value})} /></div><div className="col-12"><label className="form-label fw-bold text-dark">Imagen {productoEditando && '(Opcional)'}</label><input type="file" className="form-control bg-light border-0 shadow-sm" accept="image/*" onChange={e => setImagenProd(e.target.files[0])} required={!productoEditando} /></div><div className="col-12"><label className="form-label fw-bold text-dark">Descripción</label><textarea className="form-control bg-light border-0 shadow-sm" rows="2" value={formularioProd.descripcion} onChange={e => setFormularioProd({...formularioProd, descripcion: e.target.value})} /></div><div className="col-12 text-end mt-4 pt-3 border-top"><button type="submit" className="btn btn-danger px-5 py-2 fw-bold rounded-pill shadow-sm"><i className="bi bi-save2-fill me-2"></i> {productoEditando ? 'Guardar Cambios' : 'Añadir Producto'}</button></div></form></div>
      )}


      {/* ==========================================
          SECCIÓN: EDITAR HOME
          ========================================== */}
      {seccion === 'home' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 animate__animated animate__fadeIn">
          <form className="row g-4" onSubmit={handleGuardarHome}>
            
            <div className="col-12">
              <label className="form-label fw-bold text-dark">Título Principal (Headline)</label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0 shadow-sm fw-bold text-danger" 
                required 
                value={configHome.hero_headline} 
                onChange={e => setConfigHome({...configHome, hero_headline: e.target.value})} 
              />
            </div>
            
            <div className="col-12">
              <label className="form-label fw-bold text-dark">Subtítulo Descriptivo</label>
              <textarea 
                className="form-control bg-light border-0 shadow-sm text-secondary" 
                rows="3" 
                required
                value={configHome.hero_subheadline} 
                onChange={e => setConfigHome({...configHome, hero_subheadline: e.target.value})}
              />
            </div>

            <hr className="my-4 text-muted" />

            <div className="col-md-6">
              <label className="form-label fw-bold text-dark">Nuevo Imagen de Banner (Fondo)</label>
              <input 
                type="file" 
                className="form-control bg-light border-0 shadow-sm" 
                accept="image/*" 
                onChange={manejarCambioBanner} 
              />
              <div className="form-text mt-2"><i className="bi bi-info-circle me-1"></i>Se recomienda usar una imagen horizontal de alta calidad (ej: 1920x1080px).</div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-muted small text-uppercase">Previsualización del Banner</label>
              <div className="rounded-4 overflow-hidden shadow border" style={{ height: '180px', position: 'relative' }}>
                <img 
                  src={previewBanner || configHome.hero_image_url || '/assets/logo-garcar.png'} 
                  alt="Previsualización Hero" 
                  className="w-100 h-100" 
                  style={{ objectFit: 'cover' }} 
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                <div className="position-absolute top-50 start-50 translate-middle text-center w-75">
                    <span className="fw-bold text-white small d-block lh-sm">{configHome.hero_headline}</span>
                    <span className="text-white-50" style={{fontSize:'0.5rem'}}>{configHome.hero_subheadline.substring(0, 50)}...</span>
                </div>
              </div>
            </div>

            <div className="col-12 text-end mt-5 pt-3 border-top">
              <button type="submit" className="btn btn-danger px-5 py-3 fw-bold rounded-pill shadow-sm transition-all hover-scale">
                <i className="bi bi-cloud-arrow-up-fill me-2 fs-5 align-middle"></i> Actualizar Sección de Inicio
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Admin;