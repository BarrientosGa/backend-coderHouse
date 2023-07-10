import passport from "passport";
import local from 'passport-local'
import userModel from "../dao/models/user.model";
import {createHash , isValidPasswors} from '../utils.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
    passport.use('register' , new LocalStrategy(
        {passReqToCallback:true , usernameField:'email'} , async (req,username,password,done) => {
            const {first_name , last_name , email,age} = req.body
            try {
                let user = await userModel.findOne({email : username})
                if(user){
                    /* 
                        no encontrar un usuario no significa que sea un error, asique el error lo pasamos como null
                        pero el usuario como false. esto significa que ya existe el usuario
                    */
                    return done(null, false)
                }
                const newUSer = {
                    first_name,
                    last_name,
                    email,
                    age,
                    passport: createHash(password)
                }
                let result = await userModel.create(newUSer)
            } catch (error) {
                //cuando hay un error, entonces se manda done con el error indicado
                return done('error al obtener el usuario' + error)
            }
        }
    )),
    passport.use('login' , new LocalStrategy({usernameField:'email'} , async(username , password , done) => {
        try {
            const user = await userModel.findOne({email:username})
            if(!user){
                return done(null,false)
            }
            if(!isValidPasswors(user , password)) return done (null , false)
            return done(null , user)
        } catch (error) {
            return done(error)
        }
    }))
}

passport.serializeUser((user , done) => {
    done(null , user.id)
})

passport.deserializeUser(async(id , done) => {
    let user = await userModel.findById(id)
    done(null , user)
})

export default initializePassport