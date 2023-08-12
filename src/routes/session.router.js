import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { CurrentUserDTO } from "../controllers/dto/user.dto.js";

const router = Router()

/* el session en false es porque estamos usando jwt al usar esto tampoco usamos las funciones de serializar y deserializar */


router.post('/register' , passport.authenticate('register' , {session:false}) , async(req , res) => {
   res.send({status:'success' , message:'User register'})
})

router.post("/login", passport.authenticate('login' , {session:false}) ,  async (req, res) => {
  const payload = req.user
 /*  console.log(payload); */
  let token = jwt.sign(payload , config.secret_or_key , {expiresIn:'24h'})
  res.cookie('coderCookie' , token , {httpOnly:true}).send({ status: "success" });
});

router.post('/logout' , (req ,res , next) => {
  req.logout(()=>{
    if (err) { return next(err); }
    res.redirect("/login");
  });
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