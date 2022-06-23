import * as React from 'react'
import { Typography, Box, Input, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, Autocomplete, TextField, Snackbar, Alert } from '@mui/material'
import FileUpload from '@mui/icons-material/FileUpload'
import DataTable from '../recycled-components/DataTable'
import Cookies from 'universal-cookie'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'
import axios from 'axios'
import { Add, GroupAdd } from '@mui/icons-material'
import setupUtil from '../../../../Setup/utils/setupUtil'
import XLSX from 'xlsx'
import * as DATATABLE from '../../../../utils/constants/tableConstants'
import utils from './utils/utils'


let jsonUserData = {
    id: 0,
    email : "",
    password: "",
    roleName: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
}

let rows = []

export default function AddUsers(props) {
    const [isRender, setIsRender] = React.useState(true)
    const [allUsers, setAllUsers] = React.useState({columns: DATATABLE.ADD_USERS_TABLE_COLUMNS, rows: rows})
    const [selectedUsers, setSelectedUsers] = React.useState()
    const [isAddedFile, setIsAddedFile] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [dataForSend, setDataForSend] = React.useState()
    const [rowData, setRowData] = React.useState([])
    const [addUserAlert, setAddUserAlert] = React.useState({open: false, severity: "success", text: ''})

    //For validation fields
    const [isFirstNameInvalid, setIsFirstNameInvalid] = React.useState({state: false, text: ""})
    const [isLasttNameInvalid, setIsLastNameInvalid] = React.useState({state: false, text: ""})
    const [isEmailInvalid, setIsEmailInvalid] = React.useState({state: false, text: ""})
    const [isPasswordInvalid, setIsPasswordInvalid] = React.useState({state: false, text: ""})
    const [isPhoneInvalid, setIsPhoneInvalid] = React.useState({state: false, text: ""})

    const userRoles = [
        { title: 'Administrator', roleName: 'ADMIN' },
        { title: 'Secretariat', roleName: 'SECRETARY' },
        { title: 'Student', roleName: 'STUDENT' },
        { title: 'Profesor', roleName: 'TEACHER'}
    ]

    const defaultProps = {
        options: userRoles,
        getOptionLabel: (option) => option.title
    }



    const cookies = new Cookies()
    const TOKEN = cookies.get('s')
    const ID = cookies.get('id')
    const BASE_URL = hostURL()
    const GET_DATA_URL = BASE_URL + API_URL.API_GET_ALL_USERS_CONTENT

   React.useEffect(() => {
        if(isRender) {
            setAllUsers({columns: DATATABLE.ADD_USERS_TABLE_COLUMNS, rows: rowData})
        }
        return () => {
            setIsRender(false)
        }
    }, [allUsers])

    const callback = (data) => {
        setSelectedUsers(data)
    }

    const handleRefreshClick = (e) => {
        setIsRender(true)
        axios.get(GET_DATA_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: { id: ID}})
        .then((res) => {
            setAllUsers(res.data)
            setIsRender(false)
        })
        .catch((res) => {
            setAllUsers(res.data)
            setIsRender(false)
        })
    }

    const handleClickOpenAddUser = (e) => {
        e.preventDefault()
        setOpenDialog(true)
    }

    const handleClickCloseAddUser = (e) => {
        e.preventDefault()
        setOpenDialog(false)
    }

    const handleManualAddClick = (e) => {
        e.preventDefault()
        if(isRender) rows = []
        
        jsonUserData.id = rows.length+1
        const newRow = JSON.parse(JSON.stringify(jsonUserData))
        rows = [...rows, newRow]
        setAllUsers({columns: DATATABLE.ADD_USERS_TABLE_COLUMNS, rows: rows})
        setOpenDialog(false)   
    }

    const handleUploadExcel = (e) => {
        e.preventDefault()
        if(isRender) rows = []
        if(e.target.files) {
            const reader = new FileReader()
            reader.onload = (e) => {
                let tempJson = utils.xlsxToJSON(e)     
                for(let i=0;i<tempJson.length; i++){   
                    let tempUserData = { id: 0, email : "", password: "", roleName: "", firstName: "", lastName: "", phoneNumber: "" }                                    
                    for(const key in tempJson[i]) {
                        tempUserData[key] = tempJson[i][key]
                    }
                    tempUserData.id = rows.length+1
                    const newRow = JSON.parse(JSON.stringify(tempUserData))
                    rows = [...rows, newRow]
                }
                setAllUsers({columns: DATATABLE.ADD_USERS_TABLE_COLUMNS, rows: rows})
            }
            reader.readAsArrayBuffer(e.target.files[0])
        }
    }

    const handleClickRegisterUsers = (e) => {
        let pendingDelete = []
        rows.forEach((item,i) => {
            const userBody = {
                email: item.email,
                password: item.password,
                roleName: item.roleName,
                profile: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    phoneNumber: item.phoneNumber
                }
            }
            axios.post('http://localhost:3001/api-dev/users/register', userBody)
            .then((results) => {
                console.log(pendingDelete)
                pendingDelete = [...pendingDelete, i]
                
            })
            .catch((message) => {
                console.log(message)
            })
        })
        let tempRows = []
        console.log(pendingDelete)
        for(let j=0;j<pendingDelete.length;j++) {
            rows.forEach((item, i) => {
                if(!(i===pendingDelete[j])) {
                    tempRows = [...tempRows,item]
                }
            })
        }
        if(tempRows.length > 0) {
            rows = [...tempRows]
        }
        if(rows.length === 0){
            setAddUserAlert({open:true, severity: 'success', text: 'Utilizatorii au fost inregistrati cu succes'})
        } else {
            setAddUserAlert({open:true, severity: 'error', text: 'Nu toti utilizatorii au fost inregistrati!'})
        }
        setAllUsers({columns: DATATABLE.ADD_USERS_TABLE_COLUMNS, rows: rows})
    }

    const handleCloseSnackbar = (e) => {
        setAddUserAlert({open: false, severity: "success", text: ''})
    }

    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data)
        {
            case "Parola":
                if(setupUtil.validatePassword(e.target.value)) {
                    setIsPasswordInvalid({state: false, text: ""})
                    jsonUserData.password = e.target.value
                } else {
                    setIsPasswordInvalid({state: true, text: "Parola trebuie sa contina minim 8 caractere impreuna cu urmatorul set de caractere: litera mare, litera mica, caracter special"})
                }
                break
            case "Nume":
                if(setupUtil.validateName(e.target.value)){
                    setIsLastNameInvalid({state: false, text: ""})
                    jsonUserData.lastName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Numele de familie trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Prenume":
                if(setupUtil.validateFirstName(e.target.value)){
                    setIsFirstNameInvalid({state: false, text: ""})
                    jsonUserData.firstName = e.target.value
                } else {
                    setIsLastNameInvalid({state: true, text: "Prenumele trebuie sa contina minimum 3 caractere"})
                }
                break
            case "Telefon":
                if(setupUtil.validatePhoneNumber(e.target.value)) {
                    setIsPhoneInvalid({state: false, text: ""})
                    jsonUserData.phoneNumber = e.target.value
                } else {
                    setIsPhoneInvalid({state: true, text: "Numarul de telefon introdus este invalid"})
                }
                break
            default:
                if(setupUtil.validateEmail(e.target.value)) {
                    setIsEmailInvalid({state: false, text: ""})
                    jsonUserData.email = e.target.value
                } else {
                    setIsEmailInvalid({state: true, text: "Email-ul este invalid"})
                }
                break
        }
    }



    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{height: '100%'}}>
            <Box gridColumn="span 12">
                <Typography variant='h4'>
                    Adaugare utilizator
                </Typography>
            </Box>
            <Box gridColumn="span 12" minHeight={500} >
                <label htmlFor="contained-button-file">
                    <Input style={{display: 'none'}} accept="image/*" id="contained-button-file" type="file" onChange={handleUploadExcel}/>
                    <Button variant="text" style={isAddedFile === false ? {display: 'inline-flex'} : {display: 'none'}} component="span">
                        <FileUpload />
                        Incarca fisier Excel
                    </Button>
                </label>
                <Button variant="text" onClick={handleClickOpenAddUser}>
                    <Add/>
                    Adauga un nou utilizator
                </Button> 
                <Button variant="text" onClick={handleClickRegisterUsers}>
                    <GroupAdd/>
                    Inregistreaza utilizatorii
                </Button>
                <div style={{ display: 'flex', height: '100%'}}>
                    <div style={{ flexGrow: 1 }}>
                        <DataTable data = {allUsers} isSelectable = {false} callback={callback}/>
                    </div>
                </div>
            </Box>
            
            <Dialog open={openDialog} onClose={handleClickCloseAddUser}>
                <DialogTitle>
                    Adauga un nou utilizator
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pentru a adauga un nou utilizator este important ca toate datele sa fie completate
                    </DialogContentText>
                    <Divider sx={{mt:1, mb:1}}/>
                    <DialogContentText sx={{mt:1, mb: 1, color: '#1976d2'}}>
                        Date utilizator
                    </DialogContentText>
                    <TextField error = {isEmailInvalid.state} helperText = {isEmailInvalid.text} fullWidth required variant='standard' id="outlined-required1" label="Email" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isPasswordInvalid.state} helperText = {isPasswordInvalid.text} fullWidth variant='standard' id="outlined-password-input" label="Parola" type="password" autoComplete="current-password" margin="normal" onChange={textFieldHandler}/>
                    <Autocomplete
                        onChange={(event,value) => jsonUserData.roleName = value.roleName}
                        {...defaultProps}
                        id="auto-complete"
                        autoComplete
                        includeInputInList
                        renderInput={(params) => (
                            <TextField {...params} label="Rol utilizator" variant="standard" />
                        )}
                    />
                    <Divider sx={{m:1, mb:1}}/>
                    <DialogContentText  sx={{color: '#1976d2'}}>
                        Date profil utilizator
                    </DialogContentText>
                    <TextField error = {isLasttNameInvalid.state} helperText = {isLasttNameInvalid.text} fullWidth variant='standard' required id="outlined-required2" label="Nume" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isFirstNameInvalid.state} helperText = {isFirstNameInvalid.text} fullWidth variant='standard' required id="outlined-required3" label="Prenume" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isPhoneInvalid.state} helperText = {isPhoneInvalid.text} fullWidth variant='standard' required id="outlined-required4" label="Telefon" margin="normal" onChange={textFieldHandler}/>
                </DialogContent>
                <DialogActions>
                    <Button variant = "text" onClick={handleClickCloseAddUser}>Anuleaza</Button>
                    <Button variant = "text" onClick={handleManualAddClick.bind(this)}>Adauga</Button> 
                </DialogActions>
            </Dialog>

            <Snackbar open={addUserAlert.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={addUserAlert.severity} sx={{ width: '100%' }}>
                        {addUserAlert.text}
                    </Alert>
            </Snackbar>
        </Box>
    )
}