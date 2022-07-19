
import './App.css';
import React from 'react'
import Setup from './Components/Setup/Setup';
import Login from './Components/Login/Login';
import LandingLoading from './Components/Loading/LandingLoading';
import getData from './Components/utils/getData'
import { Route, Routes, useNavigate } from 'react-router-dom';
import * as API_URL from './Components/utils/constants/urlConstants'
import hostURL from './Components/utils/constants/hostURL'
import axios from 'axios';
import Dashboard from './Components/Dashboard/Dashboard';
import Cookies from 'universal-cookie';

const BASE_URL = hostURL()
const cookies = new Cookies()

function App() {
  let navigate = useNavigate()

  React.useEffect(async () => {
    const INIT_URL = BASE_URL + API_URL.GET_APP_IS_SET
    await axios.get(INIT_URL)
    .then((res) => {
      if(res.data) {
        //get data from Cookies
        const cookieData = (cookies.getAll())
        if (cookieData.hasOwnProperty('s')) {
          const GET_PROFILE_URL = BASE_URL + API_URL.API_GET_PROFILE_ENDPOINT + getData.getIDFromToken(cookieData.s)
          axios.get(GET_PROFILE_URL, {headers: {"Authorization" : `Bearer ${cookieData.s}`}} )
          .then((res) => {
              navigate('/dashboard')
          })
          .catch((res) => {
            cookies.remove('s')
            navigate('/login')
          })
        } else {
          navigate('/login')
        }
      }else {
        navigate('/setup')
      }
    })
  }, [])


  return (
    <Routes>
        <Route path = '/' element={<LandingLoading/>}/>
        <Route path = '/login' element={ <Login/>}/>
        <Route path = '/setup' element={ <Setup/>}/>
        <Route path = '/dashboard' element={ <Dashboard/> }/>
    </Routes>

  );
}

export default App;
