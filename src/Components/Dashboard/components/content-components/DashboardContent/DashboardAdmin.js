import * as React from 'react'
import axios from 'axios'
import { Box, Grid } from '@mui/material'
import Card from '@mui/material/Card'
import Tile from '../recycled-components/Tile'
import Cookies from 'universal-cookie'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'

export default function DashboardAdmin({callback}) {
    const [data, setData] = React.useState()
    const [isRender, setIsRender] = React.useState(true)
    const [loading,setLoading] = React.useState(true)

    const cookies = new Cookies()
    const ID = cookies.get('id')
    const BASE_URL = hostURL()
    const GET_DASHBOARD_DATA_URL = BASE_URL + API_URL.API_GET_DASHBOARD_CONTENT
    let dashboardData



    React.useEffect(() => {
        async function getAdminData() {
            await axios.get(GET_DASHBOARD_DATA_URL, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}, params: { id: ID, role: 'ADMIN'}} )
            .then((results) => {
                setData(results.data.content)
                console.log()
                setLoading(false)
            })
            .catch(() => {
                //Cazul in care nu s-a autentificat sau nu e admin
                setData([])
                setLoading(false)
            })
        }

        if(isRender) {
            getAdminData()
        }

        return () => {
            setIsRender(false)
        }
    },[data])
    
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" style={{width: '100%'}}>
            { !loading ? (data.map((item) => (
                <Grid item xs="auto" md={6} sx = {{p: '1%'}}>
                    <Tile data = {item}/>
                </Grid>
            ))): (<Box></Box>)}
        </Grid>
    )
}