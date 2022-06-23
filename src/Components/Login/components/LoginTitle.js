import * as React from 'react'
import { Typography, Box } from "@mui/material"


export default function LoginTitle(props) {
    const [title, setTitle] = React.useState()
    const [isRender, setIsRender] = React.useState(true)

    React.useEffect(() => {
        if(props.title && isRender) {
            setTitle(props.title)
        }

        return () => {
            setIsRender(false)
        }
    }, [props.title, title])

    return(
        <Box alignItems="center" justifyContent="center">
            <Typography variant='h3'>{title}</Typography>
            <Typography variant='h4'>Login</Typography>
        </Box>
    )
}