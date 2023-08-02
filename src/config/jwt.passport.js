import passport from 'passport'
import jwt from 'passport-jwt'
import config from '../config/config.js'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassportJWT = () => {
    passport.use('jwt' , new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.secret_or_key
    } , async(jwtPayload , done) => {
        try {
            return done(null , jwtPayload)
        } catch (error) {
            return done(error)
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["coderCookie"];
    }
    return token
  };