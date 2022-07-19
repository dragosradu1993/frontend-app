
import { Divider, ListItem, ListItemButton, ListItemText, ListItemIcon, Skeleton, Box, List } from '@mui/material';
import { Inbox, Email, Add, Dashboard, Folder, People, Group, Message, PersonAddAlt, School, AddComment, AccountBalance } from '@mui/icons-material';
import * as React from 'react';
import AppLogo from './AppLogo';
import hostURL from '../../../../utils/constants/hostURL';
import getData from '../../../../utils/getData';
import axios from 'axios'
import * as API_URL from '../../../../utils/constants/urlConstants'
import Cookies from 'universal-cookie'
import StringToReact from 'string-to-react'


const BASE_URL = hostURL()
const GET_MAIN_MENU_URL = BASE_URL + API_URL.API_GET_MAIN_MENU
const cookieData  = new Cookies()


export default function AppMenu(props) {
    //const [imagePath, setImagePath] = React.useState('')
    //const [menuItems, setMenuItems] = React.useState()
    //const [isRender, setIsRender] = React.useState(true)
    //const [loading, setLoading] = React.useState(true)

    const [appMenuData, setAppMenuData] = React.useState({
        loading: true,
        logoPath: '',
        menuItems: null
    })

    const [selectedIndex, setSelectedIndex] = React.useState(0)
    
    const generateMenuIcon = (iconString) => {
        switch (iconString) {
            case '<Dashboard/>':
                return <Dashboard/>
            case "<Folder/>":
                return <Folder/>
            case "<People/>":
                return <People/>
            case "<Group/>":
                return <Group/>
            case "<Message/>":
                return <Message/>
            case "<PersonaAddAlt/>":
                return <PersonAddAlt/>
            case "<School/>":
                return <School/>
            case "<AddComment/>":
                return <AddComment/>
            case "<Add/>":
                return <Add/>
            case "<AccountBalance/>":
                return <AccountBalance/>
            default:
                return <Dashboard/>
        }
    }



    React.useEffect(async () => {
        async function fetchData() {
            const s = cookieData.get('s')
            const menuBody = {
                'id': getData.getIDFromToken(s)
            } 
            const respMenu = await axios.get(GET_MAIN_MENU_URL, {
                headers: {
                "Authorization" : `Bearer ${s}`
                }, 
                params: menuBody})
        
            if(respMenu.status === 200) {
                setAppMenuData(state => ({...state,
                    loading: false,
                    logoPath: props.logoPath,
                    menuItems: respMenu.data.menuList
                }))
            }
        }
        fetchData()
    }, [props])

    const handleClick = (index) => {
        setSelectedIndex(index)
        props.callback(appMenuData.menuItems[index])
    }

    return (
        <div>
            { appMenuData.loading ? (
                <div>
                <AppLogo logoPath = {appMenuData.logoPath}/>
                <Box>
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                    <Skeleton sx={{ p: '10px' }} variant = 'text' animation="wave" />
                </Box>
                </div>
                
            ):(
                <div>
                    <AppLogo logoPath = {appMenuData.logoPath}/>
                    <List component="nav" aria-label="main app menu">
                        {appMenuData.menuItems.map((item, index) => (
                            <ListItemButton 
                                selected={selectedIndex === index}
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleClick(index)}}
                                key = {item.redirect}
                            >
                                <ListItemIcon>
                                    {generateMenuIcon(item.icon)}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
            )}            
            <Divider/>
        </div>
    )
}