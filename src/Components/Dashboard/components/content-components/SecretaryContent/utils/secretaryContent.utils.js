import axios from "axios"
import hostURL from "../../../../../utils/constants/hostURL"
import { API_GET_USERS_BY_ROLE } from "../../../../../utils/constants/urlConstants"


const getAllByRole = async (token, role) => {
    let returnedData = []
    let user = {}
    const respAllByRole = await axios.get(hostURL()+API_GET_USERS_BY_ROLE, {headers: {"Authorization" : `Bearer ${token}`}, params:{rls: role}})
    console.log(respAllByRole)
    if(respAllByRole.status === 200) {
        for(let i=0;i<respAllByRole.data.length; i++) {
            user.uid = respAllByRole.data[i].UserId
            user.email = respAllByRole.data[i].User.email
            user.firstName = respAllByRole.data[i].User.Profile.firstName
            user.lastName = respAllByRole.data[i].User.Profile.lastName
            user.phoneNumber = respAllByRole.data[i].User.Profile.phoneNumber
            if(respAllByRole.data[i].User.Profile.Student) {
                user.Student.identityId = respAllByRole.data[i].User.Profile.Student.identityId
                user.Student.educationForm = respAllByRole[i].data[i].User.Profile.Student.educationForm
                user.Student.budgetForm = respAllByRole[i].data[i].User.Profile.Student.budgetForm
            }
            returnedData.push({...user})
        }
    }
    return returnedData
}

const getRoleByType = (type) => {
    switch(type) {
        case 'Students':
            return "STUDENT"
        case 'Secretaries':
            return "SECRETARY"
        case 'Teachers':
            return "TEACHER"
        default:
            return "ADMIN"
    }
}

export default {
    getAllByRole,
    getRoleByType
}