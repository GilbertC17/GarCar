import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(item => item.id_producto === producto.id_producto);
      if (existe) {
        return prevCarrito.map(item =>
          item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };

  // --- NUEVA FUNCIÓN PARA RESTAR ---
  const restarDelCarrito = (id) => {
    setCarrito((prevCarrito) => {
      return prevCarrito.map(item => {
        if (item.id_producto === id) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      }).filter(item => item.cantidad > 0); // Si llega a 0, se elimina automáticamente
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id_producto !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // No olvides exportar la nueva función aquí abajo:
  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};