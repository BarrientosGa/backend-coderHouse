export class CurrentUserDTO {
    constructor(user){
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.cartId = user.cartId;
    }
}