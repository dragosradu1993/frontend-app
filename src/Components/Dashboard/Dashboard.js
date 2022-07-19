import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import AppMenu from './components/main-components/Drawer/AppMenu';
import axios from 'axios'
import * as API_URL from '../utils/constants/urlConstants'
import hostURL from '../utils/constants/hostURL';
import MainAppBar from './components/main-components/Drawer/MainAppBar';
import Cookies from 'universal-cookie';
import DashboardContent from './components/content-components/DashboardContent/DashboardContent';
import AllUsers from './components/content-components/AdminContent/AllUsers';
import BlockedUsers from './components/content-components/AdminContent/BlockedUsers';
import AddUsers from './components/content-components/AdminContent/AddUsers';
import AddFaculties from './components/content-components/AdminContent/AddFaculties';
import { Backdrop } from '@mui/material';
import { STUDENTS_TABLE_COLUMNS } from '../utils/constants/tableConstants';
import utils from '../utils/utils';
import DialogForm from './components/content-components/recycled-components/DialogForm';
import stringConstants from '../utils/constants/stringConstants'
import DataTable from './components/content-components/recycled-components/DataTable';
import AddStudents from './components/content-components/SecretaryContent/AddStudents';
import AddTeachers from './components/content-components/SecretaryContent/AddTeachers';
import GetBachelors from './components/content-components/SecretaryContent/GetBachelors';
import GetDisertations from './components/content-components/SecretaryContent/GetDisertations';
import NoProjectStudents from './components/content-components/SecretaryContent/NoProjectStudents';
import { grey } from '@mui/material/colors';
import MyRequests from './components/content-components/StudentContent/MyRequests';
import MyProjects from './components/content-components/StudentContent/MyProjects';

const drawerWidth = 240;
const BASE_URL = hostURL()
const GET_APP_INFO = BASE_URL + API_URL.GET_APP_INFO
const GET_SECRETARY_DATA = BASE_URL + API_URL.API_GET_SECRETARY_TYPE
const GET_ALL_DATA = BASE_URL + API_URL.API_GET_ALL_FACULTY_DATA

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [data, setData] = React.useState({isRender: true, refreshData: true, redirect:'Dashboard', appData: {}, facultyData: {}})
  const [dialog, setDialog] = React.useState()
  const [dataGrid, setDataGrid] = React.useState()
  const [dashboardAlert, setDashboardAlert] = React.useState({isError: false, severity: "error", textError: ""})

  const cookies = new Cookies()
  let rows = []
  const refreshData = async () => {
    try {
      const dashboardData = await utils.app.getDashboardData()
      if(data.isRender){
        setData({...data, isRender: false, refreshData:false, redirect:'Dashboard', appData: dashboardData.results.appData, facultyData: dashboardData.results.facultyData})
      } else {
        setData({...data, isRender: false, refreshData:false, appData: dashboardData.results.appData, facultyData: dashboardData.results.facultyData})
      }
      document.title = dashboardData.results.appData.appName
    } catch(error) {
      console.log(error)
    }
  }


  React.useEffect(async () => {
    if(data.refreshData) {
       await refreshData()
      if(data.redirect === 'Dashboard') {
        callback({title: data.redirect})
      }
    }
  }, [data])

  const callback = async (dataCb) => {
      if(dataCb.redirectType === 'dialog') {
        let dialogData
        if(dataCb.redirect === 'student-add-project-request') {
          dialogData = await utils.app.getDialogData(dataCb.redirect, dataCb.data)
        } else {
          dialogData = await utils.app.getDialogData(dataCb.redirect)
        }
        
        setDialog({...dialogData.data, backdrop: false})
      }
      if(dataCb.redirectType === 'refresh') {
          await refreshData()
      }
      if(dataCb.redirectType === 'page') {
          let dataGrid

          //Admin
          if(cookies.get('rls') === 'ADMIN') {
            //Add user
            switch(dataCb.redirect) {
              case '/add-users':
                dataGrid = await utils.app.getDataGridData('admin-add-users')
                setDataGrid(dataGrid.data)
                break
              case '/add-faculty':
                dataGrid = await utils.app.getDataGridData('admin-add-faculties')
                setDataGrid(dataGrid.data)
                break
            }
          }




          if(dataCb.redirect === '/add-students') {
            dataGrid = await utils.app.getDataGridData('secretary-add-students')
            let promotionId
            for(let i = 0; i<data.facultyData.Promotions.length;i++){
              
              if(data.facultyData.Promotions[i].isCurrent) {
                promotionId = data.facultyData.Promotions[i].id
                break
              }
            }
            let sendDataGrid = {...dataGrid.data, facultyId: data.facultyData.id, promotionId: promotionId}
            setDataGrid(sendDataGrid)
          }
          if(dataCb.redirect === '/add-teachers') {
            dataGrid = await utils.app.getDataGridData('secretary-add-teachers')
            let promotionId
            for(let i = 0; i<data.facultyData.Promotions.length;i++){
              
              if(data.facultyData.Promotions[i].isCurrent) {
                promotionId = data.facultyData.Promotions[i].id
                break
              }
            }
            let sendDataGrid = {...dataGrid.data, facultyId: data.facultyData.id, promotionId: promotionId}
            setDataGrid(sendDataGrid)
          }
          if(dataCb.redirect === '/bachelor-projects') {
            let year
            for(let i = 0; i<data.facultyData.Promotions.length; i++) {
              if(data.facultyData.Promotions[i].isCurrent) {
                year = data.facultyData.Promotions[i].id
                break
              }
            }


            dataGrid = await utils.app.getDataGridData('secretary-get-bachelors', year)
            let promotionId
            for(let i = 0; i<data.facultyData.Promotions.length;i++){
              
              if(data.facultyData.Promotions[i].isCurrent) {
                promotionId = data.facultyData.Promotions[i].id
                break
              }
            }
            let sendDataGrid = {...dataGrid.data, FacultyId: data.facultyData.id, PromotionId: promotionId}
            setDataGrid(sendDataGrid)
          }
          if(dataCb.redirect === '/disertation-projects') {
            let year
            for(let i = 0; i<data.facultyData.Promotions.length; i++) {
              if(data.facultyData.Promotions[i].isCurrent) {
                year = data.facultyData.Promotions[i].id
                break
              }
            }


            dataGrid = await utils.app.getDataGridData('secretary-get-disertation', year)
            let promotionId
            for(let i = 0; i<data.facultyData.Promotions.length;i++){
              
              if(data.facultyData.Promotions[i].isCurrent) {
                promotionId = data.facultyData.Promotions[i].id
                break
              }
            }
            let sendDataGrid = {...dataGrid.data, FacultyId: data.facultyData.id, PromotionId: promotionId}
            setDataGrid(sendDataGrid)
          }

          if(dataCb.redirect === '/no-proj-students') {
            let year
            for(let i = 0; i<data.facultyData.Promotions.length; i++) {
              if(data.facultyData.Promotions[i].isCurrent) {
                year = data.facultyData.Promotions[i].id
                break
              }
            }


            dataGrid = await utils.app.getDataGridData('secretary-get-no-proj-students', {year: year, secretaryType: data.facultyData.secretaries[0].type})
            let promotionId
            for(let i = 0; i<data.facultyData.Promotions.length;i++){
              
              if(data.facultyData.Promotions[i].isCurrent) {
                promotionId = data.facultyData.Promotions[i].id
                break
              }
            }
            let sendDataGrid = {...dataGrid.data, FacultyId: data.facultyData.id, PromotionId: promotionId}
            setDataGrid(sendDataGrid)
          }

          if(dataCb.redirect==="/all-users") {
            dataGrid = await utils.app.getDataGridData('admin-get-all-users', {})
            let sendDataGrid = {...dataGrid.data, FacultyId: data.facultyData.id}
            setDataGrid(sendDataGrid)
          }

          if(dataCb.redirect === '/blocked-users') {
            dataGrid = await utils.app.getDataGridData('admin-get-all-blocked-users', {})
            let sendDataGrid = {...dataGrid.data, FacultyId: data.facultyData.id}
            setDataGrid(sendDataGrid)
          }

          if(dataCb.title === 'Dashboard') {
            setData((previous) => ({...previous, refreshData: true, redirect:dataCb.redirect}))
          } else {
            setData((previous) => ({...previous, redirect:dataCb.redirect}))
          }
          renderSwitch(data.redirect)
      }
  }
  
  const callbackDialog = async (type, dialogData) => {
    if(type === 'close') {
      setDialog({...dialog, open: false, dataToSend: {}})
      setData(state => ({...state, refreshData: true}))
    }
    //Check the validations
    if(type === 'accepted') {
      let ok = true
      if(dialogData.location === '/add-promotion') {
        if(dialogData.dataToSend.hasOwnProperty('year') && dialogData.dataToSend.hasOwnProperty('dateLimitStudents') && dialogData.dataToSend.hasOwnProperty('dateLimitTeachers')) {
          if(utils.validations.validatePromotionYearLength(dialogData.dataToSend.year) && utils.validations.validatePromotionYearRegex(dialogData.dataToSend.year)) {
            if(utils.validations.validateDateRegex(dialogData.dataToSend.dateLimitStudents) && utils.validations.validateYear(dialogData.dataToSend.dateLimitStudents)) {
              if(utils.validations.validateDateRegex(dialogData.dataToSend.dateLimitTeachers) && utils.validations.validateYear(dialogData.dataToSend.dateLimitTeachers)) {
                    try {
                      let finalData = dialogData.dataToSend
                      finalData.FacultyId = data.facultyData.id
                      const addNewPromotion = await utils.user.promotions.add(finalData)
                      setDashboardAlert({isError: true, severity: 'success', textError: stringConstants.error.promotions.success})
                    } catch (error) {
                      ok = false
                      setDashboardAlert({isError: true, severity: 'error', textError: error.message})
                    }}
            } else {
              ok = false
              setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.promotions.invalidDateLimit})
            }
          } else {
            ok = false
            setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.promotions.invalidPromotion})
          }
        } else {
          ok = false
          setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.promotions.invalidData})
        }
      }
      if(dialog.location === 'student-add-project-request') {
        if(
          dialogData.dataToSend.hasOwnProperty('description') &&
          dialogData.dataToSend.hasOwnProperty('name')
        ) {
          if(!utils.validations.validateStringLength(dialogData.dataToSend.name)) {
            if(!utils.validations.validateStringLength(dialogData.dataToSend.description)) {
              try {
                let finalData = {
                  ...dialogData.otherData,
                  name: dialogData.dataToSend.name,
                  description: dialogData.dataToSend.description
                }
                const addNewProjectRequest = await utils.user.projects.add(finalData)
                setDashboardAlert({isError: true, severity: 'success', textError: stringConstants.error.projects.success})
              } catch(error) {
                ok = false
                setDashboardAlert({isError: true, severity: 'error', textError: error.message})
              }
            } else {
              ok = false
              setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.projects.description})
            }
          } else {
            ok = false
            setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.projects.name})
          }
        } else {
          ok = false
          setDashboardAlert({isError: true, severity: 'error', textError: stringConstants.error.projects.noData})
        }
      }

      if(ok) {
        setDialog({...dialog, open: false, backdrop: false, dataToSend: {}})
        setData(state => ({...state, refreshData: true}))
      }
    }
  }

  const renderSwitch = (redirect) => {
      switch(redirect) {
        //Admin
        case "/all-users":
          return <AllUsers data = {dataGrid}/>
        case "/blocked-users":
          return <BlockedUsers data = {dataGrid}/>
        //case '/users-online':
        //  break
        case "/add-users":
          return <AddUsers data = {dataGrid}/>
        case "/add-faculty":
          return <AddFaculties data = {dataGrid}/>
        //Secretary
        case "/add-students":
          return <AddStudents data = {dataGrid}/>
        case '/add-teachers':
          return <AddTeachers data = {dataGrid}/>
        case '/bachelor-projects':
          return <GetBachelors data = {dataGrid}/>
        case '/disertation-projects':
          return <GetDisertations data = {dataGrid}/>
        case '/no-proj-students':
          return <NoProjectStudents data = {dataGrid} secretaryType= {data.facultyData.secretaries[0].type}/>
        //Student
        case '/my-request':
          return <MyRequests type = {cookies.get('rls')} data = {data.facultyData} callback = {callback}/>
        case '/my-projects':
          return <MyProjects type = {cookies.get('rls')} data = {data.facultyData} callback = {callback}/>
        /*case '/my-project':
          break
        case '/messages':
          break
        //Teachers
        case '/my-students':
          break
        case '/my-projects':
          break
        case '/messages':
          break*/
        default:
          return <DashboardContent type = {cookies.get('rls')} data = {data.facultyData} callback = {callback}/>
      }
    }
  
    const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setDashboardAlert(previous => ({...previous, isError: false, textError: ""}))
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    data.isRender ? (
      <Box>
        <Backdrop open={true}>
          <CircularProgress/>
        </Backdrop>
      </Box>
    ) : (
        <Box sx={{ display: 'flex', height:"100vh", overflow: 'hidden', overflowY: 'scroll'}}>
          <CssBaseline />
          <MainAppBar appName = {data.appData.appName} width = {drawerWidth} />
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, boxShadow: 2}} aria-label="mailbox folders">
              <Drawer variant="temporary" open={false} onClose={handleDrawerToggle} ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                  container: document.getElementById('drawer-container')
                  }}
                  sx={{
                      display: { xs: 'block', sm: 'none' },
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              >
                <AppMenu logoPath = {data.isRender ? '' : data.appData.logoPath} callback={callback}/>
              </Drawer>
              <Drawer
              variant="permanent"
              sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
              >
                  <AppMenu logoPath = {data.isRender ? '' : data.appData.logoPath} callback={callback}/>
              </Drawer>
          </Box>
          <Box component="main" sx={{display: 'flex', flexGrow: 1, width: {sm:`calc(100% - ${drawerWidth}px)`}, height: '100%', flexDirection: 'column' }}>
              <Toolbar />
              <DialogForm data = {dialog} callback = {callbackDialog} />
              {renderSwitch(data.redirect)}
          </Box>
          <Snackbar open={dashboardAlert.isError} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={dashboardAlert.severity} sx={{ width: '100%' }}>
              {dashboardAlert.textError}
            </Alert>
          </Snackbar>
      </Box>
    )
    
  )
}

