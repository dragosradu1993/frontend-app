import * as React from 'react'
import Box from '@mui/material/Box';
import { Typography, Divider, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    setupFields: {
        width: "100%",
        display: "block",
        left: '50'
    },
    adminAccount: {

    }
})

const facultyFields = {
    facultyName: "",
    facultyPhone: "",
    facultyAddress: ""
}

export default function SummarySetup({callback}) {
    const classes = useStyles()

    return(
        <Box sx={{ width: '100%' }}>
            <Box>
                <Typography m={2}>
                    Sunteti sigur ca doriti salvarea acestor informatii?
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Box sx={{m: 2, display: 'block', left: '50'}}>
            </Box>
        </Box>
    )
}