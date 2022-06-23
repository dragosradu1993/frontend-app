import * as React from 'react'
import Box from '@mui/material/Box';
import { Typography, Divider, TextField, Button, Input } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import * as API_URL from '../../utils/constants/urlConstants'
import hostURL from '../../utils/constants/hostURL';

const useStyles = makeStyles({
    setupFields: {
        width: "100%",
        display: "block",
        left: '50'
    },
    adminAccount: {

    }
})

const appInfo = {
    name: "",
    logoName: "",
    path: ""
}

export default function AppInfoSetup({callback}) {
    const BASE_URL = hostURL()
    const UPLOAD_URL = BASE_URL + API_URL.UPLOAD_URL + `?type=logo&env=${process.env.REACT_APP_BASE_URL}`
    const GET_LOGO_URL = BASE_URL + API_URL.GET_LOGO_URL
    console.log(URL)
    const [selectedFile, setSelectedFile] = React.useState()
    const [isSelectedLogo, setIsSelectedLogo] = React.useState({state: false})
    const [isUploadedLogo, setIsUploadedLogo] = React.useState({state: false, disabled: false, text: "Incarca", color: 'primary'})

    const textFieldHandler = (e) => {
        appInfo.name = e.target.value
        callback(appInfo)
    }

    const uploadInputFieldHandler = (e) => {
        console.log(e.target.files[0])
        setSelectedFile(e.target.files[0])
        console.log(selectedFile)
        appInfo.logoName = e.target.files[0].name
        callback(appInfo)
        setIsSelectedLogo({state:true})
    }

    const uploadHandler = (e) => {
        const data = new FormData() 
        data.append('file', selectedFile)
        axios.post(UPLOAD_URL, data)
        .then(res => { // then print response status
            setIsUploadedLogo({state: true, disabled: true, text: 'Incarcat', color: 'success'})
            axios.get(GET_LOGO_URL)
            .then(res => {
                appInfo.path = res.data[0].url
                callback(appInfo)
            })
        })
    }


    return(
        <Box sx={{ width: '100%' }}>
            <Box>
                <Typography m={2}>
                    Pentru a merge mai departe sunt necesare introducerea unor informatii despre aplicatie.
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Box sx={{m: 2, display: 'block', left: '50'}}>
                <TextField fullWidth required id="outlined-required" label="Nume aplicatie" margin="normal" onChange={textFieldHandler}/>
            </Box>
            <Box sx={{m: 2, display: 'block', left: '50'}}>
                <label htmlFor="contained-button-file">
                    <Input style={{display: 'none'}} accept="image/*" id="contained-button-file" type="file" onChange={uploadInputFieldHandler}/>
                    <Button variant="contained" style={isSelectedLogo.state === false ? {display: 'inline-flex'} : {display: 'none'}} component="span">Adauga logo</Button>
                </label>
                <Button variant="contained" style={isSelectedLogo.state === true ? {display: 'inline-flex'} : {display: 'none'}} color={isUploadedLogo.color} disabled = {isUploadedLogo.disabled} onClick={uploadHandler}>{isUploadedLogo.text}</Button>
            </Box>
        </Box>
    )
}