import * as React from 'react'
import Box from '@mui/material/Box';
import { Typography, Divider, TextField, Grid, LinearProgress, Paper, Backdrop, CircularProgress, Alert, Snackbar, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import getData from '../utils/getData';
import { Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
import * as API_URL from '../utils/constants/urlConstants'
import hostURL from '../utils/constants/hostURL'
import { useNavigate } from 'react-router-dom';



export default function LandingLoading() {
    return (
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <CircularProgress/>
        </div>
    )
}