import Cookies from 'universal-cookie'
import axios from 'axios'
import * as API_URL from './constants/urlConstants'
import hostURL from './constants/hostURL'
import getData from './getData'
import setupUtils from '../Setup/utils/setupUtil'
import stringConstants from './constants/stringConstants'
import xlsx from 'xlsx'

const cookies = new Cookies()
const BASE_URL = hostURL()

const URL_REQUEST = {
    register_users: BASE_URL + API_URL.API_REGISTER,
    register_faculties: BASE_URL + API_URL.API_ADD_FACULTY,
    register_students: BASE_URL + API_URL.API_ADD_NEW_STUDENT,
    register_teachers: BASE_URL + API_URL.API_ADD_NEW_TEACHER
}
const utils = {
    user: {
        //If authentication is succeed, then save the token as cookie
        authenticate: async (data) => {
            return new Promise(async (resolve,reject) => {
                await axios.post(BASE_URL + API_URL.API_LOGIN_ENDPOINT, data)
                .then((results) => {
                    cookies.set('s', results.data.details.token, {secure:true})
                    const decode = getData.getDataFromToken(results.data.details.token)
                    resolve({
                        loginState:true,
                        roleName: decode.user.roleName,
                        state: decode.user.state,
                        message: 'Autentificare cu succes'
                    })
                })
                .catch((error) => {
                    console.log(error)
                    reject({
                        loginState: false,
                        message: error.response.data.details.message
                    })
                })
            })
        },

        changePassword: async (newPassword) => {
            return new Promise(async (resolve, reject) => {
                await axios.post(
                    BASE_URL + API_URL.API_CHANGE_PWD + `/${cookies.get('id')}/changepwd`,
                    newPassword,
                    {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { fl: 'true'}}
                )
                .then((results) => {
                    resolve({
                        changePasswordState: true,
                        message: stringConstants.user.changePassword
                    })
                })
                .catch((error) => {
                    reject({
                        changePasswordState: false,
                        message: stringConstants.error.atLogin
                    })
                })
            })
        },

        resetPassword: async (email) => {
            return new Promise(async (resolve, reject) => {
                await axios.post(BASE_URL + API_URL.API_PROFILE_RESET_PASSWORD, [], {headers: {'x-api-key': process.env.REACT_APP_API_KEY}, params: {email: email}})
                .then((results) => {
                    resolve({
                        resetPasswordState: true,
                        message: results.data.message
                    })
                })
                .catch((error) => {
                    reject({
                        resetPasswordState: false,
                        message: stringConstants.error.atLogin
                    })
                })
            })
        },

        unblockUser: async (email) => {
            return new Promise(async (resolve, reject) => {
                await axios.post(BASE_URL+API_URL.API_POST_UNBLOCK_USER, {email: email}, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: {role: 'ADMIN'}})
                .then((results) => {
                    resolve({
                        unblockUser: true,
                        message: 'Utilizatorul a fost deblocat cu succes!'
                    })
                })
                .catch((error) => {
                    reject({
                        unblockUser: false,
                        message: stringConstants.error.atLogin
                    })
                })
            })
        },

        secretary: {
            setType: async (data) => {
                return new Promise(async (resolve, reject) => {
                    await axios.post(BASE_URL+API_URL.API_ADD_SECRETARY_TYPE, data, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { pid: cookies.get('pid')}})
                    .then((result) => {
                        resolve({
                            secretaryTypeState: true,
                            message: ''
                        })
                    })
                    .catch((error) => {
                        reject({
                            secretaryTypeState: false,
                            message: stringConstants.error.atLogin
                        })
                    })
                })
            }
        },

        promotions: {
            add: async (data) => {
                return new Promise(async (resolve, reject) => {
                    await axios.post(BASE_URL+API_URL.API_ADD_NEW_PROMOTION, data, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
                    .then((result) => {
                        console.log(result)
                        resolve({
                            addPromotionState: true,
                            message: ''
                        })
                    })
                    .catch((error) => {
                        reject({
                            addPromotionState: false,
                            message: stringConstants.error.atLogin
                        })
                    })
                })
            }
        },

        projects: {
            add: async (data) => {
                return new Promise(async (resolve, reject) => {
                    await axios.post(BASE_URL+API_URL.API_ADD_NEW_PROJECT_REQUEST, data, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
                    .then((result) => {
                        console.log(result)
                        resolve({
                            addProject: true,
                            message: ''
                        })
                    })
                    .catch((error) => {
                        reject({
                            addProject: false,
                            message: stringConstants.error.atLogin
                        })
                    })
                })
            },

            getApproved: async (data) => {
                return new Promise(async (resolve, reject) => {
                    await axios.get(BASE_URL+API_URL.API_GET_APPROVED_PROJECTS, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { fid: data.facultyId, year: data.year, type: data.type}})
                    .then((result) => {
                        console.log(result)
                        resolve({
                            getApprovedProjects: true,
                            data: result.data
                        })
                    })
                    .catch((error) => {
                        reject({
                            getApprovedProjects: false,
                            message: stringConstants.error.atLogin
                        })
                    })
                })
            },

            noProjectStudents: async(data) => {
                return new Promise(async (resolve, reject) => {
                    await axios.get(BASE_URL+API_URL.API_GET_NO_PROJECT_STUDENTS, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { fid: data.facultyId, year: data.year, type: data.type}})
                    .then((result) => {
                        console.log(result)
                        resolve({
                            getApprovedProjects: true,
                            data: result.data
                        })
                    })
                    .catch((error) => {
                        reject({
                            getApprovedProjects: false,
                            message: stringConstants.error.atLogin
                        })
                    })
                })
            }
        }
    },

    app: {
        stringToColor: (string) => {
            let hash = 0;
            let i;
            for (i = 0; i < string.length; i += 1) {
              hash = string.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (i = 0; i < 3; i += 1) {
              const value = (hash >> (i * 8)) & 0xff;
              color += `00${value.toString(16)}`.slice(-2);
            }
          
            return color;
        },

        getDialogData: async (when, otherData) => {
            return new Promise(async (resolve, reject) => {
                let params
                if(otherData) {
                    params = {
                        at: when,
                        otherData: otherData
                    }
                } else {
                    params = {
                        at: when,
                        otherData: otherData
                    }
                }


                let headers = {}
                if(when === 'RESET-PASSWORD') {
                    headers = {
                        'x-api-key': process.env.REACT_APP_API_KEY
                    }
                }else {
                    const decode = getData.getDataFromToken(cookies.get('s'))
                    params.user = decode.user
                    headers = {
                        "Authorization" : `Bearer ${cookies.get('s')}`
                    }
                }
                
                await axios.get(BASE_URL + API_URL.API_GET_DIALOG_DATA, {headers: headers, params: params})
                .then((results) => {
                    resolve({
                        dialogState: true,
                        data: results.data
                    })
                })
                .catch((error) => {
                    reject({
                        dialogState: false,
                        message: error.response.data.message
                    })
                })
            })
        },

 

        sendDataByType: async (location, dataToSend) => {

            try{
                let send
                if(cookies.get('rls') === 'ADMIN') {
                    for(let i = 0; i<dataToSend.length; i++) {
                        send = await axios.post(URL_REQUEST[location.replace('-','_')], dataToSend[i], {headers: {
                                "Authorization" : `Bearer ${cookies.get('s')}`
                                }})
                        }
                    return {
                        status: true,
                        data: send
                    }
                } else {
                    send = await axios.post(URL_REQUEST[location.replace('-', '_')], dataToSend, {headers: {
                        "Authorization" : `Bearer ${cookies.get('s')}`
                    }})
                    if(send) {
                        return {
                            status: true,
                            data: send.data.data
                        }
                    }
                }


            }catch(error) {
                if(cookies.get('rls') === 'ADMIN') {
                    return {
                        status: false,
                        data: error.response.data
                    }
                }
                return {
                    status: false,
                    data: error.response.data.results.notAdded
                }
            }
        },

        getDataGridData: async (when, otherData) => {
            return new Promise(async (resolve, reject) => {
                let params = {
                    at: when,
                    fid: cookies.get('fid')
                }
                const decode = getData.getDataFromToken(cookies.get('s'))
                params.user = decode.user
                let headers = {
                    "Authorization" : `Bearer ${cookies.get('s')}`
                }

                if(when === 'secretary-get-bachelors') {
                    params.promotionId = otherData
                }
                if(when === 'secretary-get-disertation') {
                    params.promotionId = otherData
                }

                if(when === 'secretary-get-no-proj-students') {
                    params.promotionId = otherData.year
                }

                if(when === 'admin-get-all-users') {
                    params.id = cookies.get('id')
                }

                if(when === 'blocked-users') {
                    params.id = cookies.get('id')
                }
                
                await axios.get(BASE_URL + API_URL.API_GET_DATA_GRID, {headers: headers, params: params})
                .then((results) => {
                    resolve({
                        dataGridState: true,
                        data: results.data
                    })
                })
                .catch((error) => {
                    reject({
                        dataGridState: false,
                        message: error.response.data.message
                    })
                })
            })
        },

        setTeacherSlots: async (data) => {
            return new Promise(async (resolve, reject) => {
                let headers = {
                    "Authorization" : `Bearer ${cookies.get('s')}`
                }

                await axios.post(BASE_URL + API_URL.API_SET_TEACHER_SLOTS, data, {headers: headers})
                .then((results) => {
                    resolve({
                        dataSetSlots: true,
                        message: results.data.message
                    })
                })
                .catch((error) => {
                    reject({
                        dataSetSlots: true,
                        message: error.response.data.message
                    })
                })
            })
        },

        setProjectStatus: async (data) => {
            return new Promise(async (resolve, reject) => {
                let headers = {
                    "Authorization" : `Bearer ${cookies.get('s')}`
                }

                await axios.post(BASE_URL + API_URL.API_SET_PROJECT_STATE, data, {headers: headers})
                .then((results) => {
                    resolve({
                        dataSetProjectState: true,
                        message: results.data.message
                    })
                })
                .catch((error) => {
                    reject({
                        dataSetProjectState: true,
                        message: error.response.data.message
                    })
                })
            })
        },

        getDashboardData: async () => {
            return new Promise(async (resolve, reject) => {
                const role = cookies.get('rls')
                const appInfo = await axios.get(BASE_URL + API_URL.GET_APP_INFO)
                let roleData
                let facultyData
                let results = {
                    appData: {},
                    facultyData: {}
                }
                switch(role) {
                    case 'ADMIN':
                        roleData = await axios.get(
                            BASE_URL + API_URL.API_GET_ADMIN_DASHBOARD_DATA,
                            {headers: {"Authorization" : `Bearer ${cookies.get('s')}`},
                            params: { id: cookies.get('id')}}
                        )

                        if(appInfo.status === 200 && roleData.status === 200) {
                            results = {...results, appData: appInfo.data, facultyData: roleData.data}
                            resolve({
                                dashboardState: true,
                                results: results
                            })
                        } else {
                            reject({
                                dashboardState: false,
                                message: stringConstants.error.atLogin
                            })
                        }
                        break
                    case 'SECRETARY':
                        //Get data by role
                        roleData = await axios.get(
                            BASE_URL + API_URL.API_GET_SECRETARY_TYPE,
                            {headers: {"Authorization" : `Bearer ${cookies.get('s')}`},
                            params: { id: cookies.get('pid')}}
                        )
                        if(roleData.status === 200 && appInfo.status === 200) {
                            facultyData = await axios.get(
                                BASE_URL + API_URL.API_GET_ALL_FACULTY_DATA,
                                {headers: {"Authorization" : `Bearer ${cookies.get('s')}`},
                                params: { id: roleData.data.results.facultyId, type: cookies.get('rls'), pid: cookies.get('pid')}}
                            )
                            results = {...results, appData: appInfo.data}
                            if(facultyData.status === 200) {
                                results = {...results, facultyData: facultyData.data}
                            }
                            resolve({
                                dashboardState: true,
                                results: results
                            })
                        } else {
                            reject({
                                dashboardState: false,
                                message: stringConstants.error.atLogin
                            })
                        }
                        break
                    case 'STUDENT':
                        const studentProfile = await axios.get(
                            BASE_URL + API_URL.API_GET_STUDENT_FULL_PROFILE,
                            {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}}
                        )
                        console.log(appInfo)
                        if(studentProfile.status === 200 && appInfo.status === 200) {
                            
                            results = {...results, appData: appInfo.data, facultyData: studentProfile.data}
                            resolve({
                                dashboardState: true,
                                results: results
                            })
                        } else {
                            reject({
                                dashboardState: false,
                                message: stringConstants.error.atLogin
                            })
                        }
                        console.log(results)
                        break
                    case 'TEACHER':
                        const teacherProfile = await axios.get(
                            BASE_URL + API_URL.API_GET_TEACHER_FULL_PROFILE,
                            {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}}
                        )
                        console.log(appInfo)
                        if(teacherProfile.status === 200 && appInfo.status === 200) {
                            
                            results = {...results, appData: appInfo.data, facultyData: teacherProfile.data}
                            resolve({
                                dashboardState: true,
                                results: results
                            })
                        } else {
                            reject({
                                dashboardState: false,
                                message: stringConstants.error.atLogin
                            })
                        }
                        console.log(results)
                        break
                }

            })
        },

        xlsxToJSON: (e) => {
            const data = e.target.result
            const workBook = xlsx.read(data, { type: 'array' })
            const sheetName = workBook.SheetNames[0]
            const worksheet = workBook.Sheets[sheetName]
            const json = xlsx.utils.sheet_to_json(worksheet)
            
            return json
        }
    },

    cookies: {
        setCookiesForProfile: async (location) => {
            return new Promise(async (resolve, reject) => {
                await axios.get(BASE_URL + API_URL.API_GET_PROFILE_ENDPOINT + getData.getIDFromToken(cookies.get('s')), {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
                .then((results) => {
                    const userData = results.data.details.userData

                    //Set the cookies
                    cookies.set('fn', userData.Profile.firstName, {secure:true})
                    cookies.set('ln', userData.Profile.lastName, {secure:true})
                    cookies.set('fulln', `${userData.Profile.firstName} ${userData.Profile.lastName}`, {secure:true})
                    cookies.set('blocked', userData.Profile.userBlocked, {secure:true})
                    cookies.set('id', userData.id, {secure:true})
                    cookies.set('rls', userData.UserRole.roleName, {secure:true})
                    cookies.set('pid', userData.Profile.id, {secure:true})

                    resolve({
                        state: true,
                        profile: userData.Profile
                    })
                })
                .catch((error) => {
                    reject({
                        cookieState: false,
                        message: error.response.data.details.message
                    })
                })
            })
        },

        setCookiesForSecretary: (data) => {
            cookies.set('st', data.type, {secure:true})
            cookies.set('fid', data.facultyId, {secure:true})
        },


        removeCookies : () => {
            const allCookies = cookies.getAll()
            for(let item in allCookies) {
                cookies.remove(item.toString(), {path: '/'})
            }
        }
    },

    validations: {
        isSamePassword: (oldPassword, password) => {
            return oldPassword === password
        },

        password: (password) => {
            return setupUtils.validatePassword(password)
        },

        matchPasswords: (password, repeatPassword) => {
            return password === repeatPassword
        },

        email: (email) => {
            return setupUtils.validateEmail(email)
        },

        validatePromotionYearRegex: (year) => {
            let re = /^(19[5-9]\d|20[0-9]\d|2099)$/
            return re.test(year)
        },

        validatePromotionYearLength: (year) => {
            return (year.length > 0 && year.length < 5)
        },

        validateDateRegex: (stringDate) => {
            let re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
            return re.test(stringDate)
        },

        validateYear: (stringDate) => {
            let date = new Date(stringDate).getFullYear()
            let nowDate = new Date().getFullYear()

            return (date === nowDate) || (date <= (nowDate+5))
        },

        validateIdentityId: (stringIdentityId) => {
            let re = /^[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)(00[1-9]|0[1-9]\d|[1-9]\d\d)\d$/
            return re.test(stringIdentityId)
        },

        validateStringLength: (string) => {
            return (string.replace(' ', '').length < 3)
        },

        validateTextFieldNumber: (string) => {
            let re = /^[0-9]\d*$/
            return re.test(string)
        },

        validatePhoneNumber: (string) => {
            let re = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/
            return re.test(string)
        }

    }
}



export default utils