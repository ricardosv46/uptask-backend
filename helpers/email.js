import nodemailer from 'nodemailer'
export const emailRegistro = async ({ email, nombre, token }) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  //info del mail
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos"  <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: 'Comprueba tu cuenta en UpTask',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>

    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar Cuenta</a></p>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
}

export const emailOlvidePassword = async ({ email, nombre, token }) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  //info del mail
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos"  <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Reestablece tu Password',
    text: 'Reestablece tu Password',
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>

    <p>Sigue siguiente enlace para generar un nuevo password:

    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer tu Password</a></p>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `
  })
}
