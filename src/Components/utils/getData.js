import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as API_URL from '../utils/constants/urlConstants'
import hostURL from './constants/hostURL'

const BASE_URL = hostURL()

const getAppIsSet = async function() {
    return new Promise((resolve, reject) => {
        const URL = BASE_URL + API_URL.GET_APP_IS_SET
        axios.get(URL)
        .then((res) => {
            resolve(res.data)
        })
    })
}

const getAppInfoData = async function() {
    return new Promise((resolve, reject) => {
        const URL = BASE_URL + API_URL.GET_APP_INFO
        axios.get(URL)
        .then((res) => {
            resolve(res.data)
        })
        .catch((res) => {
            reject(res)
        })
    })
}

const getIDFromToken = function(token) {
    const decode = jwtDecode(token)
    return decode.user.id
}


const getImagePath = function(imageURL) {
    let imagePath = imageURL.substring(1)
    const URL = BASE_URL + imagePath
    return URL
}


export default {

    getAppIsSet,
    getAppInfoData,
    getImagePath,
    getIDFromToken
}
