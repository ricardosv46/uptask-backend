import Proyecto from '../models/Proyecto.js'
import Usuario from '../models/Usuario.js'

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [{ creador: req.usuario._id }, { colaboradores: req.usuario._id }]
  }).select('-tareas')
  res.json(proyectos)
}
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.log(error)
  }
}
const obtenerProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyecto.findById(id)
      .populate({
        path: 'tareas',
        populate: { path: 'completado', select: 'nombre' }
      })
      .populate('colaboradores', 'nombre email')

    if (
      proyecto.creador.toString() !== req.usuario._id.toString() &&
      !proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error('Accion no valida')
      return res.status(401).json({ msg: error.message })
    }

    res.json(proyecto)
  } catch (error) {
    console.log(error)
    const err = new Error('Proyecto no encontrado')
    res.status(404).json({ msg: err.message })
  }
}
const editarProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
      const error = new Error('Proyecto no encontrado')
      return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error('Accion no valida')
      return res.status(401).json({ msg: error.message })
    }
    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
      const proyectoAlmacenado = await proyecto.save()
      res.json(proyectoAlmacenado)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    const err = new Error('El id que ingresaste no es valido')
    res.status(404).json({ msg: err.message })
  }
}
const eliminarProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyecto.findById(id)

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error('Accion no valida')
      return res.status(401).json({ msg: error.message })
    }

    try {
      await proyecto.deleteOne()
      res.json({ msg: 'Proyecto eliminado' })
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    const err = new Error('Proyecto no encontrado')
    res.status(404).json({ msg: err.message })
  }
}

const buscarColaborador = async (req, res) => {
  const { email } = req.body

  const usuario = await Usuario.findOne({ email }).select(
    '-confirmado -createdAt -password -token -updatedAt -__v'
  )

  if (!usuario) {
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ msg: error.message })
  }
  res.json(usuario)
}
const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id)

  if (!proyecto) {
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (!proyecto.creador.toString() === req.usuario._id.toString()) {
    const error = new Error('Acción no valida')
    return res.status(404).json({ msg: error.message })
  }

  const { email } = req.body
  const usuario = await Usuario.findOne({ email }).select(
    '-confirmado -createdAt -password -token -updatedAt -__v'
  )

  if (!usuario) {
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error('El Creador del Proyecto no puede ser colaborador')
    return res.status(404).json({ msg: error.message })
  }

  //Revisar que no este agregado al proyecto

  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error('El Usuario ya es colaborador')
    return res.status(404).json({ msg: error.message })
  }

  //Esta bien se puede agregar

  proyecto.colaboradores.push(usuario._id)
  await proyecto.save()
  res.json({ msg: 'Colaborador Agregado Correctamente' })
}
const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id)

  if (!proyecto) {
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (!proyecto.creador.toString() === req.usuario._id.toString()) {
    const error = new Error('Acción no valida')
    return res.status(404).json({ msg: error.message })
  }

  //Esta bien se puede eliminar
  proyecto.colaboradores.pull(req.body.id)
  await proyecto.save()
  res.json({ msg: 'Colaborador Eliminado Correctamente' })
}

//Metodo para obtener las tareas de un proyecto pero no se usa

// const obtenerTareas = async (req, res) => {
//   const { id } = req.params
//   try {
//     const existeProyecto = await Proyecto.findById(id)

//     if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
//       const error = new Error('Accion no valida')
//       return res.status(401).json({ msg: error.message })
//     }

//     //Tienes que ser el creador del proyectoo colaborador

//     const tareas = await Tarea.find().where('proyecto').equals(id)
//     res.json(tareas)
//   } catch (error) {
//     console.log(error)
//     const err = new Error('Proyecto no encontrado')
//     res.status(404).json({ msg: err.message })
//   }
// }
export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador
}
