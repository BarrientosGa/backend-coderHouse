import { Router } from "express";
import userModel from "../persistence/models/user.model.js";

const router = Router()

class UserDTO {
    constructor(user){
        this.first_name = user.first_name
        this.email = user.email
        this.role = user.role
    }
}

router.get('/', async (req, res) => {
    const users = await userModel.find()
    const usersDto = []
    users.map((user) => {
        usersDto.push(new UserDTO(user))
    })
    res.send(usersDto)
})


export default router