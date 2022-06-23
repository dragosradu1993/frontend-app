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


let jsonFacultyData = {
    id: 0,
    name: "",
    address: "",
    phoneNumber: "",
    shortName: ""
}

let rows = []

export default function AddFaculties(props) {
    const [isRender, setIsRender] = React.useState(true)
    const [allFaculties, setAllFaculties] = React.useState({columns: DATATABLE.ADD_FACULTIES_TABLE_COLUMNS, rows: rows})
    const [selectedFaculties, setSelectedFaculties] = React.useState()
    const [isAddedFile, setIsAddedFile] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [rowData, setRowData] = React.useState([])
    const [addFacultyAlert, setAddFacultyAlert] = React.useState({open: false, severity: "success", text: ''})

    //For validation fields
    const [isNameInvalid, setIsNameInvalid] = React.useState({state: false, text: ""})
    const [isAddressInvalid, setIsAddressInvalid] = React.useState({state: false, text: ""})
    const [isPhoneInvalid, setIsPhoneInvalid] = React.useState({state: false, text: ""})
    const [isShortNameInvalid, setIsShortNameInvalid] = React.useState({state: false, text: ""})

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
    const GET_ALL_DATA = BASE_URL + API_URL.API_GET_FACULTIES
    const GET_DATA = BASE_URL + API_URL.API_GET_FACULTY
    const ADD_DATA = BASE_URL + API_URL.API_ADD_FACULTY

   React.useEffect(() => {
        if(isRender) {
            setAllFaculties({columns: DATATABLE.ADD_FACULTIES_TABLE_COLUMNS, rows: rowData})
        }
        return () => {
            setIsRender(false)
        }
    }, [allFaculties])

    const callback = (data) => {
        setSelectedFaculties(data)
    }

    const handleRefreshClick = (e) => {
        setIsRender(true)
        axios.get(GET_DATA, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: { id: ID}})
        .then((res) => {
            setAllFaculties(res.data)
            setIsRender(false)
        })
        .catch((res) => {
            setAllFaculties(res.data)
            setIsRender(false)
        })
    }

    const handleClickOpenAddFaculty = (e) => {
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
        
        jsonFacultyData.id = rows.length+1
        const newRow = JSON.parse(JSON.stringify(jsonFacultyData))
        rows = [...rows, newRow]
        setAllFaculties({columns: DATATABLE.ADD_FACULTIES_TABLE_COLUMNS, rows: rows})
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
                    let tempFacultyData = { id: 0, name: "", address: "", phoneNumber: "", shortName: "" }                                    
                    for(const key in tempJson[i]) {
                        tempFacultyData[key] = tempJson[i][key]
                    }
                    tempFacultyData.id = rows.length+1
                    const newRow = JSON.parse(JSON.stringify(tempFacultyData))
                    rows = [...rows, newRow]
                }
                setAllFaculties({columns: DATATABLE.ADD_FACULTIES_TABLE_COLUMNS, rows: rows})
            }
            reader.readAsArrayBuffer(e.target.files[0])
        }
    }

    const handleClickRegisterFaculties = (e) => {
        let pendingDelete = []
        rows.forEach((item,i) => {
            const facultyBody = {
                name: item.name,
                address: item.address,
                phoneNumber: item.phoneNumber,
                shortName: item.shortName
            }
            axios.post(ADD_DATA, facultyBody, {headers: {"Authorization" : `Bearer ${TOKEN}`}})
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
            setAddFacultyAlert({open:true, severity: 'success', text: 'Facultatile au fost adaugate cu succes'})
        } else {
            setAddFacultyAlert({open:true, severity: 'error', text: 'Nu toate facultatile au fost inregistrate!'})
        }
        setAllFaculties({columns: DATATABLE.ADD_FACULTIES_TABLE_COLUMNS, rows: rows})
    }

    const handleCloseSnackbar = (e) => {
        setAddFacultyAlert({open: false, severity: "success", text: ''})
    }

    const textFieldHandler = (e) => {
        switch (e.target.labels[0].firstChild.data)
        {
            case "Nume Facultate":
                if(setupUtil.validateFacultyField(e.target.value)) {
                    setIsNameInvalid({state: false, text: ""})
                    jsonFacultyData.name = e.target.value
                } else {
                    setIsNameInvalid({state: true, text: "Numele facultatii trebuie sa contina minim 2 caractere"})
                }
                break
            case "Adresa Facultate":
                if(setupUtil.validateFacultyField(e.target.value)){
                    setIsAddressInvalid({state: false, text: ""})
                    jsonFacultyData.address = e.target.value
                } else {
                    setIsAddressInvalid({state: true, text: "Adresa facultatii trebuie sa contina minim 2 caractere"})
                }
                break
            case "Telefon":
                if(setupUtil.validatePhoneNumber(e.target.value)) {
                    setIsPhoneInvalid({state: false, text: ""})
                    jsonFacultyData.phoneNumber = e.target.value
                } else {
                    setIsPhoneInvalid({state: true, text: "Numarul de telefon introdus este invalid"})
                }
                break
            case "Cod Facultate":
                if(setupUtil.validateFacultyField(e.target.value)) {
                    setIsShortNameInvalid({state: false, text: ""})
                    jsonFacultyData.shortName = e.target.value
                } else {
                    setIsShortNameInvalid({state: true, text: "Codul facultatii trebuie sa contina minim 2 caractere"})
                }
                break                
        }
    }



    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{height: '100%'}}>
            <Box gridColumn="span 12">
                <Typography variant='h4'>
                    Adaugare facultate
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
                <Button variant="text" onClick={handleClickOpenAddFaculty}>
                    <Add/>
                    Adauga un noua facultate
                </Button> 
                <Button variant="text" onClick={handleClickRegisterFaculties}>
                    <GroupAdd/>
                    Inregistreaza facultatile
                </Button>
                <div style={{ display: 'flex', height: '100%'}}>
                    <div style={{ flexGrow: 1 }}>
                        <DataTable data = {allFaculties} isSelectable = {false} callback={callback}/>
                    </div>
                </div>
            </Box>
            
            <Dialog open={openDialog} onClose={handleClickCloseAddUser}>
                <DialogTitle>
                    Adauga o noua facultate
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pentru a adauga o noua facultate trebuie completate informatiile de mai jos
                    </DialogContentText>
                    <Divider sx={{mt:1, mb:1}}/>
                    <DialogContentText sx={{mt:1, mb: 1, color: '#1976d2'}}>
                        Date facultate
                    </DialogContentText>
                    <TextField error = {isNameInvalid.state} helperText = {isNameInvalid.text} fullWidth required variant='standard' id="outlined-required1" label="Nume Facultate" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isAddressInvalid.state} helperText = {isAddressInvalid.text} fullWidth variant='standard' id="outlined-required2" label="Adresa Facultate" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isPhoneInvalid.state} helperText = {isPhoneInvalid.text} fullWidth variant='standard' required id="outlined-required3" label="Telefon" margin="normal" onChange={textFieldHandler}/>
                    <TextField error = {isShortNameInvalid.state} helperText = {isShortNameInvalid.text} fullWidth variant='standard' required id="outlined-required4" label="Cod Facultate" margin="normal" onChange={textFieldHandler}/>
                </DialogContent>
                <DialogActions>
                    <Button variant = "text" onClick={handleClickCloseAddUser}>Anuleaza</Button>
                    <Button variant = "text" onClick={handleManualAddClick.bind(this)}>Adauga</Button> 
                </DialogActions>
            </Dialog>

            <Snackbar open={addFacultyAlert.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={addFacultyAlert.severity} sx={{ width: '100%' }}>
                        {addFacultyAlert.text}
                    </Alert>
            </Snackbar>
        </Box>
    )
}