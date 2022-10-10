// rutas para crear usuarios
import express from 'express'
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil
} from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js'
const router = express.Router()

//auth crea registro confirma un usuario

router.post('/', registrar) //crea un nuevo usuario
router.post('/login', autenticar) //autentica el nuevo usuario
router.get('/confirmar/:token', confirmar) //confirmar la cuenta de un usuario
router.post('/olvide-password', olvidePassword) //recuperar la contraseña de un usuario
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)
router.get('/perfil', checkAuth, perfil)
export default router
