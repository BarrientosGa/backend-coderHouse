import passport from "passport";
import local from 'passport-local'
import userModel from "../dao/models/user.model.js";
import {createHash , isValidPassword} from '../utils.js'
import GitHubStrategy from 'passport-github2'

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
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser)
                return done(null , result)
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
            if(!isValidPassword(user , password)) return done (null , false)
            return done(null , user)
        } catch (error) {
            return done(error)
        }
    })),
    passport.use('github' , new GitHubStrategy({
        clientID: 'Iv1.c32e9428c1896b9f',
        clientSecret: 'a87e267528089c7b1b0087201d9b0a3b5d3f4ad3',
        callbackURL : 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken,profile , done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({email : profile._json.email})
            if(!user){
                let newUser = {
                    first_name : profile._json.name,
                    last_name : '',
                    email : profile._json.email,
                    age : 30,
                    password: ''
                }
                let result = await userModel.create(newUser)
                done(null , result)
            }
            else {//si entra aca es porque el usuario ya existia
                done(null , user)
            }
        } catch (error) {
            return done(error)
        }
    }
    ))
}

export default initializePassport