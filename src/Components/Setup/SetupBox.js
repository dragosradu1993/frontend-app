import * as React from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import AdminAccountSetup from './components/AdminAccountSetup';
import AppInfoSetup from './components/AppInfoSetup';
import FacultyInfoSetup from './components/FacultyInfoSetup';
import SummarySetup from './components/SummarySetup';
import setupUtil from './utils/setupUtil';
import axios from 'axios';
import hostURL from '../utils/constants/hostURL';
import { useNavigate } from 'react-router-dom';
import { TextField, Stack, Typography } from '@mui/material';
import utils from '../utils/utils';

const steps = ['Creare cont admin', 'Adaugare informatii aplicatie', 'Adaugare informatii facultate', 'Sumar']
const jsonDataToSend = {}

export default function SetupBox() {
    const [activeStep, setActiveStep] = React.useState(0)
    const [skipped, setSkipped] = React.useState(new Set())

    //Step state fields
    const [adminData, setAdminData] = React.useState({})
    const [appData, setAppData] = React.useState({})
    const [facultyData, setFacultyData] = React.useState({})
    const [showKey, setShowKey] = React.useState(true)
    const [key, setKey] = React.useState()

    const BASE_URL = hostURL()

    let navigate = useNavigate()

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

   const callback = (data) => {
        switch(activeStep) {
            case 0:
                setAdminData(data)
                break
            case 1:
                setAppData(data)
                break
            case 2:
                setFacultyData(data)
                break
        }
    }

    const handleNext = (e) => {
        let newSkipped = skipped;
        //fieldData = setupUtils.validateStep(activeStep)
        console.log(activeStep)
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        switch(activeStep) {
            case 0:
                jsonDataToSend.adminAccount = adminData
                break
            case 1:
                jsonDataToSend.appData = appData
                break
            case 2:
                jsonDataToSend.faculty = facultyData
                break
            default:
                break

        }
        console.log(jsonDataToSend)

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        console.log(activeStep, steps.length)
        if(activeStep === steps.length - 1) {
            const jsonData = setupUtil.createSetupJSON(jsonDataToSend)
            axios.post('https://localhost:3001/api-dev/app-info/add', jsonData.app)
            .then(res => { // then print response status
                axios.post('https://localhost:3001/api-dev/users/register', jsonData.account)
                .then(res => {
                    navigate('/login')
                })
            })           
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const renderSwitch = (step) => {
        switch(step) {
            case 0:
                return (
                    <AdminAccountSetup callback = {callback}/>
                )
            case 1:
                return (
                    <AppInfoSetup callback = {callback} />
                )
            case 2:
                return (
                    <FacultyInfoSetup callback = {callback} />
                )
            case 3:
                return (
                    <SummarySetup callback={callback} />
                )
            default:
                return (
                    <AdminAccountSetup callback = {callback}/>
                )
        }
    }

    const handleKeyChange = (event) => {
        event.preventDefault()
        setKey(event.target.value)
    }

    const handleClickKey = async (event) => {
        event.preventDefault()
        if(!key) {
            setKey('')
        }
        const initialKey = await utils.app.sendInitialKey(key)
            setShowKey(!initialKey.keyState)
    }

    return (
        <Box>
            <Box>
                {showKey ? (
                    <Box sx={{ width: '100%'}}>
                        <Stack direction='column' alignItems='center' justifyContent='center' sx={{m:'3%'}}>
                            <Typography variant='body1'>
                                Cheia de acces
                            </Typography>
                            <TextField variant='standard' onChange={handleKeyChange}/>
                            <Button variant = 'text' onClick = {handleClickKey}>
                                OK
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%'}}>
                        <Stepper sx={{p: 2}} activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Box sx={{ mt: 2, mb: 1 }}>
                                                    
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {renderSwitch(activeStep)}
                                <Box sx={{ display: 'flex', pt: 10, flexWrap: 'wrap', alignContent: 'flex-end'}}>
                                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={activeStep === 0 ? { mr: 1, display: 'none' } : { mr: 1, display: 'inline-flex' }}>Inapoi</Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Gata' : 'Inainte'}</Button>
                                </Box>
                            </React.Fragment>
                            )}
                        </Box>
                    )}

            </Box>
        </Box>
    );

}