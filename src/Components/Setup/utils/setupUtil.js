import FacultyInfoSetup from "../components/FacultyInfoSetup"

function validateStep (step, data) {
    switch (step) {
        case 0: 
            return validateAdminAccount(data)
            break
        case 1:
            return validateAppInfo(data)
            break
        case 2:
            return validateFacultyInfo(data)
            break
    }
}

function validateAdminAccount(data) {
    let res = {isValid : true, location: []}
    if(data.name.trim().length === 0) {
        res.isValid = false
        res.location.put("name")
    }
    if(data.email.length === 0 || !validateEmail(data.email)) {
        res.isValid = false
        res.location.put("email")
    }
    if(!validatePassword(data.password)) {
        res.isValid = false
        res.location.put("pwd")
    }
    return res
}

function generateFieldName(field) {
    switch (String(field).toLowerCase()) {
        case "nume":
            return "name"
            break
        case "parola":
            return "password"
            break
        case "email":
            return "email"
            break
    }
}

function createSetupJSON(data) {
    const jsonData = {}
    console.log()
    jsonData.account = generateAdminAccountSetupJSON(data.adminAccount)
    jsonData.app = generateAppInfoSetupJSON(data)
    return jsonData
}

function generateAdminAccountSetupJSON(data) {
    const jsonData = {}
    jsonData.email = data.email
    jsonData.password = data.password
    jsonData.roleName = "ADMIN"
    const jsonDataProfile = {}
    jsonDataProfile.firstName = data.firstName
    jsonDataProfile.lastName = data.lastName
    jsonDataProfile.phoneNumber = data.phoneNumber
    jsonData.profile = jsonDataProfile

    return jsonData
}

function generateAppInfoSetupJSON(data) {
    const jsonData = {}
    jsonData.appName = data.appData.name
    jsonData.appLogo = data.appData.logoName
    jsonData.logoPath = data.appData.path
    jsonData.facultyName = data.faculty.facultyName
    jsonData.facultyPhone = data.faculty.facultyPhone
    jsonData.facultyAddress = data.faculty.facultyAddress

    return jsonData
}

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword (password) {
    let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return re.test(String(password));
}

function validateName(name) {
    let re = /^[a-zA-Z]{3,}$/
    return re.test(name.trim());
}

function validateFirstName(name) {
    let re = /^[a-zA-Z]{3,}$/
    return re.test(name.trim());
}

function validatePhoneNumber(phoneNumber) {
    let re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    return re.test(phoneNumber)
}

function validateAppInfo(name) {
    let re = /^[a-zA-Z]{2,}$/
    return re.test(name.trim());
}

function validateFacultyInfo(data) {

}

function validateFacultyField(name) {
    if(name.trim().length > 1){
        return true
    } else {
        return false
    }
}

export default {
    validateStep,
    validateAdminAccount,
    generateFieldName,
    createSetupJSON,
    validateEmail,
    validatePassword,
    validateName,
    validatePhoneNumber,
    validateFirstName,
    validateFacultyField
}


