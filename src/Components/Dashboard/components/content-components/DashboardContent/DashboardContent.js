import { Box, Typography, Backdrop, Slide, Button, CircularProgress, ListItem, ListItemButton, Avatar, Select, Tab, Tabs, TextField, Paper, Stack, ListItemAvatar, ListItemText, Switch, Table, TableCell, TableRow, TableBody } from '@mui/material'
import * as React from 'react'
import axios from 'axios'
import Tile from '../recycled-components/Tile'
import Cookies from 'universal-cookie'
import hostURL from '../../../../utils/constants/hostURL'
import * as API_URL from '../../../../utils/constants/urlConstants'
import { FormControl } from 'react-bootstrap'
import STRINGS from '../../../../utils/constants/stringConstants'
import { ArrowBackIos, ArrowForwardIos, DataObject, Warning } from '@mui/icons-material'
import utils from '../../../../utils/utils'
import avatar from '../../main-components/utils/utils'
import {grey} from '@mui/material/colors';



export default function DashboardContent(props) {
    const [data, setData] = React.useState({})
    const [slide, setSlide] = React.useState({direction: 'right', do: true})
    const [dateLimit, setDateLimit] = React.useState()
    const [loading, setLoading] = React.useState(true)
    const [dataToSend, setDataToSend] = React.useState()

    const cookies = new Cookies()
    const ID = cookies.get('id')
    const role = cookies.get('rls')
    const BASE_URL = hostURL()
    const GET_DASHBOARD_DATA_URL = BASE_URL + API_URL.API_GET_DASHBOARD_CONTENT

    const handle = {
        ADMIN: {

        },

        STUDENT: {
            clickOnTabs: (event, newValue) => {
                event.preventDefault()
               // setStudentContentData({...studentContentData, refresh: true ,selectedEducationType: {index: newValue, value: studentContentData.educationForms[newValue]}})
               setData({...data, tabIndex: newValue, viewIndex: 0})
            },
            clickOnForwardArrow: (event) => {
                event.preventDefault()
                setData({...data, viewIndex: data.viewIndex+1})
                console.log(data)
            },
            clickOnBackArrow: (event) => {
                event.preventDefault()
                setData({...data, viewIndex: data.viewIndex-1})
                console.log(data)
            },
            clickOnTeacher: (index) => {
                console.log(data.tabs[data.tabIndex].views[data.viewIndex].teachers[index])
                let callback = {
                    redirectType: 'dialog',
                    redirect: 'student-add-project-request',
                    data: {
                        FacultyId: data.tabs[data.tabIndex].views[data.viewIndex].facultyId,
                        PromotionId: data.tabs[data.tabIndex].views[data.viewIndex].promotionId,
                        StudentId: data.tabs[data.tabIndex].views[data.viewIndex].studentId,
                        TeacherId: data.tabs[data.tabIndex].views[data.viewIndex].teachers[index].teacherId,
                        TeacherName: data.tabs[data.tabIndex].views[data.viewIndex].teachers[index].name,
                        type: data.tabs[data.tabIndex].value
                    }
                }
                props.callback(callback)
            }
        },

        SECRETARY: {

        },

        TEACHER: {
            clickOnForwardArrow: (event) => {
                event.preventDefault()
                setData({...data, viewIndex: data.viewIndex+1})
                console.log(data)
            },
            clickOnBackArrow: (event) => {
                event.preventDefault()
                setData({...data, viewIndex: data.viewIndex-1})
                console.log(data)
            },
            changeAvailableBachelorSlots: (event) => {
                event.preventDefault()
                let newData = data
                newData.views[data.viewIndex].isCoordinatorBachelors = !data.views[data.viewIndex].isCoordinatorBachelors
                if(!newData.views[data.viewIndex].isCoordinatorBachelors) {
                    newData.views[data.viewIndex].availableSlotsBachelors = 0
                }
                setData({...newData})
            },
            changeAvailableDisertationSlots: (event) => {
                event.preventDefault()
                let newData = data
                newData.views[data.viewIndex].isCoordinatorDisertation = !data.views[data.viewIndex].isCoordinatorDisertation
                if(!newData.views[data.viewIndex].isCoordinatorDisertation) {
                    newData.views[data.viewIndex].availableSlotsDisertations = 0
                }
                setData({...newData})
            },
            setDisabledBachelorSlots: () => {
                let ok
                if(data.views[data.viewIndex].isCurrentPromotion) {
                    if(!data.views[data.viewIndex].isOutdated) {
                        if(data.views[data.viewIndex].isCoordinatorBachelors) {
                            ok = false
                        } else {
                            ok = true
                        }
                    } else {
                        ok = true
                    }
                } else {
                    ok = true
                }
                return ok
            },
            setDisabledDisertationSlots: () => {
                let ok
                if(data.views[data.viewIndex].isCurrentPromotion) {
                    if(!data.views[data.viewIndex].dateLimits.teachers.isOutdated) {
                        if(data.views[data.viewIndex].isCoordinatorDisertation) {
                            ok = false
                        } else {
                            ok = true
                        }
                    } else {
                        ok = true
                    }
                } else {
                    ok = true
                }
                return ok
            },
            
            handleChangeBachelorsSlots: (event) => {
                event.preventDefault()
                let dataToSend = {}
                dataToSend = {
                    TeacherId: data.views[data.viewIndex].teacherId,
                    PromotionId: data.views[data.viewIndex].promotionId,
                    isCoordinatorBachelors: data.views[data.viewIndex].isCoordinatorBachelors,
                    availableSlotsBachelors: parseInt(event.target.value),
                    isCoordinatorDisertation: data.views[data.viewIndex].isCoordinatorDisertation,
                    availableSlotsDisertations: data.views[data.viewIndex].availableSlotsDisertations,
                }
                let newData = data
                newData.views[data.viewIndex].availableSlotsBachelors = parseInt(event.target.value)
                setData({...newData})

                setDataToSend(dataToSend)
            },

            handleChangeDisertationSlots: (event) => {
                event.preventDefault()
                let dataToSend
                dataToSend = {
                    TeacherId: data.views[data.viewIndex].teacherId,
                    PromotionId: data.views[data.viewIndex].promotionId,
                    isCoordinatorBachelors: data.views[data.viewIndex].isCoordinatorBachelors,
                    availableSlotsBachelors: data.views[data.viewIndex].availableSlotsBachelors,
                    isCoordinatorDisertation: data.views[data.viewIndex].isCoordinatorDisertation,
                    availableSlotsDisertations: parseInt(event.target.value),
                }
                let newData = data
                newData.views[data.viewIndex].availableSlotsDisertations = parseInt(event.target.value)
                setData({...newData})
                
                setDataToSend(dataToSend)
            },

            clickOnSaveSlots: async (event) => {
                event.preventDefault()
                try {
                    const sendData = {
                        TeacherId: data.views[data.viewIndex].teacherId,
                        PromotionId: data.views[data.viewIndex].promotionId,
                        isCoordinatorBachelors: data.views[data.viewIndex].isCoordinatorBachelors,
                        availableSlotsBachelors: data.views[data.viewIndex].availableSlotsBachelors,
                        isCoordinatorDisertation: data.views[data.viewIndex].isCoordinatorDisertation,
                        availableSlotsDisertations: data.views[data.viewIndex].availableSlotsDisertations
                    }

                    const setSlots = await utils.app.setTeacherSlots(sendData)

                    
                } catch(error) {
                    console.log(error)
                }
                
            }
        }
    }

    const initContent = {
        ADMIN: () => {
            return (
                <Box>
                    <Typography variant='h5' sx={{pt:'1%'}}>
                        {`Salut, ${data.profile.Profile.firstName} ${data.profile.Profile.lastName}`}
                    </Typography>
                </Box>
            )
        },

        STUDENT: () => {
            let tabsContent, tabs = [], tab
            //Generate Tabs
            for(let i = 0; i<data.tabs.length;i++) {
               tab = (
                <Tab label={data.tabs[i].title} id={`dashboard-tab${i}`} sx={{mt:'1%', ml: '1%', mr: '1%'}}/>
               )
               tabs.push(tab)
            }
            if(tabs.length > 0) {
                tabsContent = (
                    <Tabs value={data.tabIndex} onChange={handle.STUDENT.clickOnTabs}>
                        {tabs}
                    </Tabs>
                    )
            } else {
                tabsContent = (
                    <Box></Box>
                )
            }


            return (
                <Box>
                    <Typography variant='h5' sx={{pt:'1%'}}>
                        {data.title}
                    </Typography>
                    <Box>
                        {tabsContent}
                    </Box>
                    <Box sx={{m:'1%'}}>
                        
                    </Box>
                </Box>
            ) 
        },

        TEACHER: () => {
            return (
                <Box>
                    <Typography variant='h5' sx={{pt:'1%'}}>
                        {data.title}
                    </Typography>
                </Box>
            )
        },

        SECRETARY: () => {
            return (
                <Box>
                    <Typography variant='h5' sx={{pt:'1%'}}>
                        {`Salut, ${data.secretaries[0].Profile.firstName} ${data.secretaries[0].Profile.lastName}`}
                    </Typography>
                </Box>
            )
        }
    }

    const UTILS = {

        generateTeacherList: (teachers) => {
            let items = [], item
            for(let i=0; i<teachers.length; i++) {
                    let colorProperty = avatar.stringAvatar(teachers[i].name)
                    item = (
                        <ListItem disablePadding>
                            <ListItemButton id={teachers[i].id} disabled={data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.isOutdated} onClick = {(event) => {
                                event.preventDefault()
                                handle.STUDENT.clickOnTeacher(i)}}
                            >
                                <Stack direction = 'row' justifyContent='space-between' alignItems='stretch'>
                                    <Stack direction = 'row' justifyContent='center' alignItems='stretch'>
                                        <ListItemAvatar>
                                            <Avatar {...colorProperty}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={teachers[i].name}/>
                                    </Stack>
                                    <Box>
                                        <ListItemText primary={`${teachers[i].availableSlots}`}/>
                                    </Box>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                    )
                    items.push(item)            
            }
            if(items.length === 0) {
                item = (
                    <Box sx={{m:'3%'}}>
                        <Typography variant='body1' color='text.secondary' >
                            {STRINGS.app.dashboard.students.noTeacher}
                        </Typography>
                    </Box>
                )
                items.push(item)
            }
            return items
        },

        generateStudentsList: (students) => {
            let items = [], item
            for(let i=0;i<students.length;i++) {
                let colorProperty = avatar.stringAvatar(`${students[i].firstName} ${students[i].lastName}`)
                item = (
                    <ListItem disablePadding>
                        <ListItemButton id={students[i].id} onClick = {(event) => {
                            event.preventDefault()
                            handle.TEACHER.clickOnStudent(i)}}
                        >
                            <Stack direction = 'row' justifyContent='space-between' alignItems='stretch'>
                                    <ListItemAvatar>
                                        <Avatar {...colorProperty}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${students[i].firstName} ${students[i].lastName}`}/>
                            </Stack>
                        </ListItemButton>
                    </ListItem>
                )
                items.push(item)
            }
            if(items.length === 0) {
                item = (
                    <Box sx={{m:'3%'}}>
                        <Typography variant='body1' color='text.secondary' >
                            {STRINGS.app.dashboard.teachers.noStudents}
                        </Typography>
                    </Box>
                )
                items.push(item)
            }
            return items
        },

        generateDashboardMessages: (messages) => {
            let content
            if(messages.length === 0) {
                content = (
                    <Typography sx={{ml:'1%', mr:'1%', mb:'1%'}} variant='body1'>
                        Nu ai niciun mesaj primit
                    </Typography>
                )
            } else {
                content = (
                    <Stack direction= 'row'  spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent='space-between' alignItems='center' sx={{ml:'1%', mr:'1%', mb:'1%'}}>
                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.messageUnreadIndex === 0} onClick={handle.TEACHER.clickOnBackMessageArrow}>
                            <ArrowBackIos/>
                        </Button>
                        <Slide direction={slide.direction} in={slide.do} mountOnEnter unmountOnExit>
                            <Typography sx={{xs: 8,md:8, sm:8}} variant='body1' textAlign='center'>
                                {data.views[data.messageUnreadIndex].text}
                            </Typography>
                        </Slide>
                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.messageUnreadIndex === data.views.length-1} onClick={handle.TEACHER.clickOnForwardMessageArrow}>
                            <ArrowForwardIos/>
                        </Button>
                    </Stack>
                )
                
            }

            return content
        }



    }

    const contentGenerator = {
        ADMIN: () => {
            let content

            if(data.users.length === 0 && data.faculties.length === 0) {
                content = (
                        <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                            <DataObject sx={{fontSize: 60, color: 'text.secondary'}}/>
                            <Typography color={'text.secondary'} variant='h6'>Nu există niciun utilizator adăugat. Intră în secțiunea Adăugare utilizator pentru a crea noi utilizatori</Typography>
                            <Typography color={'text.secondary'} variant='h6'>De asemenea nu există nicio facultate adăugată. Intră în secțiunea Adăugare facultate.</Typography>
                        </Stack>
                    )
            } else {
                content = (
                    <Box>
                        <Stack direction = 'column' justifyContent='center' spacing={{ xs: 1, sm: 2, md: 2}} sx ={{m:'2%'}}>
                            <Stack direction= 'row'  spacing={{ xs: 1, sm: 1, md: 2 }} justifyContent='center' alignItems='stretch'>
                                <Paper 
                                        elevation={6}
                                        sx={{ width: {xs: 1, sm:1, md:1}}}
                                    >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            Toți utilizatorii
                                        </Typography>
                                        <Typography sx={{ml:'1%', mr:'1%', mb:'1%', color:'text.secondary'}}  variant='body1'>
                                            Numărul de utilizatori încărcați pe platformă
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                            {data.users.length}
                                        </Typography>
                                    </Stack>
                                </Paper>
                                <Paper 
                                        elevation={6}
                                        sx={{ width: {xs: 1, sm:1, md:1}}}
                                    >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            Utilizatori blocați
                                        </Typography>
                                        <Typography sx={{ml:'1%', mr:'1%', mb:'1%', color:'text.secondary'}}  variant='body1'>
                                            Numărul de utilizatori blocați pe platformă
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                            {data.blockedUsers.length}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                            <Stack direction= 'column'  spacing={{ xs: 1, sm: 1, md: 2 }} justifyContent='center' alignItems='stretch'>
                                <Paper 
                                        elevation={6}
                                        sx={{ width: {xs: 1, sm:1, md:1}}}
                                    >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                           Facultăți
                                        </Typography>
                                        <Typography sx={{ml:'1%', mr:'1%', mb:'1%', color:'text.secondary'}}  variant='body1'>
                                            Numărul de facultăți adăugate pe platformă
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                            {data.faculties.length}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Box>
                )
            }
            return content

        },

        SECRETARY: () => {
            let content
            let colors = {}
            console.log(data.Promotions)
            if(data.Promotions.length === 0) {
                content = (
                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                        <DataObject sx={{fontSize: 60, color: 'text.secondary'}}/>
                        <Typography color={'text.secondary'} variant='h6'>Nu există nicio promoție pentru această facultate. Te rog adaugă mai întai o promoție, apoi adaugă studenții și profesorii</Typography>
                    </Stack>
                )
            } else {
                if(data.Promotions[data.viewIndex].isCurrent) {
                    colors = {
                        bgColorAnnounce: "#3f51b5",
                        bgcolor: "white",
                        color: "#212121",
                        textColorAnnounce: "#fafafa",
                        textColorTime: "#fbc02d"
                    }
                } else {
                    colors = {
                        bgColorAnnounce: "#e0e0e0",
                        bgcolor: "#e0e0e0",
                        color: "#424242",
                        textColorAnnounce: "#424242",
                        textColorTime: "#b71c1c"
                    }
                }
                let projectPlaceholder
                


                let projects
                projects = data.Promotions[data.viewIndex].Projects
                let counterProject = {
                    approved: 0,
                    pending: 0,
                    rejected: 0
                }

                let students = {
                    bachelors: {
                        approved: 0,
                        notapproved: 0
                    },
                    disertations: {
                        approved: 0,
                        notapproved: 0
                    }
                }
                
                let counterMaster = 0
                let counterBachelor = 0
                let studentsData = data.Promotions[data.viewIndex].Students
                for(let i = 0 ; i<studentsData.length; i++) {
                    if(studentsData[i].type === 'MASTER') {
                        counterMaster++
                    } else {
                        counterBachelor++
                    }
                }



                for(let i = 0; i<projects.length;i++) {
                    if(data.secretaries[0].type === 'LICENTA' && projects[i].type === 'LICENTA') {
                        if(projects[i].state === 'APPROVED') {
                            counterProject.approved = counterProject.approved + 1
                            students.bachelors.approved = students.bachelors.approved+1
                        }
                        if(projects[i].state === 'REJECTED') {
                            counterProject.rejected = counterProject.rejected + 1
                        }
                        if(projects[i].state === 'PENDING') {
                            counterProject.pending = counterProject.pending + 1
                        }
                    }
                    if(data.secretaries[0].type === 'MASTER' && projects[i].type === 'MASTER') {
                        if(projects[i].state === 'APPROVED') {
                            counterProject.approved = counterProject.approved + 1
                            students.disertations.approved = students.disertations.approved+1
                        }
                        if(projects[i].state === 'REJECTED') {
                            counterProject.rejected = counterProject.rejected + 1
                        }
                        if(projects[i].state === 'PENDING') {
                            counterProject.pending = counterProject.pending + 1
                        }
                    }

                }



                students.bachelors.notapproved = counterBachelor - students.bachelors.approved
                students.disertations.notapproved = counterMaster - students.disertations.approved
                let numberPlaceholder
                if(data.secretaries[0].type === 'LICENTA') {
                    projectPlaceholder = 'licență'
                    numberPlaceholder = {
                        total: counterBachelor,
                        notProject: students.bachelors.notapproved
                    }
                }
                if(data.secretaries[0].type === 'MASTER') {
                    projectPlaceholder = 'disertație'
                    numberPlaceholder = {
                        total: counterMaster,
                        notProject: students.disertations.notapproved
                    }
                }
                content = (
                    <Box>
                        <Typography sx={{xs: 8,md:8, sm:8, m:'1%'}} variant='h6'>
                            {data.name}
                        </Typography>
                        <Stack direction = 'column' justifyContent='center' alignItems='stretch' spacing={{ xs: 1, sm: 2, md: 2}} sx ={{mb:'2%', ml:'2%', mr:'2%'}}>
                            <Paper elevation={4} sx={{bgcolor: 'white', m:'1%'}}>
                                <Stack direction= 'row'  spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent='center' alignItems='center'>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === 0} onClick={handle.TEACHER.clickOnBackArrow}>
                                            <ArrowBackIos/>
                                        </Button>
                                        <Slide direction={slide.direction} in={slide.do} mountOnEnter unmountOnExit>
                                            <Typography sx={{xs: 8,md:8, sm:8}} variant='h6' textAlign='center'>
                                                {`Promoția ${data.Promotions[data.viewIndex].year.toString()}`}
                                            </Typography>
                                        </Slide>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === data.Promotions.length-1} onClick={handle.TEACHER.clickOnForwardArrow}>
                                            <ArrowForwardIos/>
                                        </Button>
                                </Stack>
                            </Paper>
                            <Stack direction = 'row' justifyContent='center' alignItems='stretch' spacing={{ xs: 1, sm: 2, md: 4}} sx ={{mb:'1%', ml:'1%', mr:'1%'}}>
                                <Typography variant='body1'>
                                    {`Data limită studenți: ${new Date(data.Promotions[data.viewIndex].dateLimitStudents).toLocaleDateString('ro-RO')}`}
                                </Typography>
                                <Typography variant='body1'>
                                    {`Data limită profesori: ${new Date(data.Promotions[data.viewIndex].dateLimitTeachers).toLocaleDateString('ro-RO')}`}
                                </Typography>
                            </Stack>
                            <Stack direction = 'row' justifyContent='center' alignItems='stretch' spacing={{ xs: 1, sm: 2, md: 2}} sx ={{m:'1%'}}>
                                <Paper elevation={6} sx={{bgcolor: 'white', m:'1%', width: 1/2}}>
                                    <Stack direction='column' alignItems='stretch' justifyContent='center' sx ={{m:'2%'}}>
                                        <Typography variant='h6'>
                                            Studenți
                                        </Typography>
                                        <Typography variant='body1' color='text.secondary'>
                                            Numărul total de studenți înscriși în această promoție
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                            {numberPlaceholder.total}
                                        </Typography>
                                    </Stack>
                                </Paper>
                                <Paper elevation={6} sx={{bgcolor: 'white', m:'1%', width:1/2}}>
                                    <Stack direction='column' alignItems='stretch' justifyContent='center' sx ={{m:'2%'}}>
                                        <Typography variant='h6'>
                                            Profesori
                                        </Typography>
                                        <Typography variant='body1' color='text.secondary'>
                                            Numărul total de profesori care coordonează proiecte în această promoție
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                            {data.Promotions[data.viewIndex].Teachers.length}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                            <Stack direction = 'row' justifyContent='center' alignItems='stretch' spacing={{ xs: 1, sm: 2, md: 2}} sx ={{m:'1%'}}>
                                <Paper elevation={6} sx={{bgcolor: 'white', m:'1%', width: 1/2}}>
                                    <Stack direction='column' alignItems='stretch' justifyContent='center' sx ={{m:'2%'}}>
                                        <Typography variant='h6'>
                                            Proiecte
                                        </Typography>
                                        <Typography variant='body1' color='text.secondary'>
                                            {`Situația pe proiecte de ${projectPlaceholder} în funcție de răspunsul dat de profesori pentru această promoție`}
                                        </Typography>
                                        <Table>
                                            <TableBody>
                                                <TableRow key={'projects-pending'}  >
                                                    <TableCell component='th' scope='row'>
                                                        <Typography variant='button' sx={{color:'text.secondary'}}>{STRINGS.app.dashboard.project.pending}</Typography>
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="right">
                                                        <Typography variant='button' sx={{color:'text.secondary'}}>{counterProject.pending}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={'projects-approved'} >
                                                    <TableCell component='th' scope='row'>
                                                        <Typography variant='button' sx={{color:'success.main'}}>{STRINGS.app.dashboard.project.approved}</Typography>
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="right">
                                                        <Typography variant='button' sx={{color:'success.main'}}>{counterProject.approved}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={'projects-rejected'} >
                                                    <TableCell component='th' scope='row'>
                                                        <Typography variant='button' sx={{color:'error.main'}}>{STRINGS.app.dashboard.project.rejected}</Typography>
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="right">
                                                        <Typography variant='button' sx={{color:'error.main'}}>{counterProject.rejected}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Stack>
                                </Paper>
                                <Paper elevation={6} sx={{bgcolor: 'white', mt:'1%', width:1/2}}>
                                    <Stack direction='column' alignItems='stretch' justifyContent='center' sx ={{m:'2%'}}>
                                        <Typography variant='h6'>
                                            Studenți neînscriși
                                        </Typography>
                                        <Typography variant='body1' color='text.secondary'>
                                            Numărul total de studenți neînscriși încă cu o temă de proiect în această promoție
                                        </Typography>
                                        <Typography variant='body1' color='success.main' sx={{fontSize: 64}}>
                                                {numberPlaceholder.notProject}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Box>
                )
            }

            return content 
        },

        TEACHER: () => {
            let content
            let colors = {}

            if(data.views.length === 0) {
                content = (
                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                        <DataObject sx={{fontSize: 60, color: 'text.secondary'}}/>
                        <Typography color={'text.secondary'} variant='h6'>Nu ești adăugat/ă în nicio promoție</Typography>
                    </Stack>
                )
            } else {
                if(data.views[data.viewIndex].isCurrentPromotion) {
                    colors = {
                        bgColorAnnounce: "#3f51b5",
                        bgcolor: "white",
                        color: "#212121",
                        textColorAnnounce: "#fafafa",
                        textColorTime: "#fbc02d"
                    }
                } else {
                    colors = {
                        bgColorAnnounce: "#e0e0e0",
                        bgcolor: "#e0e0e0",
                        color: "#424242",
                        textColorAnnounce: "#424242",
                        textColorTime: "#b71c1c"
                    }
                }
                content = (
                    <Box>
                        <Stack direction = 'column' justifyContent='center' spacing={{ xs: 1, sm: 2, md: 4}} sx ={{mb:'2%', ml:'2%', mr:'2%'}}>
                            <Paper elevation={4} sx={{bgcolor: 'white', mt:'1%'}}>
                                <Stack direction= 'row'  spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent='center' alignItems='center'>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === 0} onClick={handle.TEACHER.clickOnBackArrow}>
                                            <ArrowBackIos/>
                                        </Button>
                                        <Slide direction={slide.direction} in={slide.do} mountOnEnter unmountOnExit>
                                            <Typography sx={{xs: 8,md:8, sm:8}} variant='h6' textAlign='center'>
                                                {data.views[data.viewIndex].title}
                                            </Typography>
                                        </Slide>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === data.views.length-1} onClick={handle.TEACHER.clickOnForwardArrow}>
                                            <ArrowForwardIos/>
                                        </Button>
                                </Stack>
                            </Paper>
                            <Paper 
                                elevation={6}
                                sx={{mb:'2%', ml:'2%', mr:'2%', bgcolor: colors.bgColorAnnounce, color: colors.textColorAnnounce}}
                            >
                                <Stack direction = 'column'>
                                    <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                        {STRINGS.app.dashboard.students.announce}
                                    </Typography>
                                    
                                        {UTILS.generateDashboardMessages(data.views[data.viewIndex].messages.notRead)}
                                </Stack>
                            </Paper>
                            <Stack direction= 'row'  spacing={{ xs: 1, sm: 1, md: 2 }} justifyContent='space-between' alignItems='stretch'>
                                <Paper 
                                    elevation={6}
                                    sx={{ width: {xs: 1, sm:1, md:1/3},bgcolor: data.views[data.viewIndex].dateLimits.teachers.bgcolor, color: data.views[data.viewIndex].dateLimits.teachers.color}}
                                >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            {STRINGS.app.dashboard.teachers.projectsDashboardTitle}
                                        </Typography>
                                        <Stack direction = 'row' justifyContent='space-between' alignItems='center'>
                                            <Typography sx={{ml:'1%', mr:'1%', mb:'1%'}} variant='body1'>
                                                {STRINGS.app.dashboard.teachers.bachelors}
                                            </Typography>
                                            <Switch checked={data.views[data.viewIndex].isCoordinatorBachelors} disabled = {data.views[data.viewIndex].dateLimits.teachers.isOutdated} onChange={handle.TEACHER.changeAvailableBachelorSlots} inputProps={{'aria-label': 'controlled'}}/>
                                            <TextField id='tf-bachelors' variant = 'standard' label = {STRINGS.app.dashboard.teachers.availableSlots} defaultValue={data.views[data.viewIndex].availableSlotsBachelors} disabled = {handle.TEACHER.setDisabledBachelorSlots()} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handle.TEACHER.handleChangeBachelorsSlots} />
                                        </Stack>
                                        <Stack direction = 'row' justifyContent='space-between' alignItems='center'>
                                            <Typography sx={{ml:'1%', mr:'1%', mb:'1%'}} variant='body1'>
                                                {STRINGS.app.dashboard.teachers.disertations}
                                            </Typography>
                                            <Switch checked={data.views[data.viewIndex].isCoordinatorDisertation} onChange={handle.TEACHER.changeAvailableDisertationSlots} disabled = {data.views[data.viewIndex].dateLimits.teachers.isOutdated} inputProps={{'aria-label': 'controlled'}}/>
                                            <TextField id='tf-bachelors' variant = 'standard' label = {STRINGS.app.dashboard.teachers.availableSlots} defaultValue={data.views[data.viewIndex].availableSlotsDisertations} disabled = {handle.TEACHER.setDisabledDisertationSlots()} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handle.TEACHER.handleChangeDisertationSlots} />
                                        </Stack>
                                        <Button sx={{m:'3%'}}onClick={handle.TEACHER.clickOnSaveSlots} disabled = {data.views[data.viewIndex].dateLimits.teachers.isOutdated}>{STRINGS.app.dashboard.teachers.save}</Button>
                                    </Stack>
                                </Paper>
                                <Paper 
                                    elevation={6}
                                    sx={{ width: {xs: 1, sm:1, md:1/3},bgcolor: colors.bgcolor, color: colors.color}}
                                >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            {STRINGS.app.dashboard.teachers.dateLimitSlots}
                                        </Typography>
                                        <Typography sx={{p:'1%'}} variant='subtitle1'>
                                            {data.views[data.viewIndex].dateLimits.teachers.dateLimitSubtitle}.
                                        </Typography>
                                        <Typography sx={{p:'1%'}} variant='subtitle1'>
                                            {data.views[data.viewIndex].dateLimits.teachers.dateLimitSubtitle2}
                                        </Typography>
                                        <Typography sx={{p:'1%', color:data.views[data.viewIndex].dateLimits.teachers.textColorTime}} variant='h3'>
                                            {data.views[data.viewIndex].dateLimits.teachers.numberOfDays}
                                        </Typography>
                                    </Stack>
                                </Paper>
                                <Paper 
                                    elevation={6}
                                    sx={{ width: {xs: 1, sm:1, md:1/3},bgcolor: colors.bgcolor, color: colors.color}}
                                >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            {STRINGS.app.dashboard.teachers.dateLimitRequests}
                                        </Typography>
                                        <Typography sx={{p:'1%'}} variant='subtitle1'>
                                            {data.views[data.viewIndex].dateLimits.students.dateLimitSubtitle}.
                                        </Typography>
                                        <Typography sx={{p:'1%'}} variant='subtitle1'>
                                            {data.views[data.viewIndex].dateLimits.students.dateLimitSubtitle2}
                                        </Typography>
                                        <Typography sx={{p:'1%', color:data.views[data.viewIndex].dateLimits.students.textColorTime}} variant='h3'>
                                            {data.views[data.viewIndex].dateLimits.students.numberOfDays}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Stack>
                            <Stack direction= 'row'  spacing={{ xs: 1, sm: 1, md: 2 }} justifyContent='space-between' alignItems='stretch'>
                                <Stack direction = 'column' spacing={{ xs: 1, sm: 1, md: 2 }} sx={{ width: {xs: 1, sm:1, md:1}}} justifyContent='space-between' alignItems='stretch'>
                                    <Paper 
                                        elevation={6}
                                        sx={{ width: {xs: 1, sm:1, md:1},bgcolor: colors.bgcolor, color: colors.color}}
                                    >
                                        <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                            <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                                {STRINGS.app.dashboard.teachers.requestsBachelorsTitle}
                                            </Typography>
                                            <Typography sx={{m:'1%', fontWeight: 500}} variant='body1' color='text.secondary'>
                                                {STRINGS.app.dashboard.teachers.requestsBachelorSubtitle}
                                            </Typography>
                                            <Table>
                                                <TableBody>
                                                    <TableRow key={'bachelor-pending'}  >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'text.secondary'}}>{STRINGS.app.dashboard.project.pending}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'text.secondary'}}>{data.views[data.viewIndex].projects.bachelorsStatus.pending}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={'bachelor-approved'} >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'success.main'}}>{STRINGS.app.dashboard.project.approved}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'success.main'}}>{data.views[data.viewIndex].projects.bachelorsStatus.approved}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={'bachelor-rejected'} >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'error.main'}}>{STRINGS.app.dashboard.project.rejected}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'error.main'}}>{data.views[data.viewIndex].projects.bachelorsStatus.rejected}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Stack>
                                    </Paper>
                                    <Paper 
                                        elevation={6}
                                        sx={{ width: {xs: 1, sm:1, md:1},bgcolor: colors.bgcolor, color: colors.color}}
                                    >
                                        <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                            <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                                {STRINGS.app.dashboard.teachers.requestsDisertationsTitle}
                                            </Typography>
                                            <Typography sx={{m:'1%', fontWeight: 500}} variant='body1' color='text.secondary'>
                                                {STRINGS.app.dashboard.teachers.requestsDisertationSubtitle}
                                            </Typography>
                                            <Table>
                                                <TableBody>
                                                    <TableRow key={'disertation-pending'}  >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'text.secondary'}}>{STRINGS.app.dashboard.project.pending}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'text.secondary'}}>{data.views[data.viewIndex].projects.disertationsStatus.pending}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={'disertation-approved'} >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'success.main'}}>{STRINGS.app.dashboard.project.approved}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'success.main'}}>{data.views[data.viewIndex].projects.disertationsStatus.approved}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={'disertation-rejected'} >
                                                        <TableCell component='th' scope='row'>
                                                            <Typography variant='button' sx={{color:'error.main'}}>{STRINGS.app.dashboard.project.rejected}</Typography>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="right">
                                                            <Typography variant='button' sx={{color:'error.main'}}>{data.views[data.viewIndex].projects.disertationsStatus.rejected}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Stack>
                                    </Paper>
                                </Stack>
                                <Paper 
                                    elevation={6}
                                    sx={{ width: {xs: 1, sm:1, md:1},bgcolor: colors.bgcolor, color: colors.color}}
                                >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            Studenții tăi pentru licență
                                        </Typography>
                                        {UTILS.generateStudentsList(data.views[data.viewIndex].myStudents.bachelors)}
                                    </Stack>
                                </Paper>
                                <Paper 
                                    elevation={6}
                                    sx={{ width: {xs: 1, sm:1, md:1},bgcolor: colors.bgcolor, color: colors.color}}
                                >
                                    <Stack direction = 'column' justifyContent='center' alignItems='stretch' sx={{m:'2%'}}>
                                        <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                            Studenții tăi pentru disertație
                                        </Typography>
                                        {UTILS.generateStudentsList(data.views[data.viewIndex].myStudents.disertations)}
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Box>
                )
            }
            return content

        },

        STUDENT: () => {
            let content
            if(data.tabs.length > 0) {
                //determine if there are projects
                let project, tileData = {
                    projectName: '',
                    projectType: '',
                    teacherName: '',

                }
                let projects = data.tabs[data.tabIndex].views[data.viewIndex].projects
                for(let i = 0; i < projects.length; i++) {
                    if(projects[i].state === 'APPROVED') {
                        let teachers = data.tabs[data.tabIndex].views[data.viewIndex].teachers
                        for(let j=0;j<teachers.length;j++) {
                            if(teachers[i].teacherId === projects[i].TeacherId) {
                                if(projects[i].type === 'LICENTA') {
                                    tileData = {
                                        projectName: projects[i].name,
                                        projectType: 'Licență',
                                        teacherName: teachers[i].name
                                    }
                                }
                                if(projects[i].type === 'MASTER') {
                                    tileData = {
                                        projectName: projects[i].name,
                                        projectType: 'Disertație',
                                        teacherName: teachers[i].name
                                    }
                                }
                            }
                        }
                    }
                }

                if(
                    tileData.projectName.length > 0 &&
                    tileData.projectType.length > 0 &&
                    tileData.teacherName.length > 0
                ) {
                    project = (
                        <Stack direction = 'column' alignItems='stretch' justifyContent='center' spacing={{xs: 1, sm: 2, md: 2}} sx={{m:'1%'}}>
                            <Typography variant = 'subtitle1'>
                                {`Nume proiect: ${tileData.projectName}`}
                            </Typography>
                            <Typography variant = 'subtitle1'>
                                {`Nume profesor: ${tileData.teacherName}`}
                            </Typography>
                            <Typography variant = 'subtitle1'>
                                {`Tip proiect: ${tileData.projectType}`}
                            </Typography>
                        </Stack>
                    )
                } else {
                    project = (
                        <Stack direction = 'column' alignItems='center' justifyContent='center' spacing={{xs: 1, sm: 2, md: 2}} sx={{m:'1%'}}>
                            <Warning color = 'error' fontSize='large'/>
                            <Typography variant = 'subtitle1' align='center'>
                                Nu ai niciun proiect acceptat de unul din profesori. Urmărește starea cererilor trimise în secțiunea "Cererile mele"
                            </Typography>
                        </Stack>
                    )
                }


                content = (
                    <Box>
                        <Stack direction = 'column' justifyContent='center' spacing={{ xs: 1, sm: 2, md: 4}} sx ={{mb:'2%', ml:'2%', mr:'2%'}}>
                            <Paper elevation={4} sx={{mb:'1%', bgcolor: '#F9F9F9'}}>
                                <Stack direction= 'row'  spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent='center' alignItems='center'>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === 0} onClick={handle.STUDENT.clickOnBackArrow}>
                                            <ArrowBackIos/>
                                        </Button>
                                        <Slide direction={slide.direction} in={slide.do} mountOnEnter unmountOnExit>
                                            <Typography sx={{xs: 8,md:8, sm:8}} variant='h6' textAlign='center'>
                                                {data.tabs[data.tabIndex].views[data.viewIndex].title}
                                            </Typography>
                                        </Slide>
                                        <Button sx={{xs: 2,md:2, sm:2}} variant='text' disabled = {data.viewIndex === data.tabs[data.tabIndex].views.length-1} onClick={handle.STUDENT.clickOnForwardArrow}>
                                            <ArrowForwardIos/>
                                        </Button>
                                </Stack>
                            </Paper>
                            <Paper 
                                elevation={6}
                                sx={{mb:'2%', ml:'2%', mr:'2%', bgcolor: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.bgColorAnnounce, color: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.textColorAnnounce}}
                            >
                                <Stack direction = 'column'>
                                    <Typography sx={{m:'1%', fontWeight: 500}} variant='h6'>
                                        {STRINGS.app.dashboard.students.announce}
                                    </Typography>
                                    <Typography sx={{ml:'1%', mr:'1%', mb:'1%'}} variant='body1'>
                                        Lorem ipsum....
                                    </Typography>
                                </Stack>
                            </Paper>
                            <Stack direction={{ xs: 'column', sm: 'column', md:'row' }} justifyContent = 'stretch' spacing={{ xs: 1, sm: 2, md: 2}} sx ={{ mb:'2%', ml:'2%', mr:'2%', width: 1}}>
                                <Stack direction='column' spacing={{ xs: 1, sm: 1, md: 1 }} sx={{width: { xs: 1, sm: 1, md: 1/2}}}>
                                        <Paper elevation={6} sx={{bgcolor: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.bgcolor, color: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.color}}>
                                            <Box sx={{m:'1%'}}>
                                                <Typography sx={{p:'1%', fontWeight: 500}} variant='h6'>
                                                    {STRINGS.app.dashboard.students.dateLimitTitle}
                                                </Typography>
                                                <Typography sx={{p:'1%'}} variant='subtitle1'>
                                                    {data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.dateLimitSubtitle}.
                                                </Typography>
                                                <Typography sx={{p:'1%'}} variant='subtitle1'>
                                                {data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.dateLimitSubtitle2}
                                                </Typography>
                                                <Typography sx={{p:'1%', color:data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.textColorTime}} variant='h3'>
                                                    {data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.numberOfDays}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                        <Paper elevation={3} sx={{bgcolor: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.bgcolor, color: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.color}}>
                                            <Typography sx={{p:'1%', fontWeight: 500}} variant='h6'>
                                                    {STRINGS.app.dashboard.students.myProject}
                                            </Typography>
                                            <Box sx={{pt: '2%'}}>
                                                {project}
                                            </Box>
                                        </Paper>
                                </Stack>
                                <Paper elevation={6} sx={{bgcolor: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.bgcolor, color: data.tabs[data.tabIndex].views[data.viewIndex].dateLimit.color, overflow: 'auto', width: { xs: 1, sm: 1, md: 1/2}}}>
                                    <Stack sx={{p:'2%', width:1}} direction='column' justifyContent='space-between' alignItems='stretch'>
                                        <Typography sx={{p:'2%', fontWeight: 500}} variant='h6'>Lista de profesori coordonatori</Typography>
                                        <Stack sx={{p:'2%', width:1}} direction='row' justifyContent='space-between' alignItems='stretch'>
                                            <Typography color={'text.secondary'} variant='body1'>
                                                Profesori
                                            </Typography>
                                            <Typography color={'text.secondary'} variant='body1'>
                                                Locuri disponibile
                                            </Typography>
                                        </Stack>
                                        {UTILS.generateTeacherList(data.tabs[data.tabIndex].views[data.viewIndex].teachers)}
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Box>
                )
            } else {
                content = (
                    <Stack sx={{p:'2%'}} direction='column' alignItems='center' justifyContent='center' spacing={1}>
                        <DataObject sx={{fontSize: 60, color: 'text.secondary'}}/>
                        <Typography color={'text.secondary'} variant='h6'>Nu ești adăugat/ă în nicio promoție</Typography>
                    </Stack>
                )
            }
            return content

        }
    }

    const refreshEducationDataStudent = (index) => {
        if(data.educationForms[index].value === 'LICENTA') {

        }
        if(data.educationForms[index].value === 'MASTER') {

        }
    }

    React.useEffect(() => {
        if(props.data) {
            if(loading) {
                setData({
                    tabIndex: 0,
                    viewIndex: 0,
                    messageReadIndex: 0,
                    messageUnreadIndex: 0,
                    messageAllIndex: 0,
                    ...props.data
                })
                setLoading(false)
            }
            console.log(data)
        }
        return () => {
            setData({
                tabIndex: 0,
                viewIndex: 0,
                messageReadIndex: 0,
                messageUnreadIndex: 0,
                messageAllIndex: 0,
                ...props.data
            })
        }
            
    }, [props.data])

    const callback = (redirect) => {
        if(redirect){
          props.callback(redirect)
        }
    }

    const initRender = (role) => {
        console.log(role)
        switch(role) {
            case 'ADMIN':
                console.log(data)
                return initContent.ADMIN()
                break
            case 'SECRETARY':
                return initContent.SECRETARY()
            case 'STUDENT':
                return initContent.STUDENT()
            case 'TEACHER':
                return initContent.TEACHER()
        }
    }

    const generateDashboardContent = (role) => {
        switch(role) {
            case 'ADMIN':
                return contentGenerator.ADMIN()
            case 'SECRETARY':
                return contentGenerator.SECRETARY()
            case 'STUDENT':
                return contentGenerator.STUDENT()
            case 'TEACHER':
                return contentGenerator.TEACHER()
        }
    }

    return (
        !loading ? (
            <Box sx={{bgcolor: grey[100], p: 3, height: '100vh'}} display='flex' flexDirection='column'>
                <Typography variant='h4'>Dashboard</Typography>
                {initRender(cookies.get('rls'))}
                <Box>
                    {generateDashboardContent(cookies.get('rls'))}
                </Box>
            </Box>
        ) : (
            <Backdrop open={loading} sx={{alignItems:'center'}}>
                <CircularProgress sx={{color:'white'}} />
            </Backdrop>
        )
    )
}