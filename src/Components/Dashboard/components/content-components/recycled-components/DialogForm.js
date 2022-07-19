import * as React from 'react'
import { 
    Autocomplete, 
    Divider, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions, 
    Button,
    Box,
    Backdrop,
    CircularProgress 
} from '@mui/material'
import * as COMPONENT from '../../../../utils/constants/parametersContstants'
import stringConstants from '../../../../utils/constants/stringConstants'


export default function DialogForm(props) {
    const [data, setData] = React.useState(COMPONENT.constantsParameters.dialog.general)
    const [dataToSend, setDataToSend] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [backdrop, setbackdrop] = React.useState(false)

    React.useEffect(() => {
        if(props.data){
            setData({...props.data})
            setbackdrop(false)
            setLoading(false)
        }
    } , [props.data])

    const handleCloseDialog = (e) => {
        e.preventDefault()
        setData({...data, open: false})
        props.callback("close" , {...props.data, open: false})
    }

    const handleClick = (e) => {
        e.preventDefault()
        if(data.location === 'reset-password') {
            setData({...data, open: false})
        }
        console.log(Object.keys(dataToSend))
        setData({...data, backdrop: true})
        props.callback("accepted", {...props.data, dataToSend: dataToSend})
        
        
    }

    const handleChange = (prop) => (event) => {
        setDataToSend({...dataToSend, [prop]:event.target.value})
    }

    const textFieldGenerator = (item) => {
        if(item.multiline) {
            return (
                <TextField
                    fullWidth
                    id={`${item.id}`}
                    label={item.label}
                    onChange={handleChange(`${item.valueType}`)}
                    required = {item.isRequired}
                    multiline
                    rows={8}
                    type = {item.type}
                    margin="normal"
                    inputProps={{
                        'aria-label': `${item.sendKey}`
                    }}
                />
            )
        } else {
            return (
                <TextField
                    fullWidth
                    id={`${item.id}`}
                    label={item.label}
                    onChange={handleChange(`${item.valueType}`)}
                    required = {item.isRequired}
                    type = {item.type}
                    margin="normal"
                    inputProps={{
                        'aria-label': `${item.sendKey}`
                    }}
                />
            )
        }
    }

    return (
        loading ? (
            <div></div>
        ) : (
            <React.Fragment>
                <Dialog open={props.data.open} onClose={handleCloseDialog}>
                    <Backdrop open={props.data.backdrop}>
                        <CircularProgress/>
                    </Backdrop>
                    <DialogTitle>
                        {data.title}
                    </DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <DialogContentText>
                            {data.description}
                        </DialogContentText>
                        {loading ? ( <div></div>) : (
                            data.content.map((item, index) => (
                            <Box>
                                <DialogContentText sx={{pb:'1%'}}>
                                    {item.description}
                                </DialogContentText>
                                {loading ? (<div></div>) : (
                                    item.fields.map((fieldItem, index) => (
                                    <Box>
                                        {fieldItem.isAutocomplete ? (
                                            <Autocomplete
                                                onChange={(event, value) => setDataToSend({...dataToSend, [value.key]: value.value})}
                                                options = {fieldItem.options}
                                                getOptionLabel = {(option) => option.title}
                                                autoComplete
                                                includeInputInList
                                                renderInput={(params) => (
                                                    <TextField {...params} label={fieldItem.label} variant="standard"/>
                                                )}
                                            />
                                        ) : (
                                            textFieldGenerator(fieldItem)
                                        )}
                                    </Box>)))}
                                <Divider/>
                            </Box>)))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>
                            {stringConstants.buttons.cancel}
                        </Button>
                        <Button onClick = {handleClick}>
                            {stringConstants.buttons.ok}
                        </Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>    
        )


    )

}