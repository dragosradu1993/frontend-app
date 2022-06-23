import * as React from 'react'
import Box from '@mui/material/Box';
import getData from '../../utils/getData';

export default function AppLogo(props) {
    const [logoImage, setLogoImage] = React.useState()
    const [isRender, setIsRender] = React.useState(true)

    React.useEffect(() => {
        if(isRender && props.path) {
            setLogoImage(getData.getImagePath(props.path))
        }

        return () => {
            setIsRender(false)
        }
    }, [props.path, logoImage])

    return(
        <Box alignItems="center" justifyContent="center" display="flex">
            <img src={logoImage} style={{width: props.width}}/>
        </Box>
    )
}