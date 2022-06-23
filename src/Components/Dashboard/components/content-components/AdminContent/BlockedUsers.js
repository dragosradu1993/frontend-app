import * as React from 'react'
import { Typography, Box, Grid, Button } from '@mui/material'
import DataTable from '../recycled-components/DataTable'
import Cookies from 'universal-cookie'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'
import axios from 'axios'
import { Cached, LockOpen, Update } from '@mui/icons-material'
import { useGridApiRef } from '@mui/x-data-grid'


export default function BlockedUsers(props) {
    const [isRender, setIsRender] = React.useState(true)
    const [loading, setLoading] = React.useState(true)
    const [allUsers, setAllUsers] = React.useState()
    const [selectedUsers, setSelectedUsers] = React.useState()
    const [isDisabled, setIsDisabled] = React.useState(true)

    const cookies = new Cookies()
    const TOKEN = cookies.get('s')
    const ID = cookies.get('id')
    const BASE_URL = hostURL()
    const GET_DATA_URL = BASE_URL + API_URL.API_GET_ALL_BLOCKED_USERS_CONTENT
    const UNBLOCK_USER_URL = BASE_URL + API_URL.API_POST_UNBLOCK_USER
    const RESET_PWD_URL = BASE_URL + API_URL.API_POST_RESET_PWD
    
    React.useEffect(() => {
        if(isRender) {
            axios.get(GET_DATA_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: { id: ID, role: 'ADMIN'}})
            .then((res) => {
                setAllUsers(res.data)
            })
            .catch((res) => {
                setAllUsers(res.data)
            })
        }
        return () => {
            setIsRender(false)
        }
    })

    const callback = (data) => {
        setSelectedUsers(data)
        setIsDisabled(true)
        if(selectedUsers) {
            setIsDisabled(false)
        }
        console.log(selectedUsers)
    }

    const handleRefreshClick = (e) => {
        setIsRender(true)
        axios.get(GET_DATA_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: { id: ID, role: 'ADMIN'}})
        .then((res) => {
            setAllUsers(res.data)
            setIsRender(false)
        })
        .catch((res) => {
            setAllUsers(res.data)
            setIsRender(false)
        })
    }

    const handleUnBlockClick = async (e) => {
        setIsDisabled(false)
        let countUnblocked = 0
        let count = 0
        for(let i=0;i<selectedUsers.length;i++) {
            await axios.post(UNBLOCK_USER_URL, selectedUsers[i], {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: {role: 'ADMIN'}})
            .then((res) => {
                countUnblocked ++;
            })
            .catch((res) => {
                count ++
            })
        }
        handleRefreshClick()
    }

    const handleResetPasswordClick = async (e) => {
        setIsDisabled(false)
        let countUnblocked = 0
        let count = 0
        for(let i=0;i<selectedUsers.length;i++) {
            await axios.post(RESET_PWD_URL, {password: 'ResetPwd1@'}, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: {email: selectedUsers[i].email}})
            .then((res) => {
                countUnblocked ++;
            })
            .catch((res) => {
                count ++
            })
        }
    }

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{height: '100%'}}>
            <Box gridColumn="span 12">
                <Typography variant='h4'>
                    Utilizatori blocati
                </Typography>
            </Box>
            <Box gridColumn="span 12" minHeight={500} >
                <Button variant = "text" onClick={handleRefreshClick}>
                    <Cached/>
                     Reimprospateaza
                </Button>
                <Button variant = "text" disabled={isDisabled} onClick = {handleResetPasswordClick}>
                    <Update/>
                    Reseteaza parola
                </Button>
                <Button variant = "text" disabled={isDisabled} onClick = {handleUnBlockClick}>
                    <LockOpen/>
                    Deblocheaza
                </Button>
                <div style={{ display: 'flex', height: '100%'}}>
                    <div style={{ flexGrow: 1 }}>
                        <DataTable data = {allUsers} isSelectable = {true} callback={callback} edit = {{newEditingApi: true}}/>
                    </div>
                </div>
            </Box>
        </Box>
    )
}