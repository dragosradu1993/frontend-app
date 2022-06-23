import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import { Autocomplete, Typography, Divider, TextField, Grid, Paper, Backdrop, CircularProgress, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import getData from '../utils/getData';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import * as API_URL from '../utils/constants/urlConstants'
import hostURL from '../utils/constants/hostURL'
import AppLogo from './components/AppLogo';
import LoginTitle from './components/LoginTitle';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import LandingLoading from '../Loading/LandingLoading';
import setupUtil from '../Setup/utils/setupUtil';


const authJSON = {
    email: "",
    password: ""
}
const dataToSend = {
    credentials: {
        password: ""
    },
    secretary: {
        type: "",
        facultyId: ""
    }
}

const facultiesListAutocomplete = []

let rls = ''
export default function Login({callback}) {
    const [isRender, setIsRender] = React.useState(true)
    const [loginData, setLoginData] = React.useState({})
    const [logoImage, setLogoImage] = React.useState()
    const [loginError, setLoginError] = React.useState({isError: false, textError: ""})
    const [loginLoading, setLoginLoading] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [profile, setProfile] = React.useState()
    const [openDialog,setOpenDialog] = React.useState(false)
    const [isPasswordInvalid, setIsPasswordInvalid] = React.useState({state: false, text: ""})
    const [isRepeatPasswordInvalid, setIsRepeatPasswordInvalid] = React.useState({state: false, text: ""})
    const [displayMore, setDisplayMore] = React.useState(false)
    const cookies = new Cookies()
    let navigate = useNavigate()

    const secretaryType = [
        { title: 'Licenta', type: 'LICENTA' },
        { title: 'Master', type: 'MASTER' },
    ]

    const defaultProps = {
        options: secretaryType,
        getOptionLabel: (option) => option.title
    }

    const defaultPropsFaculties = {
        options: facultiesListAutocomplete,
        getOptionLabel: (option) => option.title  
    }


    const newPwd = {
        password: ""
    }

    let tempPwd = ''


    const BASE_URL = hostURL()
    const LOGIN_URL = BASE_URL + API_URL.API_LOGIN_ENDPOINT
    const GET_INFO_URL = BASE_URL + API_URL.GET_APP_INFO
    const CHANGE_PWD_URL = BASE_URL + API_URL.API_CHANGE_PWD
   
   

    useEffect(() => {
        if(isRender) {
            axios.get(GET_INFO_URL)
            .then((res) => {
                setLoginData(res.data)
                
            })
            setLoading(false)
        }
        return () => {
            setIsRender(false)
        }
    }, [loginData])
    
    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data){
            case "Email":
                authJSON.email = e.target.value
                break
            case "Parola":
                authJSON.password = e.target.value
                break
            default:
                //de reverificat
                console.log(authJSON)
                if(setupUtil.validatePassword(e.target.value)){
                    
                    if(e.target.value === authJSON.password) {
                        setIsPasswordInvalid({state:true, text: 'Parola introdusa a mai fost utilizata. Te rog seteaza-ti o noua parola!'})
                    } else {
                        setIsPasswordInvalid({state:false, text: ''})
                        if(e.target.id === 'outlined-password-input2') {
                            tempPwd = e.target.value
                        }
                        if(e.target.id === 'outlined-password-input2' && tempPwd === e.target.value) {
                            setIsRepeatPasswordInvalid({state:true, text: 'Parolele nu corespund. Te rog reintrodu parola!'})
                        } else {
                            setIsRepeatPasswordInvalid({state:false, text: ''})
                            dataToSend.credentials.password = e.target.value
                        }
                    }
                } else {
                    if(e.target.id === 'outlined-password-input2') {
                        setIsRepeatPasswordInvalid({state:true, text: '"Parola trebuie sa contina minim 8 caractere impreuna cu urmatorul set de caractere: litera mare, litera mica, caracter special'})
                    }
                }
                console.log(dataToSend)
                break

        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setLoginError({isError: false, textError: ""});
    }
    
    const handleLogin = (e) => {
        setLoginLoading(true)
        
        axios.post(LOGIN_URL,authJSON)
        .then((res) => {
            if(res.status === 202) {
                setLoginLoading(false)
                setLoginError({isError: true, textError: res.data.details.message})
            }
            if(res.status === 200) {
                const TOKEN = res.data.details.token
                
                cookies.set('s', TOKEN)
                const GET_PROFILE_URL = BASE_URL + API_URL.API_GET_PROFILE_ENDPOINT + getData.getIDFromToken(res.data.details.token)
                axios.get(GET_PROFILE_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}})
                .then((results) => {
                    const profileData = results.data.details.userData.Profile

                    cookies.set('fn', profileData.firstName)
                    cookies.set('ln', profileData.lastName)
                    cookies.set('fulln', `${profileData.firstName} ${profileData.lastName}`)
                    cookies.set('blocked', profileData.userBlocked)
                    cookies.set('id', results.data.details.userData.id)
                    cookies.set('rls', results.data.details.userData.UserRole.roleName)
                    cookies.set('pid', results.data.details.userData.Profile.id)
                    setProfile(results.data.details.userData)
                    rls = results.data.details.userData.UserRole.roleName
                    if(results.data.details.userData.firstLogin) {
                        if(results.data.details.userData.UserRole.roleName === 'SECRETARY') {
                            const GET_FACULTIES_URL = BASE_URL + API_URL.API_GET_FACULTIES
                            axios.get(GET_FACULTIES_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}})
                            .then((results) => {
                                facultiesListAutocomplete = []
                                for(let item in results.data){
                                    let faculty = {id: 0, title: '', shortName: ''}
                                    faculty.id = results.data[item].id
                                    faculty.title = results.data[item].name
                                    faculty.shortName = results.data[item].shortName
                                    facultiesListAutocomplete.push(faculty)
                                }
                            })
                            setDisplayMore(true)
                        } else {
                            setDisplayMore(false)
                        }
                        setOpenDialog(true)
                    } else {
                        setLoginLoading(false)
                        navigate('/dashboard')  
                    }
                })
                .catch((message) => {
                    setLoginLoading(false)
                    setLoginError({isError: true, textError: res.data.details.message})
                }) 
            }
        })
    }

    const handleFirstLogin = (e) => {
        e.stopPropagation()

        if(dataToSend.credentials.password.length > 0){
            
            setLoginError({isError: false, textError: ''})
            axios.post(CHANGE_PWD_URL + `/${cookies.get('id')}/changepwd`, dataToSend.credentials, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { fl: 'true'}})
            .then(() => {
                axios.post(LOGIN_URL, {email: authJSON.email, password: dataToSend.credentials.password})
                .then((results) => {
                    let ok = true
                    const TOKEN = results.data.details.token
                    cookies.set('s', TOKEN)
                    if(rls === 'SECRETARY'){
                        if(dataToSend.secretary.type.length > 0) {
                            axios.post(BASE_URL+API_URL.API_ADD_SECRETARY_TYPE, dataToSend.secretary, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { pid: cookies.get('pid')}})
                            .then((results) => {
                                cookies.set('st', dataToSend.secretary.type)
                                cookies.set('fid', dataToSend.secretary.facultyId)
                            })
                            .catch((message) => {
                                setLoginError({isError: true, textError: message})
                                ok = false
                            })
                        } else {
                            ok = false
                        }
                    }
                    if(ok) {
                        setLoginError({isError: false, textError: ''})
                        setOpenDialog(false)
                        setLoginLoading(false)
                        setDisplayMore(false)
                        navigate('/dashboard') 
                    } else {
                        setLoginError({isError: true, textError: 'Ceva nu a mers bine! Te rog reincearca'})
                    }
                })
            })
            .catch((message) => {
                setLoginError({isError: true, textError: message})
            })
        } else {
            console.log(dataToSend.credentials.password.length)
            setLoginError({isError: true, textError: 'Ceva nu a mers bine! Te rog reincearca'})
        }

    }

    return(
        loading ? (
            <LandingLoading/>
        ) : (
            <Box>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item xs="auto">
                        <AppLogo path={loginData.logoPath} width='50%'/>
                    </Grid>
                    <Grid item xs="auto">
                        <LoginTitle title = {loginData.appName}/>
                    </Grid>
                    <Grid item xs="auto">
                        <Paper elevation={3}>
                            <Box sx={{p: 4, display: 'grid', gridAutoFlow: 'row'}}>
                                <Typography>Va rugam sa introduceti datele dumneavoastra pentru autentificare</Typography>
                                <Divider variant="middle" />
                                <TextField fullWidth id="outlined-required3" label="Email" margin="normal" onChange={textFieldHandler}/>
                                <TextField fullWidth id="outlined-password-input" label="Parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
                                <Button variant="contained" onClick={handleLogin}>Login</Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loginLoading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </Grid>
                <Dialog open={openDialog}>
                    <DialogTitle>
                        Salut {cookies.get('fulln')}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pentru ca esti la prima autentificare, este nevoie completezi campurile de mai jos
                        </DialogContentText>
                        <Divider sx={{p:'1%'}}/>
                        <DialogContentText>
                            Pentru inceput este nevoie sa-ti setezi o noua parola
                        </DialogContentText>
                        <TextField fullWidth id="outlined-password-input2" label="Noua parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
                        <TextField fullWidth id="outlined-password-input3" label="Repeta noua parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
                        <Divider sx={{p:'1%'}}/>
                        {displayMore ? (                    
                            <Box>
                                <DialogContentText>
                                    Alegeti forma de invatamant. Aceasta ulterior poate fi modificata din setarile profilului.
                                </DialogContentText>
                                <Autocomplete
                                    onChange={(event,value) => dataToSend.secretary.type = value.type}
                                    {...defaultProps}
                                    id="auto-complete"
                                    autoComplete
                                    includeInputInList
                                    renderInput={(params) => (
                                        <TextField {...params} label="Forma de invatamant" variant="standard" />
                                    )}
                                />
                                <Divider sx={{p:'1%'}}/>
                                <DialogContentText>
                                    Alegeti facultatea din care faceti parte.
                                </DialogContentText>
                                <Autocomplete
                                    onChange={(event,value) => dataToSend.secretary.facultyId = value.id}
                                    {...defaultPropsFaculties}
                                    id="auto-complete"
                                    autoComplete
                                    includeInputInList
                                    renderInput={(params) => (
                                        <TextField {...params} label="Forma de invatamant" variant="standard" />
                                    )}
                                />

                            </Box>
                        ) : (
                            <Box></Box>
                        )}
                        <DialogActions>
                            <Button variant = 'text' onClick={handleFirstLogin}>OK</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Snackbar open={loginError.isError} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {loginError.textError}
                        </Alert>
                    </Snackbar>
            </Box>

        )
    )
}