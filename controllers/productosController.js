const Productos = require("../models/Productos");

const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

// Opciones de Multer
const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "/../uploads/");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    }
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      // Se ejecutan dos piezas, el callback como true o false - true: cuando la imagen se acepta
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"), false);
    }
  }
};

// Pasa la configuración y el campo
const upload = multer(configuracionMulter).single("imagen");

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
  upload(req, res, function(error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          res.json({ error: "El archivo es muy grande, tamaño máximo 150kb" });
        } else {
          res.json({ error: error.message });
        }
      } else if (error.hasOwnProperty("message")) {
        res.json({ error: error.message });
      }
      return;
    } else {
      next();
    }
  });
};

// Agregar un nuevo producto
exports.nuevoProducto = async (req, res, next) => {
  const producto = new Productos(req.body);

  try {
    if (req.file) {
      producto.imagen = req.file.filename;
    }

    // Almacenar cliente en la DB
    await producto.save();
    res.json({
      mensaje: "Se agregó el producto"
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

// Muestra todos los productos
exports.mostrarProductos = async (req, res, next) => {
  try {
    const productos = await Productos.find();

    if (productos.length < 1) {
      res.json({ mensaje: "No hay productos" });
    }

    res.json(productos);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Muestra un producto
exports.mostrarProducto = async (req, res, next) => {
  try {
    const producto = await Productos.findById(req.params.id);

    if (!producto) {
      res.json({ mensaje: "Ese producto no existe" });
    }

    res.json(producto);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res, next) => {
  try {
    // Obtener producto anterior
    const productoAnterior = await Productos.findById(req.params.id);

    // Construir un nuevo producto
    const nuevoProducto = req.body;

    // Si hay imagen anterior y nueva, significa que vamos a borrar la anterior
    if (req.file && productoAnterior.imagen) {
      const imagenAnterior =
        __dirname + `/../uploads/${productoAnterior.imagen}`;

      // Eliminar archivo con fileSystem
      fs.unlink(imagenAnterior, error => {
        if (error) {
          console.log(error);
        }
        return;
      });
    }

    // Verificar si hay una imagen nueva
    if (req.file) {
      nuevoProducto.imagen = req.file.filename;
    }

    const producto = await Productos.findByIdAndUpdate(
      { _id: req.params.id },
      nuevoProducto,
      {
        new: true
      }
    );

    res.json(producto);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Elimina un producto
exports.eliminarProducto = async (req, res, next) => {
  try {
    // Obtener producto para eliminar la imagen
    const producto = await Productos.findById(req.params.id);

    if (!producto) {
      res.json({ mensaje: "Ese producto no existe" });
      next();
    }

    // Verificar si hay imagen
    if (producto.imagen) {
      const imagenAnterior = __dirname + `/../uploads/${producto.imagen}`;

      // Eliminar archivo con fileSystem
      fs.unlink(imagenAnterior, error => {
        if (error) {
          console.log(error);
        }
        return;
      });
    }

    await Productos.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "El producto se ha eliminado" });
  } catch (error) {
    console.log(error);
    next();
  }
};

// Busca un producto
exports.buscarProducto = async (req, res, next) => {
  try {
    const { query } = req.params;
    const producto = await Productos.find({nombre: new RegExp(query, 'i')});
    res.json(producto);

  } catch (error) {
    console.log(error);
    next();
  }
};
