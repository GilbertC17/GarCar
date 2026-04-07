import React from 'react';

const Contacto = () => {
  return (
    <div className="container py-5 min-vh-100">
      <div className="text-center mb-5 animate__animated animate__fadeInDown">
        <h2 className="fw-bold display-5 text-dark">Contáctanos</h2>
        <p className="lead text-muted">Estamos para atenderte y surtir tu negocio con la mejor calidad.</p>
      </div>

      <div className="row g-5 align-items-center">
        {/* COLUMNA DE INFORMACIÓN */}
        <div className="col-lg-5 animate__animated animate__fadeInLeft">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100">
            <h4 className="fw-bold mb-4 text-dark">Información de GarCar</h4>
            
            <div className="d-flex align-items-start mb-4">
              <div className="bg-light p-3 rounded-circle me-3 text-danger shadow-sm">
                <i className="bi bi-geo-alt-fill fs-4"></i>
              </div>
              <div className="mt-2">
                <h6 className="fw-bold mb-1">Ubicación</h6>
                <p className="text-muted mb-0">Tehuacán, Puebla, México.</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-4">
              <div className="bg-light p-3 rounded-circle me-3 text-danger shadow-sm">
                <i className="bi bi-clock-fill fs-4"></i>
              </div>
              <div className="mt-2">
                <h6 className="fw-bold mb-1">Horario de Bodega</h6>
                <p className="text-muted mb-0">Lunes a Sábado <br/> 5:00 AM - 2:00 PM</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-4">
              <div className="bg-light p-3 rounded-circle me-3 text-danger shadow-sm">
                <i className="bi bi-telephone-fill fs-4"></i>
              </div>
              <div className="mt-2">
                <h6 className="fw-bold mb-1">Atención Directa</h6>
                <p className="text-muted mb-0">238 132 5482</p>
              </div>
            </div>

            <hr className="my-4 text-muted" />
            
            <p className="small text-muted mb-3">
              ¿Tienes dudas sobre precios de mayoreo o disponibilidad? Escríbenos directamente:
            </p>
            <a 
              href="https://wa.me/5212381325482?text=Hola%20GarCar,%20vengo%20de%20su%20página%20web%20y%20me%20gustaría%20pedir%20información." 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm transition-all hover-scale"
            >
              <i className="bi bi-whatsapp me-2 fs-5 align-middle"></i> Enviar WhatsApp
            </a>
          </div>
        </div>

        {/* COLUMNA DEL MAPA */}
        <div className="col-lg-7 animate__animated animate__fadeInRight">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative" style={{ height: '500px' }}>
            {/* Nota: Este es un mapa centrado en Tehuacán. 
              Si luego quieres poner tu dirección exacta, solo búscalo en Google Maps, 
              dale en "Compartir" -> "Insertar un mapa" y cambia este enlace "src".
            */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.931752718872!2d-97.404288!3d18.463259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c5bcc4dc63b8b1%3A0xc6a827ba138e64dc!2sTehuac%C3%A1n%2C%20Pue.!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación GarCar"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;