import * as React from 'react'
import {
    Box,
    Typography,
    Backdrop,
    CircularProgress,
    Stack,
    Tab,
    Tabs,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Tooltip,
    TextField,
    Snackbar,
    Alert
} from '@mui/material'
import {
    ExpandMore,
    GppBad,
    PendingActions,
    School,
    Verified,
    Warning,
    Done,
    Close
} from '@mui/icons-material'
import Cookies from 'universal-cookie'
import {grey, indigo} from '@mui/material/colors'; 
import utils from '../../../../utils/utils';

export default function MyRequests(props) {
    const [data, setData] = React.useState({})
    const [expandData, setExpandData] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [rejectReason, setRejectReason] = React.useState()
    const [requestAlert, setRequestAlert] = React.useState({isError: false, severity: "error", textError: ""})

    const cookies = new Cookies()

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    }

    React.useEffect(() => {
        if(props.data) {
            if(loading) {
                if(props.type === 'STUDENT') {
                    setData({
                        titlePage: 'Cererile mele',
                        tabIndex: 0,
                        viewIndex: 0,
                        ...props.data
                    })
                }
                if(props.type === 'TEACHER') {
                    setData({
                        titlePage: 'Cereri studenți',
                        tabIndex: 0,
                        viewIndex: 0,
                        projectIndex: 0,
                        ...props.data
                    })
                }

                setLoading(false)
            }
        }
        return () => {
            if(props.type === 'STUDENT') {
                setData({
                    titlePage: 'Cererile mele',
                    tabIndex: 0,
                    viewIndex: 0,
                    ...props.data
                })
            }
            if(props.type === 'TEACHER') {
                setData({
                    titlePage: 'Cereri studenți',
                    tabIndex: 0,
                    viewIndex: 0,
                    projectIndex: 0,
                    ...props.data
                })
            }
            console.log(data)
        }
            
    }, [props.data])

    const generatePageByRole = (role) => {
        console.log(role)
        switch(role) {
            case 'STUDENT':
                return initRender.STUDENT()

            case 'TEACHER':
               return initRender.TEACHER()

        }
    }

    const handle = {
        TEACHER: {
            handleClickOnListItem: (event, index) => {
                event.preventDefault()
                setData({...data, viewIndex: index})
            },

            handleChangeRequest: (event) => {
                event.preventDefault()
                setRejectReason(event.target.value)
            },

            clickOnTabs: (event, newValue) => {
                event.preventDefault()
                setData({...data, projectIndex: newValue})
            },

            clickAcceptRequest: async (event) => {
                event.preventDefault()
                const id = event.target.id.replace('accept-','').replace('tooltipAccept-','').replace('accepticon-','')
                console.log(id)
                let projectData
                let projects = Object.values(data.views[data.viewIndex].projects)[data.projectIndex]
                console.log(projects)
                for(let i = 0; i<projects.length;i++) {
                    if(projects[i].id===id){
                        console.log(data.projectIndex)
                        if(data.projectIndex === 0) {
                            projectData = {
                                id: id,
                                state: 'APPROVED',
                                teacherId: projects[i].TeacherId,
                                promotionId:projects[i].PromotionId,
                                type: 'LICENTA'
                            }
                        } else {
                            projectData = {
                                id: id,
                                state: 'APPROVED',
                                teacherId: projects[i].TeacherId,
                                promotionId:projects[i].PromotionId,
                                type: 'MASTER'
                            }
                        }
                        console.log(projectData)
                        break
                    }
                }
                const accept = await utils.app.setProjectStatus(projectData)
                if(accept.status === 200) {
                    console.log('OK')
                    props.callback({redirectType: 'refresh'})
                } else {
                    console.log('NOTOK')
                }
            },

            clickDeclineRequest: async (event) => {
                event.preventDefault()
                const id = event.target.id.replace('decline-','').replace('tooltipDecline-','').replace('closeicon-','')
                console.log(id)
                if(rejectReason) {
                    if(rejectReason.replace(' ', '').length <3 ) {
                        setRequestAlert({isError: true, severity: "error", textError: "Va rugăm să notați motivele respingerii cererii!"})
                    } else {
                        setRequestAlert({isError: false, severity: "error", textError: ""})
                        let projectData
                        let projects = Object.values(data.views[data.viewIndex].projects)[data.projectIndex]
                        for(let i = 0; i<projects.length;i++) {
                            if(projects[i].id===id){
                                if(data.projectIndex === 0) {
                                    projectData = {
                                        id: id,
                                        state: 'REJECTED',
                                        teacherId: projects[i].TeacherId,
                                        promotionId:projects[i].PromotionId,
                                        rejectReason: rejectReason,
                                        type: 'LICENTA'
                                    }
                                } else {
                                    projectData = {
                                        id: id,
                                        state: 'REJECTED',
                                        teacherId: projects[i].TeacherId,
                                        promotionId:projects[i].PromotionId,
                                        rejectReason: rejectReason,
                                        type: 'MASTER'
                                    }
                                }
                            }
                        }
                        const accept = await utils.app.setProjectStatus(projectData)
                        console.log('OK')
                        props.callback({redirectType: 'refresh'})
                    }
                } else {
                    setRequestAlert({isError: true, severity: "error", textError: "Va rugăm să notați motivele respingerii cererii!"})
                }
            },
        },

        STUDENT: {
            clickOnTabs: (event, newValue) => {
                event.preventDefault()
                setData({...data, tabIndex: newValue, viewIndex: 0})
            },
            clickExpandAccordion: (panel) => (event, isExpand) => {
                event.preventDefault()
                setExpandData(isExpand ? panel : false)
            }
        }
    }

    const initRender = {
        TEACHER: () => {
            let page = [], noPromotion, list=[], listItem, contentList

            if(data.views.length === 0) {
                noPromotion = (
                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                        <Warning sx={{fontSize: 60, color: 'text.secondary'}}/>
                        <Typography color={'text.secondary'} variant='h6'>Nu ești adăugat/ă în nicio promoție</Typography>
                        <Typography color={'text.secondary'} variant='h6'>Te rog contactează secretariatul facultății pentru mai multe detalii</Typography>
                    </Stack>
                )
                page.push(noPromotion)
            } else {
                let views = data.views
                let accordions = [], accordion, tabs, tab, tabsContent
                //Generate list
                for(let i = 0; i < views.length; i++) {
                    listItem = (
                        <ListItemButton
                            selected={data.viewIndex === 0}
                            onClick={(event) => handle.TEACHER.handleClickOnListItem(event, 0)}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <School/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={views[i].facultyName} secondary={`Promoția ${views[i].promotionYear.toString()}`}/>
                        </ListItemButton>
                    )
                    list.push(listItem)
                }

                //Generate Tabs
                tabsContent = (
                    <Tabs value={data.projectIndex} onChange={handle.TEACHER.clickOnTabs}>
                        <Tab label = 'Licență' id={`request-tab1`} sx={{mt:'1%', ml:'1%', mr:'1%'}}/>
                        <Tab label = 'Disertație' id={`request-tab1`} sx={{mt:'1%', ml:'1%', mr:'1%'}}/>
                    </Tabs>
                )

                //Generate list
                let projects = Object.values(data.views[data.viewIndex].projects)[data.projectIndex]
                let projectList = [], projectItem, counter=0
                
                for(let i = 0; i< projects.length; i++) {
                    if(projects[i].state === 'PENDING') {
                        projectItem = (
                            <Paper elevation={6} sx={{m:'2%', bgcolor: indigo[50]}}>
                                <Stack direction = 'row' alignItems='stretch' justifyContent='center' spacing={1}>
                                    <Stack direction = 'column' sx = {{m:'2%', width:'80%'}} alignItems='stretch' justifyContent='center' spacing={1}>
                                        <Stack direction = 'row' alignItems='stretch' justifyContent='flex-start' spacing={1}>
                                            <Typography variant='h6'>Nume student:</Typography>
                                            <Typography variant='h6'>{projects[i].studentName}</Typography>
                                        </Stack>
                                        <Stack direction = 'row' alignItems='stretch' justifyContent='flex-start' spacing={1}>
                                            <Typography variant='h6'>Tema proiectului:</Typography>
                                            <Typography variant='h6'>{projects[i].name}</Typography>
                                        </Stack>
                                        <Stack direction = 'row' alignItems='stretch' justifyContent='flex-start' spacing={1}>
                                            <Typography variant='h6'>Descrierea proiectului:</Typography>
                                            <Typography variant='h6'>{projects[i].description}</Typography>
                                        </Stack>
                                        <TextField
                                            fullWidth
                                            id={`tf-${i}`}
                                            label='Motivul respingerii (doar dacă respingeți cererea)'
                                            onChange={handle.TEACHER.handleChangeRequest}
                                            multiline
                                            rows={3}
                                            margin="normal"
                                            inputProps={{
                                                'aria-label': `rejectReason`
                                            }}
                                        />
                                    </Stack>
                                    <Stack direction = 'row' sx = {{m:'2%', width:'20%'}} alignItems='center' justifyContent='center' spacing={1}>
                                        <Button variant='text' sx={{color:'error.main'}} id={`decline-${projects[i].id}`} onClick={handle.TEACHER.clickDeclineRequest}>
                                            <Tooltip title='Respinge' id={`tooltipDecline-${projects[i].id}`}>
                                                <Close id={`closeicon-${projects[i].id}`}/>
                                            </Tooltip>
                                        </Button>
                                        <Button variant='text' sx={{color:'success.main'}} id={`accept-${projects[i].id}`} onClick={handle.TEACHER.clickAcceptRequest}>
                                            <Tooltip title='Acceptă' id={`tooltipAccept-${projects[i].id}`}>
                                                <Done id={`accepticon-${projects[i].id}`}/>
                                            </Tooltip>
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        )
                        counter++
                    }
                    projectList.push(projectItem)
                }
                if (counter === 0) {
                    projectItem = (
                        <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                            <Warning sx={{fontSize: 60, color: 'text.secondary'}}/>
                            <Typography color={'text.secondary'} variant='h6'>Nu ai nicio cerere în așteptare</Typography>
                        </Stack>
                    )
                    projectList.push(projectItem)
                }

                page = (
                    <Stack sx={{m:'1%', height:1}} direction='row' alignItems='stretch' justifyContent='center' spacing={2}>
                        <Paper elevation={6} sx={{width:1/4,height:'80vh'}}>
                            {list}
                        </Paper>
                        <Paper elevation={6} sx={{width:3/4, height:'80vh', overflow: 'auto'}} >
                            <Stack direction='column' sx={{m:'1%'}} alignItems='stretch' justifyContent='center' spacing={2}>
                                {tabsContent}
                                {projectList}
                            </Stack>
                        </Paper>
                    </Stack>
                )

            }
            return page

        },

        STUDENT: () => {
            let page = [], noPromotion, noData
            console.log(data)
            //Case no promotion
            
            if(data.tabs.length === 0) {
                noPromotion = (
                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                        <Warning sx={{fontSize: 60, color: 'text.secondary'}}/>
                        <Typography color={'text.secondary'} variant='h6'>Nu ești adăugat/ă în nicio promoție</Typography>
                        <Typography color={'text.secondary'} variant='h6'>Te rog contactează secretariatul facultății pentru mai multe detalii</Typography>
                    </Stack>
                )
                page.push(noPromotion)
            } else {               
                    //Case with projects

                    //Generate tabs
                    let tabs = [], tabsContent, tab
                    for(let i = 0; i < data.tabs.length; i++) {
                        tab = (
                            <Tab label = {data.tabs[i].title} id={`request-tab${i}`} sx={{mt:'1%', ml:'1%', mr:'1%'}}/>
                        )
                        tabs.push(tab)
                    }
                    tabsContent = (
                        <Tabs value={data.tabIndex} onChange={handle.STUDENT.clickOnTabs}>
                            {tabs}
                        </Tabs>
                    )
                    page.push(tabsContent)

                    //Generate accordions
                    let views = data.tabs[data.tabIndex].views
                    let accordions = [], accordion
                    for(let i = 0; i < views.length; i++) {
                        //Check if there are projects
                        let viewProjects = views[i].projects
                        let projTiles = [], projTile
                        if(views[i].projects.length > 0) {
                            for(let j = 0; j < viewProjects.length; j++) {
                                let status
                                switch(viewProjects[j].state) {
                                    case 'PENDING':
                                        status = (
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2} sx={{color: 'text.secondary', width: '105%'}}>
                                                <PendingActions sx={{ml: '1%', mr: '1%'}}/>
                                                <Typography variant='button'>În așteptare</Typography>
                                            </Stack>
                                        )
                                        break
                                    case 'REJECTED':
                                        status = (
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2} sx={{color: 'error.main', width: '105%'}}>
                                                <GppBad sx={{ml: '1%', mr: '1%'}}/>
                                                <Typography variant='button'>Respins</Typography>
                                            </Stack>
                                        )
                                        break
                                    case 'APPROVED':
                                        status = (
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2} sx={{color: 'success.main', width: '105%'}}>
                                                <Verified sx={{ml: '1%', mr: '1%'}}/>
                                                <Typography variant='button'>Aprobat</Typography>
                                            </Stack>
                                        )
                                        break
                                }
                                //Determine the teacher
                                let teacherName = ''
                                for (let k = 0; k < views[i].teachers.length; k++) {
                                    if(views[i].teachers[k].teacherId === viewProjects[j].TeacherId) {
                                        teacherName = views[i].teachers[k].name
                                        break
                                    }
                                }
    
                                projTile = (
                                    <Paper elevation = {6} sx = {{m:'2%', width: '100%'}}>
                                        <Stack direction='column' sx={{m:'1%'}} alignItems='stretch' justifyContent='center' spacing={2}>
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2}>
                                                <Typography variant = 'body1' fontStyle='bold'>
                                                    Tema proiectului:
                                                </Typography>
                                                <Typography variant = 'body1'>
                                                    {viewProjects[j].name}
                                                </Typography>                                            
                                            </Stack>
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2}>
                                                <Typography variant = 'body1'>
                                                    Profesorul coordonator:
                                                </Typography>
                                                <Typography variant = 'body1'>
                                                    {teacherName}
                                                </Typography>                                            
                                            </Stack>
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2}>
                                                <Typography variant = 'body1'>
                                                    Status cerere:
                                                </Typography>
                                                <Typography variant = 'body1'>
                                                    {status}
                                                </Typography>                                            
                                            </Stack>
                                            {viewProjects[i].state === 'REJECTED' ? (
                                            <Stack direction='row' alignItems='stretch' justifyContent='flex-start' spacing={2}>
                                                <Typography variant = 'body1'>
                                                    Motivul respingerii:
                                                </Typography>
                                                <Typography variant = 'body1'>
                                                    {viewProjects[i].rejectReason}
                                                </Typography>                                            
                                            </Stack>
                                            ) : (
                                                <Box></Box>
                                            )}
                                        </Stack>
                                    </Paper>
                                )
                                projTiles.push(projTile)
                            }
                        } else {
                            projTile = (
                                <Paper elevation = {6} sx = {{m:'2%', width: '100%'}}>
                                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                                        <Warning sx={{fontSize: 60, color: 'text.secondary'}}/>
                                        <Typography color={'text.secondary'} variant='h6'>Nu ai nicio cerere trimisă în această promoție</Typography>
                                        <Typography color={'text.secondary'} variant='h6'>Intră în secțiunea Dashboard și alege profesorul tău coordonator</Typography>
                                    </Stack>
                                </Paper>
                            )

                            projTiles.push(projTile)

                        }
                        
                        accordion = (
                            <Accordion sx={{m:'1%', mt: 2}}  expanded = {expandData === `request${i}`} onChange={handle.STUDENT.clickExpandAccordion(`request${i}`)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls={`request${i}bh-content`}
                                    id={`request${i}bh-header`}
                                >
                                    <Typography sx={{width: '75%', flexShrink:0}}>{views[i].facultyName}</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{`Promoția ${views[i].promotionYear}`}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{bgcolor: grey[400]}}>
                                    <Stack direction='column' alignItems='center' sx = {{width: 1}} justifyContent='center' spacing={2}>
                                        {projTiles}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>

                        )
                        accordions.push(accordion)
                    }
                    page.push(accordions)
                }

            return page
        }
    }


    return (
        !loading ? (
            <Box sx={{bgcolor: grey[100], p: 3}} height='100vh' display='flex' flexDirection='column'>
                <Typography variant='h4'>{data.titlePage}</Typography>
                <Box>
                    {generatePageByRole(props.type)}
                </Box>
                <Snackbar open={requestAlert.isError} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity={requestAlert.severity} sx={{ width: '100%' }}>
                        {requestAlert.textError}
                    </Alert>
                </Snackbar>
            </Box>
        ) : (
            <Backdrop open={loading} sx={{alignItems:'center'}}>
                <CircularProgress sx={{color:'white'}} />
            </Backdrop>
        )
    )
}