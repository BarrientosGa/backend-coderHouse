import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { CurrentUserDTO } from "../controllers/dto/user.dto.js";
import nodemailer from 'nodemailer'

const router = Router()

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: config.email,
      pass: config.passwordApp
  }
})

/* el session en false es porque estamos usando jwt al usar esto tampoco usamos las funciones de serializar y deserializar */


router.post('/register' , passport.authenticate('register' , {session:false}) , async(req , res) => {
   res.send({status:'success' , message:'User register'})
})

router.post("/login", passport.authenticate('login' , {session:false}) ,  async (req, res) => {
  const payload = req.user
  let token = jwt.sign(payload , config.secret_or_key , {expiresIn:'24h'})
  res.cookie('coderCookie' , token , {httpOnly:true}).send({ status: "success" });
});

router.post('/logout' , async(req ,res) => {
  res.clearCookie('coderCookie')
  res.send({message:'success'})
})

router.post('/forgot-password' , async(req , res) => {
  const {email} = req.body
   await transport.sendMail({
    from: config.email,
    to : email,
    subject : 'Reestablecer contraseña',
    html : `
      <div>
        <h1>Bienvenido</h1>
        <p>Haga click en el siguiente botón para reestablecer su contraseña</p>
        <a href="https://www.w3schools.com">Reestablecer contraseña</a>
      </div>
    `
  })
  res.send({message:'Revisa tu casilla de correo'})

})

router.get('/github' , passport.authenticate('github' , {scope:['user:email']}), (req ,res) => {})

router.get('/githubcallback' , passport.authenticate('github' , {failureRedirect:'/login'}), (req ,res) => {
  req.session.user = req.user
  res.redirect('/api/products/products')
})

// te devuelve la informacion del usuario
router.get('/current' , passport.authenticate('jwt' , {session : false}) , async(req ,res) => {
  res.send(new CurrentUserDTO(req.user))
})




export default router