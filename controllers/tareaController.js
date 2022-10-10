import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body

  try {
    const existeProyecto = await Proyecto.findById(proyecto)

    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error('No tienes permiso para agregar una tarea')
      return res.status(403).json({ msg: error.message })
    }

    try {
      const tareaAlmacenada = await Tarea.create(req.body)

      existeProyecto.tareas.push(tareaAlmacenada._id)
      await existeProyecto.save()
      res.json(tareaAlmacenada)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    const err = new Error('El proyecto no existe')
    res.status(404).json({ msg: err.message })
  }
}
const obtenerTarea = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const err = new Error('Accion no válida')
      res.status(403).json({ msg: err.message })
    }
    res.json(tarea)
  } catch (error) {
    console.log(error)
    const err = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: err.message })
  }
}
const actualizarTarea = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const err = new Error('Accion no válida')
      res.status(403).json({ msg: err.message })
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
      const tareaAlmacenada = await tarea.save()
      res.json(tareaAlmacenada)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    const err = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: err.message })
  }
}
const eliminarTarea = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await Tarea.findById(id).populate('proyecto')

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const err = new Error('Accion no válida')
      res.status(403).json({ msg: err.message })
    }

    try {
      const proyecto = await Proyecto.findById(tarea.proyecto)
      proyecto.tareas.pull(tarea._id)

      await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

      res.json({ msg: 'La Tarea se eliminó' })
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    const err = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: err.message })
  }
}
const cambiarEstado = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await Tarea.findById(id)
      .populate('proyecto')
      .populate('completado')

    if (
      tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
      !tarea.proyecto.colaboradores.some(
        (colaborador) =>
          colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const err = new Error('Accion no válida')
      res.status(403).json({ msg: err.message })
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id)
      .populate('proyecto')
      .populate('completado')

    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error)
    const err = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: err.message })
  }
}
export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado
}
