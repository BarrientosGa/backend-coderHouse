export const rolesMiddlwaresAdmin = (req ,res , next) => {
    if(req.user.role === 'admin' || req.user.role === 'premium'){
        next()
    }
    else {
        res.send({error : 'No tiene permisos para realizar esta acción'})
    }
}

export const rolesMiddlwaresUser = (req ,res , next) => {
    if(req.user.role === 'user'){
        next()
    }
    else {
        res.send({error : 'No tiene permisos para realizar esta acción'})
    }
}