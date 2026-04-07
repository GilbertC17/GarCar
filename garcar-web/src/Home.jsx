import React, { useState, useEffect } from 'react';

const Home = () => {
  // --- 1. ESTADO PARA CARGAR LA CONFIGURACIÓN DEL BANNER ---
  const [config, setConfig] = useState({
    hero_headline: 'Frescura, Calidad y Mejor Precio',
    hero_subheadline: 'Abastecemos tu negocio con pollo vivo de alto rendimiento y huevo fresco seleccionado. ¡Garantizamos el mejor costo del mercado!',
    hero_image_url: '' // Usará el de por defecto si está vacío
  });

  // --- 2. EFECTO PARA LEER DE LA BASE DE DATOS AL CARGAR ---
  useEffect(() => {
    fetch('http://localhost:3001/api/config')
      .then(res => res.json())
      .then(data => {
        // Si la base de datos nos devuelve datos, actualizamos el estado
        if (data && data.hero_headline) {
          setConfig(data);
        }
      })
      .catch(err => {
        console.error("Error cargando la configuración del Home", err);
      });
  }, []);

  // Estilo de fondo para el banner principal (Hero) DINÁMICO
  const heroStyle = {
    // Aquí inyectamos la imagen de la base de datos, si no hay, usa pollopesado.jpg
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('${config.hero_image_url || '/assets/pollopesado.jpg'}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // Efecto Parallax (el fondo se queda quieto al hacer scroll)
    color: 'white',
    padding: '150px 0'
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ backgroundColor: '#fcfcfc' }}>


      <main className="flex-grow-1">

        {/* --- 2. BANNER PRINCIPAL (HERO) CON IMAGEN DE FONDO --- */}
        <section style={heroStyle} className="text-center">
          <div className="container py-5">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold">DISTRIBUIDORA DE HUEVO Y POLLO</span>
            
            {/* Texto dinámico del Título */}
            <h1 className="display-3 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {config.hero_headline}
            </h1>
            
            {/* Texto dinámico del Subtítulo */}
            <p className="lead mx-auto mb-5" style={{ maxWidth: '750px', fontSize: '1.4rem' }}>
              {config.hero_subheadline}
            </p>
            
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a href="/catalogo" className="btn btn-warning btn-lg px-5 rounded-pill shadow fw-bold text-dark">Explorar Catálogo</a>
              <a href="https://wa.me/5212381325482" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg px-5 rounded-pill">Cotizar Mayoreo</a>
            </div>
          </div>
        </section>

        {/* --- 3. SECCIÓN "QUIÉNES SOMOS" Y RESPALDO --- */}
        <section id="nosotros" className="container py-6" style={{ padding: '80px 0' }}>
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img 
                src="/assets/ventadepollos1.jpg" 
                alt="Personal de GarCar trabajando" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
            <div className="col-md-6 ps-md-5">
              <h2 className="display-5 fw-bold text-danger mb-4">¿Quiénes Somos?</h2>
              <p className="lead text-secondary mb-4">
                En <strong>GarCar</strong>, somos mucho más que una distribuidora; somos socios estratégicos de tu negocio. Nos especializamos en el abastecimiento de pollo vivo y huevo de la más alta calidad en la región.
              </p>
              <p className="text-muted mb-5">
                Nuestro compromiso es con la frescura y la honestidad en el pesaje. Trabajamos incansablemente para asegurar que recibas productos de primera, con rutas de entrega optimizadas para que tu inventario nunca falte.
              </p>
              
              {/* Sello de Confianza Integrado (Usando tu ruta .png) */}
              <div className="d-flex align-items-center bg-white p-3 rounded-3 shadow-sm border">
                <img 
                  src="/assets/respaldo-san-antonio.png" 
                  alt="Respaldo San Antonio" 
                  width="100"
                  className="rounded-circle me-3"
                />
                <div>
                  <h4 className="h6 fw-bold mb-1 text-dark">Respaldados por los Mejores</h4>
                  <p className="small text-muted mb-0">Contamos con el respaldo de <strong>San Antonio</strong>, "El pollo más confiable de México", garantizando aves de excelente rendimiento.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. RESUMEN DEL CATÁLOGO (LO QUE OFRECEN) --- */}
        <section id="productos" className="py-6" style={{ backgroundColor: '#f4f4f4', padding: '80px 0' }}>
          <div className="container text-center">
            <h2 className="display-5 fw-bold mb-5">Nuestros Productos Estrella</h2>
            <div className="row g-4">
              
              {/* Tarjeta Pollo Vivo */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow p-3 text-start bg-white rounded-3">
                  <div className="row g-0 align-items-center">
                    <div className="col-4 text-center text-danger display-1">🐓</div>
                    <div className="col-8">
                      <div className="card-body">
                        <h3 className="h4 fw-bold card-title text-danger">Pollo Vivo San Antonio</h3>
                        <p className="card-text text-muted mb-2">Aves de 3.000 kg a 3.400 kg de alto rendimiento. Honestidad en el pesaje.</p>
                        <span className="badge bg-danger">Súper Precio Heroico</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Huevo */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow p-3 text-start bg-white rounded-3">
                  <div className="row g-0 align-items-center">
                    <div className="col-4 text-center text-warning display-1">🥚</div>
                    <div className="col-8">
                      <div className="card-body">
                        <h3 className="h4 fw-bold card-title text-dark">Huevo Fresco y Seleccionado</h3>
                        <p className="card-text text-muted mb-2">Venta por Caja con 360 huevos. Clasificación estándar y Doble Yema.</p>
                        <span className="badge bg-warning text-dark fw-bold">Directo de Granja</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <a href="/catalogo" className="btn btn-outline-danger btn-lg mt-5 px-5 rounded-pill fw-bold">Ver Catálogo Completo</a>
          </div>
        </section>

        {/* --- 5. CÓMO ES EL PROCESO DE COMPRA --- */}
        <section id="compra" className="container py-6" style={{ padding: '80px 0' }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-success">Tu Pedido en 3 Pasos</h2>
            <p className="lead text-muted">Trato directo, transparente y rápido.</p>
          </div>
          
          <div className="row g-4 text-center">
            {/* Paso 1 */}
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: '80px', height: '80px'}}>
                  <span className="display-5 fw-bold text-success">1</span>
                </div>
                <h3 className="h5 fw-bold">Arma tu Cotización</h3>
                <p className="text-muted small mb-0">Revisa nuestro catálogo online y añade los productos que necesitas al carrito de cotización.</p>
              </div>
            </div>
            {/* Paso 2 */}
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: '80px', height: '80px'}}>
                  <span className="display-5 fw-bold text-success">2</span>
                </div>
                <h3 className="h5 fw-bold">Confirma por WhatsApp</h3>
                <p className="text-muted small mb-0">Envía tu cotización. Te atenderemos personalmente para mejorar cualquier precio y coordinar la entrega.</p>
              </div>
            </div>
            {/* Paso 3 */}
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100 border border-success border-2">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: '80px', height: '80px'}}>
                  <span className="display-5 fw-bold text-white">3</span>
                </div>
                <h3 className="h5 fw-bold text-success">Recibe y Vende</h3>
                <p className="text-muted small mb-0">Llevamos los productos frescos directo a tu negocio. ¡Pagas al recibir!</p>
              </div>
            </div>
          </div>
        </section>

      </main>


      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a 
        href="https://wa.me/5212381325482?text=Hola,%20me%20gustaría%20cotizar%20precios%20de%20mayoreo%20en%20GarCar" 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', zIndex: 1000 }}
        title="Cotiza por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

    </div>
  );
};

export default Home;