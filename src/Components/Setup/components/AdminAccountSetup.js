import * as React from 'react'
import Box from '@mui/material/Box';
import { Typography, Divider, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import setupUtil from '../utils/setupUtil';

const useStyles = makeStyles({
    setupFields: {
        width: "100%",
        display: "block",
        left: '50'
    },
    adminAccount: {

    }
})

const adminFields = {
    lastName: "",
    firstName: "",
    email: "",
    password: ""
}

export default function AdminAccountSetup({callback}) {
    const classes = useStyles()

    const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState({state: false, text: ""})
    const [isLasttNameInvalid, setIsLastNameInvalid] = React.useState({state: false, text: ""})
    const [isEmailInvalid, setIsEmailInvalid] = React.useState({state: false, text: ""})
    const [isPasswordInvalid, setIsPasswordInvalid] = React.useState({state: false, text: ""})
    const [isPhoneInvalid, setIsPhoneInvalid] = React.useState({state: false, text: ""})

    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data)
        {
            case "Parola":
                if(setupUtil.validatePassword(e.target.value)) {
                    setIsPasswordInvalid({state: false, text: ""})
                    adminFields.password = e.target.value
                } else {
                    setIsPasswordInvalid({state: true, text: "Parola trebuie sa contina minim 8 caractere impreuna cu urmatorul set de caractere: litera mare, litera mica, caracter special"})
                }
                
                break
            case "Nume":
                if(setupUtil.validateName(e.target.value)){
                    setIsLastNameInvalid({state: false, text: ""})
                    adminFields.lastName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Numele de familie trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Prenume":
                if(setupUtil.validateFirstName(e.target.value)){
                    setIsFirstNameInvalid({state: false, text: ""})
                    adminFields.firstName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Prenumele trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Telefon":
                if(setupUtil.validatePhoneNumber(e.target.value)) {
                    setIsPhoneInvalid({state: false, text: ""})
                    adminFields.phoneNumber = e.target.value
                } else {
                    setIsPhoneInvalid({state: true, text: "Numarul de telefon introdus este invalid"})
                }
                break
            default:
                if(setupUtil.validateEmail(e.target.value)) {
                    setIsEmailInvalid({state: false, text: ""})
                    adminFields[String(e.target.labels[0].firstChild.data).toLowerCase()] = e.target.value
                } else {
                    setIsEmailInvalid({state: true, text: "Email-ul este invalid"})
                }
                break
        }
        callback(adminFields)
    }


    return(
        <Box sx={{ width: '100%' }}>
            <Box>
                <Typography m={2}>
                    Pentru a merge mai departe este necesara crearea contului de admin pentru gestionarea aplicatiei.
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Box sx={{m: 2, display: 'block', left: '50'}}>
                <TextField error = {isLasttNameInvalid.state} helperText = {isLasttNameInvalid.text} fullWidth required id="outlined-required" label="Nume" margin="normal" onChange={textFieldHandler}/>
                <TextField error = {isFirstNameInvalid.state} helperText = {isFirstNameInvalid.text} fullWidth required id="outlined-required1" label="Prenume" margin="normal" onChange={textFieldHandler}/>
                <TextField error = {isPhoneInvalid.state} helperText = {isPhoneInvalid.text} fullWidth required id="outlined-required2" label="Telefon" margin="normal" onChange={textFieldHandler}/>
                <TextField error = {isEmailInvalid.state} helperText = {isEmailInvalid.text} fullWidth required id="outlined-required3" label="Email" margin="normal" onChange={textFieldHandler}/>
                <TextField error = {isPasswordInvalid.state} helperText = {isPasswordInvalid.text} fullWidth id="outlined-password-input" label="Parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
            </Box>
        </Box>
    )
}