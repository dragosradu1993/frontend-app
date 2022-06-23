import * as React from 'react'
import { Typography, Box, Grid, Button } from '@mui/material'
import DataTable from '../recycled-components/DataTable'
import Cookies from 'universal-cookie'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'
import axios from 'axios'
import { Cached } from '@mui/icons-material'


export default function AllUsers(props) {
    const [isRender, setIsRender] = React.useState(true)
    const [loading, setLoading] = React.useState(true)
    const [allUsers, setAllUsers] = React.useState()
    const [selectedUsers, setSelectedUsers] = React.useState()

    const cookies = new Cookies()
    const TOKEN = cookies.get('s')
    const ID = cookies.get('id')
    const BASE_URL = hostURL()
    const GET_DATA_URL = BASE_URL + API_URL.API_GET_ALL_USERS_CONTENT

    React.useEffect(() => {
        if(isRender) {
            axios.get(GET_DATA_URL, {headers: {"Authorization" : `Bearer ${TOKEN}`}, params: { id: ID}})
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
        console.log(selectedUsers)
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

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{height: '100%'}}>
            <Box gridColumn="span 12">
                <Typography variant='h4'>
                    Toti utilizatorii
                </Typography>
            </Box>
            <Box gridColumn="span 12" minHeight={500} >
                <Button variant = "text" onClick={handleRefreshClick}>
                    <Cached/>
                     Reimprospateaza
                </Button>
                <div style={{ display: 'flex', height: '100%'}}>
                    <div style={{ flexGrow: 1 }}>
                        <DataTable data = {allUsers} isSelectable = {false} callback={callback}/>
                    </div>
                </div>
            </Box>
        </Box>
    )
}