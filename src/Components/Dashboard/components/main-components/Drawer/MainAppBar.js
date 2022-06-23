import { Toolbar, Button,  AppBar, IconButton, Typography, Badge, Box, Menu, Tooltip, MenuItem, Avatar, Dialog, DialogActions } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import * as React from 'react';
import utils from '../utils/utils';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import hostURL from '../../../../utils/constants/hostURL';
import * as API_URL from '../../../../utils/constants/urlConstants'
import ProfileContent from './ProfileContent';



export default function MainAppBar(props) {
    const [appBarData, setAppBarData] = React.useState({appName: '', width: 200})
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [avatar, setAvatar] = React.useState({})
    const [badgeNotificationsNumber, setBadgeNotificationsNumber] = React.useState(0)
    const [isRender, setIsRender] = React.useState(true)
    const [openProfile, setOpenProfile] = React.useState(false)
    const [profileData, setProfileData] = React.useState({})
    const navigate = useNavigate()
    const cookies = new Cookies()
    const BASE_URL = hostURL()
    const GET_USER_PROFILE = BASE_URL + API_URL.API_GET_PROFILE_ENDPOINT

    React.useEffect(() => {
        if(isRender && props.width && props.appName){
            setAppBarData({appName: props.appName, width: props.width})
            const fn = cookies.getAll()
            const avatarStyle = utils.stringAvatar(`${String(fn.fn)} ${String(fn.ln)}`)
            setAvatar(avatarStyle)
        }
        return () => {
            setIsRender(false)
        }
    }, [props.width, props.appName, appBarData, avatar])


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (e) => {
        setAnchorElUser(null);
        switch (e.target.innerHTML) {
            case "Profil":
                console.log("PROFIL")
                
                const GET_PROFILE_URL = BASE_URL + API_URL.API_GET_PROFILE_ENDPOINT + cookies.get('id')
                axios.get(GET_PROFILE_URL, {headers: {"Authorization" : `Bearer ${cookies.get('s')}`}})
                .then((results) => {
                    setProfileData(results.data.details.userData)
                    setOpenProfile(true)
                })
                break
            case "Logout":
                console.log("LOGOUT")
                cookies.remove('s')
                navigate('/login')
                break
        }
    };

    const primary = '#ffffff'

    const handleCloseProfile = (e) => {
        setOpenProfile(false)
    }


    return (
        <AppBar elevation={0} position="fixed" sx={{width: { sm: `calc(100% - ${appBarData.width}px)` }, ml: { sm: `${appBarData.width}px` }, bgcolor: primary}}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" color='black'>
                    {appBarData.appName}
                </Typography>
                <Box sx={{ml:'auto', mr:'10px'}} justifyContent="center" alignItems="center">
                    <IconButton sx = {{mr:'10px'}} fontSize='large' aria-label='show notifications' color='primary'>
                        <Badge badgeContent={0} showZero color='error'>
                            <Notifications/>
                        </Badge>
                    </IconButton> 
                    <Tooltip title = 'Setari cont'>
                        <IconButton onClick={handleOpenUserMenu} sx={{p:0}}>
                            <Avatar {...avatar}/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin = {{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open = {Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {utils.USERMENU.map((avatarmenu) => (
                            <MenuItem key={avatarmenu} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{avatarmenu}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>                  
                </Box>
            </Toolbar>
            
            <Dialog
                fullWidth={true}
                maxWidth={'xl'}
                open={openProfile}
                onClose={handleCloseProfile}
            >
                <ProfileContent data={profileData}/>
                <DialogActions>
                    <Button variant = 'text' onClick={handleCloseProfile}>OK</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    )
}