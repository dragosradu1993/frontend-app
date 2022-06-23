import * as React from 'react'
import Box from '@mui/material/Box';
import SetupBackground from "./res/setup-background.png";
import SetupBox from './SetupBox';

const setupStyles = {
    root: {
        background: `url(${SetupBackground})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    setupBox: {
        margin: '25%',
        padding: '3%',
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: "15px",
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"
    }
}

export default function Setup() {
    return (
        <Box style = {setupStyles.root}>
            <Box style = {setupStyles.setupBox}>
                <SetupBox/>
            </Box>
        </Box>
    )
}