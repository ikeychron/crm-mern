const Clientes = require("../models/Clientes");

// Agrega un nuevo cliente
exports.nuevoCliente = async (req, res, next) => {
  const cliente = new Clientes(req.body);

  try {
    // Almacenar cliente en la DB
    await cliente.save();
    res.json({
      mensaje: "Se agregó un nuevo cliente"
    });
  } catch (error) {
    res.send(error);
    next();
  }
};

// Muestra todos los clientes
exports.mostrarClientes = async (req, res, next) => {
  try {
    // Almacenar cliente en la DB
    const clientes = await Clientes.find();

    if (clientes.length < 1) {
      res.send({ mensaje: "No hay clientes" });
    }

    res.json(clientes);
  } catch (error) {
    res.send(error);
    next();
  }
};

// Muestra un cliente
exports.mostrarCliente = async (req, res, next) => {
  const cliente = await Clientes.findById(req.params.id);

  if (!cliente) {
    res.send({ mensaje: "Ese cliente no existe" });
    next();
  }

  // Mostrar cliente
  res.json(cliente);
};

// Actualizar cliente
exports.actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true
      }
    );
    res.json(cliente);
  } catch (error) {
    res.send(error);
    next();
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res, next) => {
  try {

    const cliente = await Clientes.findById(req.params.id);
    
    if(!cliente) {
      res.send({mensaje: 'Ese cliente no existe'})
      next();
    }

    await Clientes.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "El cliente se ha eliminado" });
  } catch (error) {
    res.send(error);
    next();
  }
};
