import { Router } from "express";

const router = Router()


router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/loggerTest' , (req,res) => {
    req.logger.fatal('hay un error fatal')
    req.logger.error('hay un error')
    req.logger.warning('Quizas tengas un error')
    req.logger.info(`Estas probando ${req.url}`)
    req.logger.http(`${req.method}`)
    req.logger.debug('hay un bug')
    res.end()
})


export default router