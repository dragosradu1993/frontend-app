import { Toolbar, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import getData from '../../../../utils/getData';


export default function AppLogo(props) {
    const [logoData, setLogoData] = React.useState({
        src: '',
        loading: true,
    })

    React.useEffect(() => {
        if(props.logoPath.length > 0) setLogoData({src: getData.getImagePath(props.logoPath), loading:false})
    }, [props])

    return(
        <Toolbar>
            <Box justifyContent="center" alignItems="center">
                {
                    !logoData.loading ? (<img src={logoData.src} style={{maxWidth:'100%'}}/>) : (<Skeleton sx={{ width: '100%', height: '100%', p: '10px' }} width={80} height={80} variant = 'rectangular'  animation="wave" />)
                }
            </Box>
        </Toolbar>
    )
}