import axios from 'axios'


const buildClient = ({req})=>{
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL: 'http://34.123.94.164',
            headers: req.headers
        })
    }else{
        return axios.create({
            baseURL: '/'
        })
    }
}

export default buildClient