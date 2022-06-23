import * as React from 'react'
import {Dialog, DialogTitle, DialogContent, DialogContentText, Box, TextField, DialogActions, Button} from '@mui/material'
import axios from 'axios'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'
import Cookies from 'universal-cookie'

let promotion = 0

export default function AddPromotion(props) {
    const [data, setData] = React.useState({
        id: 0,
        facultyName: '',
        openDialog: false,
        defaultYear: new Date().getFullYear(),
        toSend: null,
        validationInput: {state: false, text: "", disableOkButton: true}
    })
    const cookies = new Cookies()

    React.useEffect(() => {
        if(props.data.facultyName.length > 0) {
            setData({...data, id: props.data.id, facultyName: props.data.facultyName, openDialog:true})
        }
    }, [props.data])

    const textFieldHandler = (e) => {
        if(e.target.value.length > 0 && e.target.value.length < 5) {
            let re = /^(19[5-9]\d|20[0-9]\d|2099)$/
            if(re.test(e.target.value.trim())) {
                promotion = e.target.value
                setData({...data, toSend: {year: promotion, facultyId: data.id}, validationInput:{state: false, text: "", disableOkButton: false}})
            } else {
                setData({
                    ...data,
                    validationInput: {
                        state: true, 
                        text: `Promotia setata este invalida! Sunt acceptate doar numere. (Ex: '${data.defaultYear}')`,
                        disableOkButton: true
                    }
                })
            }
        } else {
            setData({
                ...data,
                validationInput: {
                    state: true,
                    text: `Promotia setata este invalida!`,
                    disableOkButton: true
                }
            })
        }  
    }

    const handleCancelAddPromotion = (e) => {
        e.stopPropagation()
        setData({...data, openDialog: false})
        props.callback('Dashboard')
    }

    const handleAddPromotion = async (e) => {
        e.stopPropagation()
        //setData({...data, toSend: {year: promotion, facultyId: data.id}})
        console.log(data)
        const ADD_URL = hostURL() + API_URL.API_ADD_NEW_PROMOTION
        const respAdd = await axios.post(ADD_URL, data.toSend, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
        if(respAdd.status === 200) {
            props.callback('Dashboard')
        }
    }

    return (
        <Box>
            <Dialog open = {data.openDialog} onClose={handleCancelAddPromotion}>
                <DialogTitle>
                    Adauga o noua promotie pentru {data.facultyName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pentru a adauga o noua promotie este necesar sa introuceti anul in care promotia incheie ciclul de studiu. Retine ca prin setarea unei noi promotii, aceasta va fi setata ca fiind cea curenta!
                    </DialogContentText>
                    <TextField error = {data.validationInput.state} helperText = {data.validationInput.text} inputProps={{ inputMode: 'numeric', pattern: '/^(19[5-9]\d|20[0-9]\d|2099)$/' }} fullWidth required variant='standard' id="outlined-required1" label="Promotia" margin="normal" onChange={textFieldHandler}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAddPromotion}>
                        Anuleaza
                    </Button>
                    <Button disabled = {data.validationInput.disableOkButton} onClick = {handleAddPromotion}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    )
}