import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row g-4">

          {/* COLUMNA 1: LOGO E INFO */}
          <div className="col-md-4">
            <img src="/assets/logo-garcar.png" alt="Logo GarCar" width="60" className="mb-3" />
            <h5 className="fw-bold text-warning">Distribuidora GarCar</h5>
            <p className="small text-white">
              Líderes en la distribución de pollo vivo y huevo fresco.
              Calidad y honestidad en cada pesaje para tu negocio.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light fs-4"><i className="bi bi-instagram"></i></a>
              <a href="https://wa.me/5212381325482" className="text-light fs-4"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>

          {/* COLUMNA 2: CONTACTO RÁPIDO */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-4">Contacto</h5>
            <ul className="list-unstyled small text-white">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                Tehuacán, Puebla, México.
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill text-danger me-2"></i>
                238 132 5482
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill text-danger me-2"></i>
                Lunes a Sábado: 5:00 AM - 2:00 PM
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: UBICACIÓN GOOGLE MAPS */}
          <div className="col-md-5">
            <h5 className="fw-bold mb-3">Nuestra Ubicación</h5>
            <div className="rounded-3 overflow-hidden shadow-sm" style={{ height: '150px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60552.96990473554!2d-97.44865143516517!3d18.45824833284634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c582bb9b474927%3A0x181452bc07d211eb!2zVGVodWFjw6FuLCBQdWUu!5e0!3m2!1ses-419!2smx!4v1775517372705!5m2!1ses-419!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Mapa GarCar"
              ></iframe>

            </div>
          </div>

        </div>

        <hr className="my-4 bg-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 small text-white">
              &copy; {new Date().getFullYear()} <strong>GarCar</strong>. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 small text-white">
              *Precios sujetos a cambio sin previo aviso.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;