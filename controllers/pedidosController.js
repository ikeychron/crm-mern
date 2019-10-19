const Pedidos = require("../models/Pedidos");

// Agregar un nuevo pedido
exports.nuevoPedido = async (req, res, next) => {
  const pedidos = new Pedidos(req.body);

  try {
    await pedidos.save();
    res.json({ mensaje: "Se agregó un nuevo pedido" });
  } catch (error) {
    console.log(error);
    next();
  }
};

// Mostrar todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.find()
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos"
      });
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Mostrar pedido
exports.mostrarPedido = async (req, res, next) => {
  const pedido = await Pedidos.findById(req.params.id)
    .populate("cliente")
    .populate({
      path: "pedido.producto",
      model: "Productos"
    });

  if (!pedido) {
    res.json({ mensaje: "Ese pedido no existe" });
    next();
  }

  // Mostrar el pedido
  res.json(pedido);
};

// Actualizar pedido
exports.actualizarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedidos.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos"
      });

    res.json(pedido);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Eliminar pedido
exports.eliminarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedidos.findById(req.params.id);

    if (!pedido) {
      res.json({ mensaje: "Ese pedido no existe" });
      next();
    }

    await Pedidos.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "El pedido se ha eliminado" });
  } catch (error) {
    console.log(error);
    next();
  }
};
