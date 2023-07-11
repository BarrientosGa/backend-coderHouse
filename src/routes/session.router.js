import { Router } from "express";
import passport from "passport";

const router = Router()


router.post('/register' , passport.authenticate('register' , {failureRedirect:'/register'}) , async(req , res) => {
   res.send({status:'success' , message:'User register'})
})

router.post("/login", passport.authenticate('login') ,  async (req, res) => {

    if(!req.user) return res.status(400).send({status:'error' , error:'Invalid credentials'})
    req.session.user = {
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      age:req.user.age,
      email: req.user.email
    }
    res.send({status:'success' , payload : req.user})
  });

router.get('/logout' , (req ,res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(400).send({status : 'Logout error' , body:err})
    }
    res.send('Logout ok')
  })
})

router.get('/github' , passport.authenticate('github' , {scope:['user:email']}), (req ,res) => {})

router.get('/githubcallback' , passport.authenticate('github' , {failureRedirect:'/login'}), (req ,res) => {
  req.session.user = req.user
  res.redirect('/api/products/products')
})




export default router