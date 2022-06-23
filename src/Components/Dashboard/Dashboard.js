import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
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
import AddPromotion from './components/content-components/SecretaryContent/AddPromotion';
import { Backdrop } from '@mui/material';
import SecretaryDataTable from './components/content-components/SecretaryContent/SecretaryDataTable';
import { STUDENTS_TABLE_COLUMNS } from '../utils/constants/tableConstants';

const drawerWidth = 240;
const BASE_URL = hostURL()
const GET_APP_INFO = BASE_URL + API_URL.GET_APP_INFO
const GET_SECRETARY_DATA = BASE_URL + API_URL.API_GET_SECRETARY_TYPE
const GET_ALL_DATA = BASE_URL + API_URL.API_GET_ALL_FACULTY_DATA

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [data, setData] = React.useState({isRender: true, refreshData: true, redirect: 'Dashboard', appData: null, facultyData: null})

  const cookies = new Cookies()

  React.useEffect( () => {
    async function getAppData() {
      let respFacultyData
      const respAppData = await axios.get(GET_APP_INFO)
      const respSecretaryData = await axios.get(GET_SECRETARY_DATA, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { id: cookies.get('pid')}})
      if(respSecretaryData.status === 200) {
        respFacultyData = await axios.get(GET_ALL_DATA, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { id: respSecretaryData.data.results.facultyId, type: cookies.get('rls'), pid: cookies.get('pid')}})
      }
      if(respAppData.status === 200 && respFacultyData.status === 200) {
        setData({...data, isRender: false, refreshData:false, appData: respAppData.data, facultyData: respFacultyData.data})
      }
    }
    getAppData()
  }, [data.refreshData])

  const callback = (redirect) => {
      if(redirect){
        setData((previous) => ({...previous, refreshData: true, redirect:redirect}))
      }
  }


  const renderSwitch = (redirect) => {
    console.log(data)
    switch(redirect) {
      case "Dashboard":
        return <DashboardContent type = {cookies.get('rls')}/>
      case "Toti utilizatorii":
        return <AllUsers/>
      case "Utilizatori blocati":
        return <BlockedUsers/>
      case "Adaugare utilizator":
        return <AddUsers/>
      case "Adaugare Facultate":
        return <AddFaculties/>
      //Secretaries only
      case "Adaugare promotie":
        return <AddPromotion data = {{facultyName: data.facultyData.name, id: data.facultyData.id}} callback={callback}/>
      case "Adaugare studenti":
        return <SecretaryDataTable data = {{
            title: redirect,
            type: 'Students',
            loading: true,
            pageContent: {
                existImportExcel: true,
                existManualAdd: true,
                manualAddLabel: 'Adauga student',
                existRegister: true,
                registerLabel: 'Inregistreaza student',
                existRefresh: true,
                refreshLabel: 'Reimprospateaza'
            },
            toSend: {
                data: null,
                url: null,
                token: null
            },
            promotions: data.facultyData.promotions,
            dataGrid: {
              show:true,
              columns: STUDENTS_TABLE_COLUMNS,
              rows: data.facultyData.promotions[0].Students,
              isSelectable: false,
            },
            isDialog: false,
            dialog: {
                showDialog: false,
                title: '',
                content: {
                    text: '',
                    content: null
                }
            }
        }}/>

    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    data.isRender ? (
      <Box>
        <Backdrop open={true}/>
      </Box>
    ) : (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <MainAppBar appName = {data.appData.appName} width = {drawerWidth} />
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
              <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{
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
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: {sm:`calc(100% - ${drawerWidth}px)`}}}>
              <Toolbar />
              {renderSwitch(data.redirect)}
          </Box>
      </Box>
    )
    
  );
}

