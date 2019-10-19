const express = require("express");
const router = express.Router();

// Controllers
const clientesController = require("../controllers/clientesController");
const productosController = require("../controllers/productosController");
const pedidosController = require("../controllers/pedidosController");
const usuariosController = require("../controllers/usuariosController");

// Middleware para proteger las rutas
const auth = require("../middlewares/auth");

module.exports = function() {
  /* Clientes */

  // Agregar un nuevo cliente
  router.post("/clientes", auth, clientesController.nuevoCliente);

  // Muestra todos los clientes
  router.get("/clientes", auth, clientesController.mostrarClientes);

  // Muestra un cliente
  router.get("/clientes/:id", auth, clientesController.mostrarCliente);

  // Actualizar cliente
  router.put("/clientes/:id", auth, clientesController.actualizarCliente);

  // Eliminar cliente
  router.delete("/clientes/:id", auth, clientesController.eliminarCliente);

  /* Productos */

  // Agregar un nuevo producto
  router.post(
    "/productos",
    auth,
    productosController.subirArchivo,
    productosController.nuevoProducto
  );

  // Muestra todos los productos
  router.get("/productos", auth, productosController.mostrarProductos);

  // Muestra un producto
  router.get("/productos/:id", auth, productosController.mostrarProducto);

  // Actualizar producto
  router.put(
    "/productos/:id",
    auth,
    productosController.subirArchivo,
    productosController.actualizarProducto
  );

  // Eliminar producto
  router.delete("/productos/:id", auth, productosController.eliminarProducto);

  // Búsqueda de productos
  router.post("/productos/busqueda/:query", productosController.buscarProducto);

  /* Pedidos */

  // Agregar un nuevo pedido
  router.post("/pedidos/nuevo/:id", auth, pedidosController.nuevoPedido);

  // Mostrar todos los pedidos
  router.get("/pedidos", auth, pedidosController.mostrarPedidos);

  // Mostrar pedido
  router.get("/pedidos/:id", auth, pedidosController.mostrarPedido);

  // Actualizar pedido
  router.put("/pedidos/:id", auth, pedidosController.actualizarPedido);

  // Eliminar pedido
  router.delete("/pedidos/:id", auth, pedidosController.eliminarPedido);

  /* Usuarios */

  // Crear cuenta
  router.post("/crear-cuenta", usuariosController.registrarUsuario);

  // Iniciar sesión
  router.post("/iniciar-sesion", usuariosController.autenticarUsuario);

  return router;
};
