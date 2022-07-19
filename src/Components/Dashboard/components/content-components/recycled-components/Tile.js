import * as React from 'react'
import { CardContent, CardActions, Typography, Button, Box, Card, Skeleton } from '@mui/material'

export default function Tile(props) {
    const [tileData, setTileData] = React.useState(props.data)
    const [isRender, setIsRender] = React.useState(true)
    const [loading, setLoading] = React.useState(true)
    const [cardColor, setCardColor] = React.useState('white')

    React.useEffect(() => {
        if(isRender && props.hasOwnProperty('data')) {
            setTileData(props.data)
            setCardColor(props.data.cardColor)
            setLoading(false)
        }
    }, [props])

    const handleClickDetails = (e) => {
        e.preventDefault()
        props.callback(tileData.title)
    }

    return(
        <React.Fragment>
            <Card sx={{bgcolor: cardColor}}>
                { loading ? 
                (
                    <Box sx={{ p:'10%' }}>
                        <Skeleton variant='text'/>
                        <Skeleton variant='text'/>
                        <Skeleton variant='text'/>
                    </Box>
                ):(                
                    <Box>
                        <CardContent>
                            <Typography variant={tileData.titleVariant} sx={{color: tileData.titleColor}} component="div">
                                {tileData.title}
                            </Typography>
                            <Typography variant={tileData.valueVariant} sx={{color: props.data.valueColor}}>
                                {tileData.value}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button sx={{color:'#1a1a1a'}} size="small" onClick={handleClickDetails}>Vezi detalii</Button>
                        </CardActions>
                    </Box>
                )}
            </Card>
        </React.Fragment>
    )

}