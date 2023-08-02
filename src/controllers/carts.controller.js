export const validationNumber = (req , res , next) => {
    const {stock} = req.body
    if(typeof stock !== 'number') return res.status(400).send({message:'expected number'})
    return next();
}