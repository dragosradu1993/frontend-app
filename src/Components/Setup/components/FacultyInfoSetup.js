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

const facultyFields = {
    facultyName: "",
    facultyPhone: "",
    facultyAddress: ""
}

export default function FacultyInfoSetup({callback}) {
    const classes = useStyles()
    const [isFacultyNameInvalid, setIsFacultyNameInvalid] = React.useState({state: false, text: ""})
    const [isPhoneInvalid, setIsPhoneInvalid] = React.useState({state: false, text: ""})
    const [isAddressInvalid, setIsAddressInvalid] = React.useState({state: false, text: ""})

    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data)
        {
            case "Nume institutie":
                if(setupUtil.validateName(e.target.value)){
                    setIsFacultyNameInvalid({state: false, text: ""})
                    facultyFields.facultyName = e.target.value
                } else {
                    setIsFacultyNameInvalid({state: true, text: "Numele institutiei trebuie sa contina minim 3 caractere"})
                }
                break
            case "Telefon institutie":
                if(setupUtil.validatePhoneNumber(e.target.value)){
                    setIsPhoneInvalid({state: false, text: ""})
                    facultyFields.facultyPhone = e.target.value
                } else {
                    setIsPhoneInvalid({state: true, text: "Numarul de telefon introdus este invalid"})
                }
                
                break
            case "Adresa institutie":
                    facultyFields.facultyAddress = e.target.value
                break
            default:
                break
        }
        callback(facultyFields)
    }


    return(
        <Box sx={{ width: '100%' }}>
            <Box>
                <Typography m={2}>
                    Acum la final mai sunt necesare cateva informatii despre institutia de invatamant.
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Box sx={{m: 2, display: 'block', left: '50'}}>
                <TextField error = {isFacultyNameInvalid.state} helperText = {isFacultyNameInvalid.text} fullWidth required id="outlined-required" label="Nume institutie" margin="normal" onChange={textFieldHandler}/>
                <TextField error = {isPhoneInvalid.state} helperText = {isPhoneInvalid.text} fullWidth required id="outlined-required1" label="Telefon institutie" margin="normal" onChange={textFieldHandler}/>
                <TextField fullWidth required id="outlined-required2" label="Adresa institutie" margin="normal" onChange={textFieldHandler}/>
            </Box>
        </Box>
    )
}