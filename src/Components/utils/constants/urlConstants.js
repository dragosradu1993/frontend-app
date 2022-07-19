//APP
export const GET_APP_IS_SET = `/api-${process.env.REACT_APP_BASE_URL}/app-info/getIsSetApp`
export const GET_APP_INFO = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get`
export const UPLOAD_URL = `/api-${process.env.REACT_APP_BASE_URL}/upload`
export const GET_LOGO_URL = `/api-${process.env.REACT_APP_BASE_URL}/files/logo?env=${process.env.REACT_APP_BASE_URL}`
export const GET_FILE_URL = ``

//User
export const API_LOGIN_ENDPOINT = `/api-${process.env.REACT_APP_BASE_URL}/users/login`
export const API_GET_PROFILE_ENDPOINT = `/api-${process.env.REACT_APP_BASE_URL}/users/get/`
export const API_EDIT_PROFILE = `/api-${process.env.REACT_APP_BASE_URL}/users/edit/edit-profile`
export const API_POST_RESET_PWD = `/api-${process.env.REACT_APP_BASE_URL}/users/post/pwd-reset`
export const API_CHANGE_PWD = `/api-${process.env.REACT_APP_BASE_URL}/users`
export const API_GET_USERS_BY_ROLE = `/api-${process.env.REACT_APP_BASE_URL}/users/get/users-role`
export const API_PROFILE_RESET_PASSWORD = `/api-${process.env.REACT_APP_BASE_URL}/users/post/reset-password`
export const API_REGISTER = `/api-${process.env.REACT_APP_BASE_URL}/users/register` 


//App Data
export const API_GET_MAIN_MENU = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/main-menu`
export const API_GET_DASHBOARD_CONTENT = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/dashboard`
export const API_GET_ALL_USERS_CONTENT = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/all-user-data`
export const API_GET_ALL_BLOCKED_USERS_CONTENT = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/get-blocked-users`
export const API_POST_UNBLOCK_USER = `/api-${process.env.REACT_APP_BASE_URL}/users/post/admin/unblock-user`

export const API_GET_DIALOG_DATA = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/dialog`
export const API_GET_DATA_GRID = `/api-${process.env.REACT_APP_BASE_URL}/app-info/get/data-grid`


//Faculties
export const API_GET_FACULTIES = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/get-all`
export const API_GET_ALL_FACULTY_DATA = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/get-all-data`
export const API_GET_FACULTY = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/get`
export const API_ADD_FACULTY = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/add`
export const API_REMOVE_FACULTY = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/delete`
export const API_EDIT_FACULTY = `/api-${process.env.REACT_APP_BASE_URL}/app/faculties/edit`

//Secretaries
export const API_GET_SECRETARY_TYPE = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/get`
export const API_ADD_SECRETARY_TYPE = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/add`
export const API_EDIT_SECRETARY_TYPE = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/edit`
export const API_REMOVE_SECRETARY_TYPE = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/remove`

//Promotions
export const API_ADD_NEW_PROMOTION = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/promotions/add`
export const API_GET_PROMOTION = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/promotions/get`
export const API_GET_ALL_PROMOTIONS = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/promotions/get-all`
export const API_EDIT_PROMOTION = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/promotions/get`
export const API_REMOVE_PROMOTION = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/promotions/delete`

export const API_ADD_NEW_STUDENT = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/students/add`
export const API_ADD_NEW_TEACHER = `/api-${process.env.REACT_APP_BASE_URL}/users/secretaries/teachers/add`


//Students
export const API_GET_STUDENT_FULL_PROFILE = `/api-${process.env.REACT_APP_BASE_URL}/users/students/get/full-profile`
//Teachers
export const API_GET_TEACHER_FULL_PROFILE = `/api-${process.env.REACT_APP_BASE_URL}/users/teachers/get/full-profile`
export const API_SET_TEACHER_SLOTS = `/api-${process.env.REACT_APP_BASE_URL}/users/teachers/set/available-slots`


//Projects
export const API_ADD_NEW_PROJECT_REQUEST = `/api-${process.env.REACT_APP_BASE_URL}/users/projects/add-request`
export const API_SET_PROJECT_STATE = `/api-${process.env.REACT_APP_BASE_URL}/users/projects/set-request-status`
export const API_GET_APPROVED_PROJECTS = `/api-${process.env.REACT_APP_BASE_URL}/users/projects/get/approved-projects`
export const API_GET_NO_PROJECT_STUDENTS = `/api-${process.env.REACT_APP_BASE_URL}/users/projects/get/no-project-students`

//Admin

export const API_GET_ADMIN_DASHBOARD_DATA = `/api-${process.env.REACT_APP_BASE_URL}/users/get/admin/dashboard-data`