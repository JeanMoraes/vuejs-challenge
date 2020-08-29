import axios from 'axios'

const catalogo = axios.create({
    baseURL: 'https://catalogo.automatuslab.com/api/Catalogo/DisponibilidadeMovel/'
})

export default catalogo;