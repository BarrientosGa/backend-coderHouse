import {faker} from '@faker-js/faker/locale/es'

export const generateProduct = () => {
    return {
        name : faker.commerce.productName(),
        description : faker.commerce.productDescription(),
        price : faker.commerce.price(),
        image: faker.image.url()
    }
}