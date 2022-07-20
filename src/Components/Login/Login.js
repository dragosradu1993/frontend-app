import React from 'react'
import { 
    Box,
    Typography, 
    Divider, 
    TextField, 
    Grid, 
    Paper, 
    Backdrop, 
    CircularProgress, 
    Alert, 
    Snackbar,
} from '@mui/material';
import { Button } from '@mui/material';
import axios from 'axios';
import * as API_URL from '../utils/constants/urlConstants'
import hostURL from '../utils/constants/hostURL'
import AppLogo from './components/AppLogo';
import LoginTitle from './components/LoginTitle';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import LandingLoading from '../Loading/LandingLoading';
import DialogForm from '../Dashboard/components/content-components/recycled-components/DialogForm'
import utils from '../utils/utils'
import stringConstants from '../utils/constants/stringConstants';


const authJSON = {
    email: "",
    password: ""
}
export default function Login() {
    const [loginData, setLoginData] = React.useState({})
    const [loginError, setLoginError] = React.useState({isError: false, severity: "error", textError: ""})
    const [loginLoading, setLoginLoading] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [dialog,setDialog] = React.useState()
    const [isEnabledReset, setIsEnabledReset] = React.useState(false)

    const BASE_URL = hostURL()
    const GET_INFO_URL = BASE_URL + API_URL.GET_APP_INFO
    const cookies = new Cookies()
    let navigate = useNavigate()

    React.useEffect(async () => {
        async function getData() {
            axios.get(GET_INFO_URL)
            .then((res) => {
                setLoginData(res.data)
                document.title = res.data.appName
            })
            setLoading(false)
        }

        await getData()
    }, [])
    
    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data){
            case "Email":
                authJSON.email = e.target.value
                break
            case "Parola":
                authJSON.password = e.target.value
                break
        }
    }

    const handleClose = (event, reason) => {
        event.preventDefault()
        if (reason === 'clickaway') {
          return;
        }
    
        setLoginError(previous => ({...previous, isError: false, textError: ""}))
    }
    
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        try {
            const login = await utils.user.authenticate(authJSON)
            const setCookies = await utils.cookies.setCookiesForProfile()
            console.log(login)
            if(!(login.state === 'OK')) {
                const dialogData = await utils.app.getDialogData(login.state)
                setDialog(dialogData.data)
            } else {
                navigate('/dashboard')
            }
        } catch(error) {
            if(error.hasOwnProperty('loginState')) {
                setLoginLoading(false)
                setIsEnabledReset(true)
                setLoginError({isError: !error.loginState, severity: "error", textError: error.message})
            }
            if(error.hasOwnProperty('dialogState')) {
                setLoginLoading(false)
                setLoginError({isError: !error.dialogState, severity: "error", textError: stringConstants.error.atLogin})
            }
            if(error.hasOwnProperty('cookieState')) {
                setLoginLoading(false)
                setLoginError({isError: !error.cookieState, severity: "error", textError: stringConstants.error.atLogin})
            }
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        const dialogData = await utils.app.getDialogData('RESET-PASSWORD')
        console.log(dialogData)
        setDialog(dialogData.data)
    }

    const callback = async (type, data) => {
        console.log(data, type)
        if(type === 'close') {
            utils.cookies.removeCookies()
            setLoginLoading(false)
            setLoginError({isError: true, severity: "error", textError: 'Autentificarea a eșuat! Te rog reîncearcă!'})
            setDialog({...dialog, open: false})
        }
        if(type === 'accepted') {
            if(data.location === 'FIRST-LOGIN' || data.location === 'AFTER-RESET-PASSWORD') {
                //Check passwords
                if (utils.validations.password(data.dataToSend.password)) {
                    if(!utils.validations.isSamePassword(authJSON.password, data.dataToSend.password)) {
                        if(utils.validations.matchPasswords(data.dataToSend.password, data.dataToSend.repeatPassword)) {
                            try {
                                const user = {email: authJSON.email, password: data.dataToSend.password}
                                const changePassword = await utils.user.changePassword(user)
                                const login = await utils.user.authenticate(user)
                                const setCookies = await utils.cookies.setCookiesForProfile()

                                //Check secretary
                                if(cookies.get('rls') === 'SECRETARY' && data.location === 'FIRST-LOGIN') {
                                    if(data.dataToSend.hasOwnProperty('facultyId') && data.dataToSend.hasOwnProperty('type')) {
                                        const secretaryType = await utils.user.secretary.setType(data.dataToSend)
                                        utils.cookies.setCookiesForSecretary(data.dataToSend)
                                    } else {
                                        setLoginError({isError:true, severity: "error", textError: stringConstants.error.atLogin})
                                    }
                                    navigate('/dashboard')
                                } else {
                                    navigate('/dashboard')
                                }
                                
                            } catch (error) {
                                setLoginError({isError:true, severity: "error", textError: error.message})
                            }   
                        } else {
                            setLoginError({isError:true, severity: "error", textError: stringConstants.error.missmatchPassword})
                        }
                    } else {
                        setLoginError({isError:true, severity: "error", textError: stringConstants.error.samePassword})
                    }

                } else {
                    setLoginError({isError:true, severity: "error", textError: stringConstants.error.invalidPassword})
                }
            }
            if(data.location === 'RESET-PASSWORD') {
                if(utils.validations.email(data.dataToSend.email)) {
                    try {
                        const resetPassword = await utils.user.resetPassword(data.dataToSend.email)
                        if(resetPassword) {
                            setLoginError({isError:true, severity: "success", textError: resetPassword.message})
                            setLoginLoading(false)
                            setDialog({...dialog, open: false})
                        }
                    } catch (error) {
                        setLoginError({isError:true, severity: "error", textError: error.message})
                    }
                }
            }
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
                                <Typography>Vă rugăm să introduceți datele dumneavoastră pentru autentificare</Typography>
                                <Divider variant="middle" />
                                <TextField fullWidth id="outlined-required3" label="Email" margin="normal" onChange={textFieldHandler}/>
                                <TextField fullWidth id="outlined-password-input" label="Parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
                                <Button variant="contained" onClick={handleLogin}>Autentificare</Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs="auto">
                        <Button onClick={handleResetPassword}>Resetează parola</Button>
                    </Grid>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loginLoading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </Grid>
                <DialogForm data = {dialog} callback = {callback} />
                <Snackbar open={loginError.isError} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={loginError.severity} sx={{ width: '100%' }}>
                            {loginError.textError}
                        </Alert>
                </Snackbar>
                
            </Box>

        )
    )
}