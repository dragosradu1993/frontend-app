import * as React from 'react'
import { Typography, Box } from "@mui/material"


export default function LoginTitle(props) {
    const [title, setTitle] = React.useState()

    React.useEffect(() => {
        if(props.title) {
            setTitle(props.title)
        }
    }, [props.title])

    return(
        <Box display="grid">
            <Box gridColumn="span 12">
                <Typography align="center" variant='h3'>{title}</Typography>
            </Box>
            <Box gridColumn="span 12" sx={{p:'1%'}}>
                <Typography align="center" variant='h4'>Login</Typography>
            </Box>            
        </Box>
    )
}