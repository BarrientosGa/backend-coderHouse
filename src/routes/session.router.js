import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router()


router.post('/register' , async(req , res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const existUser = await userModel.findOne({email})

    if(existUser){
        return res.status(400).send({ status: "error", message: "usuario ya registrado" })
    }

    await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password
    })

    res.send({ status: "success", message: "usuario  registrado" });
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) return res.status(401).send('error')
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
      return req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age,
        rol : 'admin'
      };
    }
    req.session.user = {
      name: user.first_name + user.last_name,
      email: user.email,
      age: user.age,
      rol: 'usuario'
    };
    res.send({ status: "success", message: req.session.user });
  });

router.get('/logout' , (req ,res) => {
  req.session.destroy(err => {
    if(err){
      return res.send({status : 'Logout error' , body:err})
    }
    res.send('Logout ok')
  })
})




export default router