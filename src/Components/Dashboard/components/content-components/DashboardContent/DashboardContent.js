import { Box, Typography, Backdrop } from '@mui/material'
import * as React from 'react'
import DashboardAdmin from './DashboardAdmin'
import DashboardSecretary from './DashboardSecretary'
import DashboardStudent from './DashboardStudent'
import DashboardTeacher from './DashboardTeacher'


export default function DashboardContent(props) {
    const [dashData, setDashData] = React.useState({
        type: '',
        loading: true
    })

    React.useEffect(() => {
        if(props.type.length > 0) {
            setDashData({type: props.type, loading:false})
        }
    }, [props])

    const handleGenerateContent = () => {
        switch(dashData.type) {
            case "ADMIN":
                return (
                    <DashboardAdmin/>
                )
            case "SECRETARY":
                return (
                    <DashboardSecretary/>
                )
            case "STUDENT":
                return (
                    <DashboardStudent/>
                )
            case "TEACHER":
                return (
                    <DashboardTeacher/>
                )
        }
    }

    return (
        <Box>
            {dashData.loading ? (
                <Box>
                    <Backdrop/>
                </Box>
            ): (
                <Box>
                    <Box>
                        <Typography variant='h4'>
                            Dashboard
                        </Typography>
                    </Box>
                    <Box>
                        {handleGenerateContent}
                    </Box>
                </Box>
            )}
        </Box>
    )
}