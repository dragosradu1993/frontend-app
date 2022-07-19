import {Alert, TextField, DialogTitle, Backdrop, DialogContent, Grid, DialogContentText, Box, Divider, Typography, Button, DialogActions, Snackbar, CircularProgress } from '@mui/material'
import axios from 'axios'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import setupUtil from '../../../../Setup/utils/setupUtil'
import hostURL from '../../../../utils/constants/hostURL'
import { API_EDIT_PROFILE, API_PROFILE_RESET_PASSWORD } from '../../../../utils/constants/urlConstants'

let newProfile = {
    firstName: "",
    lastName: "",
    phoneNumber: ""
}

export default function ProfileContent(props) {
    const [profileData, setProfileData] = React.useState({})
    const [isRender, setIsRender] = React.useState(true)
    const [loading,setLoading] = React.useState(true)
    const [editMode, setEditMode] = React.useState(false)
    const [alert, setAlert] = React.useState({severity: 'success', text: '', open: false})

    const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState({state: false, text: ""})
    const [isLasttNameInvalid, setIsLastNameInvalid] = React.useState({state: false, text: ""})
    const [isPhoneInvalid, setIsPhoneInvalid] = React.useState({state: false, text: ""})
    const cookies = new Cookies()
    let navigate = useNavigate()
    
    React.useEffect(() => {
        if(props.data) {
            setProfileData(props.data)
            setLoading(false)
        }
    }, [props])

    const handleEditClick = (e) => {
        e.preventDefault()
        newProfile.firstName = profileData.Profile.firstName
        newProfile.lastName = profileData.Profile.lastName
        newProfile.phoneNumber = profileData.Profile.phoneNumber
        setEditMode(true)
    }

    const textFieldHandler = React.useCallback((e) => {
        switch (e.target.labels[0].firstChild.data)
        {
            case "Nume":
                if(setupUtil.validateName(e.target.value)){
                    setIsLastNameInvalid({state: false, text: ""})
                    newProfile.lastName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Numele de familie trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Prenume":
                if(setupUtil.validateFirstName(e.target.value)){
                    setIsFirstNameInvalid({state: false, text: ""})
                    newProfile.firstName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Prenumele trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Telefon":
                if(setupUtil.validatePhoneNumber(e.target.value)) {
                    setIsPhoneInvalid({state: false, text: ""})
                    newProfile.phoneNumber = e.target.value
                } else {
                    setIsPhoneInvalid({state: true, text: "Numarul de telefon introdus este invalid"})
                }
                break
        }
    }, [isLasttNameInvalid, isFirstNameInvalid, isPhoneInvalid,newProfile])

    const handleCloseEdit = React.useCallback((e) => {
        e.preventDefault()
        setEditMode(false)
    }, [editMode])

    const handleAcceptEdit = React.useCallback((e) => {
        e.preventDefault()
        const EDIT_PROFILE_URL = hostURL() + API_EDIT_PROFILE
        
        axios.post(EDIT_PROFILE_URL, newProfile, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { id: cookies.get('id')}})
        .then((message) => {
            let tempProfileData = profileData
            tempProfileData.Profile.firstName = message.data.details.message.firstName
            tempProfileData.Profile.lastName = message.data.details.message.lastName
            tempProfileData.Profile.phoneNumber = message.data.details.message.phoneNumber
            setProfileData(tempProfileData)
            setEditMode(false)
        })
        .catch((message) => {
            setEditMode(true)
        })
        
    }, [profileData, editMode])

    const handleCloseSnackbar = React.useCallback((e) => {
        e.preventDefault()
        setAlert({severity: 'success', text: '', open: false})
    }, [alert])

    const handleResetPassword = async (e) => {
        e.preventDefault()
        const RESET_PASSWORD = hostURL() + API_PROFILE_RESET_PASSWORD

        await axios.post(RESET_PASSWORD, [], {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
        .then((results) => {
            setAlert(previous => ({...previous, text: results.data.message, open: true}))
            setTimeout(() => {
                const allCookies = cookies.getAll()
                for(let item in allCookies) {
                    cookies.remove(item.toString(), {path: '/'})
                }
                navigate('/login')  
            }, 6000);
        })
        .catch((error) => {
            setAlert(previous => ({...previous, text: error.response.data.message, open: true}))
        })
    }


    return (
        loading ? (
            <div>
                    <Backdrop open={loading}>
                        <CircularProgress/>
                    </Backdrop>

            </div>
            

        ) : 
        (        
            <div>
                <DialogTitle>
                    Profilul tău {profileData.Profile.firstName} {profileData.Profile.lastName}
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                            {editMode ? 
                            (
                                <Box>
                                    <DialogContentText>Editează datele tale de utilizator</DialogContentText>
                                    <Divider sx={{p:'1%'}}/>
                                    <TextField error = {isLasttNameInvalid.state} helperText = {isLasttNameInvalid.text} fullWidth variant='standard' required id="outlined-required2" label="Nume" margin="normal" defaultValue = {profileData.Profile.lastName} onChange={textFieldHandler}/>
                                    <TextField error = {isFirstNameInvalid.state} helperText = {isFirstNameInvalid.text} fullWidth variant='standard' required id="outlined-required3" label="Prenume" margin="normal" defaultValue = {profileData.Profile.firstName} onChange={textFieldHandler}/>
                                    <TextField error = {isPhoneInvalid.state} helperText = {isPhoneInvalid.text} fullWidth variant='standard' required id="outlined-required4" label="Telefon" margin="normal" defaultValue = {profileData.Profile.phoneNumber} onChange={textFieldHandler}/>
                                    <Divider sx={{p:'1%'}}/>
                                    <Button variant = 'text' onClick={handleCloseEdit}>ANULEAZA</Button>
                                    <Button variant = 'text' onClick={handleAcceptEdit}>OK</Button>
                                </Box>
                            ) : (
                                <Box>
                                    <DialogContentText>Datele tale de utilizator</DialogContentText>
                                    <Divider sx={{p:'1%'}}/>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>Email</Typography>
                                        </Grid>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>{profileData.email}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>Rol</Typography>
                                        </Grid>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>{profileData.UserRole.roleName}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>Nume</Typography>
                                        </Grid>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>{profileData.Profile.lastName}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>Prenume</Typography>
                                        </Grid>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>{profileData.Profile.firstName}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>Telefon</Typography>
                                        </Grid>
                                        <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                                            <Typography>{profileData.Profile.phoneNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
                                        <Grid item xs="auto" sx = {{p: '1%'}}>
                                            <Button variant = 'text' onClick={handleEditClick}>Editează profilul</Button>
                                        </Grid>
                                        <Grid item xs="auto" sx = {{p: '1%'}}>
                                            <Button variant = 'text' onClick={handleResetPassword}>Resetează parola</Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity={alert.severity} sx={{ width: '100%' }}>
                            {alert.text}
                        </Alert>
                </Snackbar>
            </div>
        )
    )
}