


 const auth = (req ,res , next) => {
    if(req.session.user){
        return next()
    }
    return res.send('error de autorizacion')
}

export default auth
