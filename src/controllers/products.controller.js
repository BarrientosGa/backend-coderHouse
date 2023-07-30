
export const validationType = (req , res , next) => {
    const {title , description, code, price , status=true , stock, category} = req.body
    const fieldsIString = {
        titleIString : typeof title === 'string',
        descriptionIString : typeof description === 'string',
        codeIString : typeof code === 'string',
        categoryIString : typeof category === 'string',
    }

    const fieldsIsNumber = {
        priceIsNumber : typeof price === 'number',
        stockIsNumber : typeof stock === 'number'
    }

    if(!fieldsIString.titleIString || !fieldsIString.descriptionIString || !fieldsIString.codeIString || !fieldsIString.categoryIString){
        return res.status(400).send({message:'expected string'})
    }
    else if(!fieldsIsNumber.priceIsNumber || !fieldsIsNumber.stockIsNumber){
        return res.status(400).send({message:'expected number'})
    }
    return next()
}