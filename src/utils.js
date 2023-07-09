import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt'

/* 

    - hashSync toma el password que pasemos y procedera a aplicar un proceso de hasheo a partir de un Salt
    - getSaltSync generara un Salt de 10 caracteres. un Salt es un string random
    - la funcion createHash devuelve un string con el password hasheado.

*/
export const createHash = password => bcrypt.hashSync(password , bcrypt.genSaltSync(10))

/* 

    - compareSync tomara primero el password sin hashear y lo comparara con el password hasheado en
    la base de datos. y retorna true o false

*/

export const isValidPassword = (user , password) => bcrypt.compareSync( password, user.password)





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;