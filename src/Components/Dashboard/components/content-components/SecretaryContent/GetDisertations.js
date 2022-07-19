import * as React from 'react'
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
} from '@mui/x-data-grid'
import { 
  Box,
  LinearProgress,
  Backdrop,
  CircularProgress,
  Typography,
  Button,
  Input,
  Snackbar,
  Alert,
  InputLabel,
  NativeSelect,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { 
  FileUpload,
  GroupAdd,
  Add,
  Refresh
} from '@mui/icons-material';
import utils from '../../../../utils/utils'
import DialogForm from '../recycled-components/DialogForm';
import stringConstants from '../../../../utils/constants/stringConstants';



export default function GetDisertations(props) {
    const [loading, setLoading] = React.useState(true)
    const [dataRows, setDataRows] = React.useState([])
    const [gridAlert, setGridAlert] = React.useState({isError: false, severity: "error", textError: ""})
    const [gridDialog, setGridDialog] = React.useState()
    const [gridRows, setGridRows] = React.useState([])
    const [gridColumns, setGridColumns] = React.useState([])
    let initial = true
    const [data, setData] = React.useState()

    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .ant-empty-img-1': {
          fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
          fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
          fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
          fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
          fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
          fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
      }));
      
      function NoDataOverlay() {
        return (
          <StyledGridOverlay>
            <svg
              width="120"
              height="100"
              viewBox="0 0 184 152"
              aria-hidden
              focusable="false"
            >
              <g fill="none" fillRule="evenodd">
                <g transform="translate(24 31.67)">
                  <ellipse
                    className="ant-empty-img-5"
                    cx="67.797"
                    cy="106.89"
                    rx="67.797"
                    ry="12.668"
                  />
                  <path
                    className="ant-empty-img-1"
                    d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                  />
                  <path
                    className="ant-empty-img-2"
                    d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                  />
                  <path
                    className="ant-empty-img-3"
                    d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                  />
                </g>
                <path
                  className="ant-empty-img-3"
                  d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                />
                <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                  <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                  <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                </g>
              </g>
            </svg>
            <Box sx={{ mt: 1 }}>Nu exista date</Box>
          </StyledGridOverlay>
        );
      }

      const callbackGridDialog = async (type, dialogData) => {
        console.log(dialogData, type)
        if(type === 'close') {
          setGridDialog({...gridDialog, open: false, dataToSend: {}})
        }
        //Check the validations
        if(type === 'accepted') {
          let ok = true
            if(
              dialogData.dataToSend.hasOwnProperty('email') &&
              dialogData.dataToSend.hasOwnProperty('lastName') &&
              dialogData.dataToSend.hasOwnProperty('firstName') &&
              dialogData.dataToSend.hasOwnProperty('identityId') &&
              dialogData.dataToSend.hasOwnProperty('type') &&
              dialogData.dataToSend.hasOwnProperty('educationForm') &&
              dialogData.dataToSend.hasOwnProperty('budgetForm')
            ) {
              if(utils.validations.email(dialogData.dataToSend.email)) {
                if(
                  !utils.validations.validateStringLength(dialogData.dataToSend.lastName) &&
                  !utils.validations.validateStringLength(dialogData.dataToSend.firstName) 
                ) {
                  if(utils.validations.validateIdentityId(dialogData.dataToSend.identityId)) {
                    let row = {id: gridRows.length+1, ...dialogData.dataToSend}
                    setGridRows([...gridRows, row])
                  } else {
                    ok = false
                    setGridAlert({isError: true, severity: 'error', textError: stringConstants.error.secretaries.addStudents.identityId})
                  }
                } else {
                  ok = false
                  setGridAlert({isError: true, severity: 'error', textError: stringConstants.error.secretaries.addStudents.nameLength})
                }
              } else {
                ok = false
                setGridAlert({isError: true, severity: 'error', textError: stringConstants.error.email})            
              }
            }  else {
              ok = false
              setGridAlert({isError: true, severity: 'error', textError: stringConstants.error.secretaries.addStudents.noData})
            }
    
          if(ok) {
            setGridDialog({...gridDialog, open: false, dataToSend: {}})
          }
        }
      }


    const handleClick = async (event, index) => {
      event.preventDefault()
      console.log(index)
      const button = data.page.buttons[index]

      if(button.action === 'dialog') {
        const dialogData = await utils.app.getDialogData(button.type)
        setGridDialog(dialogData.data)
      }
     
      if(button.action === 'submit') {
          if(gridRows.length > 0) {
            let dataToSubmit
            if(button.type === 'register-students') {
              dataToSubmit = []
              gridRows.forEach(element => {
                dataToSubmit.push({...element, facultyId: data.facultyId, PromotionId: data.promotionId})
              });
            }
            console.log(data)
            const sendData = await utils.app.sendDataByType(button.type, dataToSubmit)
            if(!sendData.status) {
              setGridAlert({isError: true, severity: 'error', textError: stringConstants.error.secretaries.addData.notAdd})    
            } else {
              setGridAlert({isError: true, severity: 'success', textError: stringConstants.error.secretaries.addData.successAll}) 
            } 
            setGridRows([...sendData.data])
          }
      }

      if(button.action === 'refresh') {
        const proj = await utils.user.projects.getApproved({
          year: data.selectedYear,
          facultyId: data.FacultyId,
          type: 'MASTER'
        })
        generateRows(proj.data)
        console.log(gridRows)
      }

    }

    const handleUploadExcel = (event) => {
      event.preventDefault()
      if(event.target.files) {
          const reader = new FileReader()
          let tempRows = []
          reader.onload = (e) => {
              let excelData = utils.app.xlsxToJSON(e)
              let numberOfRows = data.dataGrid.settings.rows.length
              
              for(let i = 0; i < excelData.length; i++) {
                tempRows.push({id:numberOfRows+1, ...excelData[i]})
                numberOfRows++
              }
              setGridRows([...gridRows, ...tempRows])
          }
          reader.readAsArrayBuffer(event.target.files[0])
          
      }
    }

    const generateRows = (data) => {
      let rows = [], row
      for(let i = 0 ; i< data.length; i++) {
        row={
          id: i,
          studentName: `${data[i].Student.Profile.lastName} ${data[i].Student.Profile.firstName}`,
          projectName: data[i].name,
          teacherName: `${data[i].Teacher.Profile.lastName} ${data[i].Teacher.Profile.firstName}`,
          status: data[i].state
        }

        rows.push(row)
      }

      setGridRows([...rows])
    }
    
    React.useEffect(() => {
      const getData = async (props) => {
        if(props.data.hasOwnProperty('page')) {

          if(initial) {
            setGridRows([...props.data.dataGrid.settings.rows])
            setGridColumns([...props.data.dataGrid.settings.columns])
            let settings = {}
            Object.keys(props.data.dataGrid.settings).forEach(function(key){
              if (props.data.dataGrid.settings[key] !== 'rows' || props.data.dataGrid.settings[key] !== 'columns' ) {
                settings[key] = props.data.dataGrid.settings[key] 
              }
            });
              setData({
                ...props.data,
                page: props.data.page,
                dataGrid: {
                  ...props.data.dataGrid,
                  isEditable: props.data.dataGrid.isEditable,
                  settings: settings,
                  selectedItems: []
                },
                selectedYear:props.data.page.buttons[0].values[0]
              })
              initial = false
          }

          setLoading(false)
        }
  
      }

      getData(props)
    }, [props])

    const generateIcon = (iconType) => {
            return <Refresh/>
    }

    const generateOptions = (values) => {
        let options = []
        let option
        for(let i=0;i<values.length;i++) {
            option = (
                <MenuItem value={values[i]}>{values[i]}</MenuItem>
            )
            options.push(option)
        }
        return options
    }

    const handleNativeSelect = async (e) => {
        console.log(e)
        const proj = await utils.user.projects.getApproved({
          year: e.target.value,
          facultyId: data.FacultyId,
          type: 'MASTER'
        })
        setData({...data, selectedYear: e.target.value})
        generateRows(proj.data)
        console.log(gridRows)

    }

    const generateButtons = (data) => {
      let contents = []
      console.log(data)
      for(let index=0; index<data.page.buttons.length; index++) {
        let content
          if(data.page.buttons[index].isUploadButton) {
            content = (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <label htmlFor="contained-button-file">
                <Input style={{display: 'none'}} accept="image/*" id="contained-button-file" type="file" onChange={handleUploadExcel}/>
                    <Button variant="text" disabled = {data.page.buttons[index].isDisabled} component="span">
                    {generateIcon(data.page.buttons[index].icon)} {data.page.buttons[index].text}
                    </Button>
                </label>
            </FormControl>
)
          } else {
              if(data.page.buttons[index].hasOwnProperty('isSelectInput')) {
                content = (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id={data.page.buttons[index].props.labelId} >
                            {data.page.buttons[index].text}
                        </InputLabel>
                        <Select {...data.page.buttons[index].props} onChange = {handleNativeSelect}>
                            {generateOptions(data.page.buttons[index].values)}
                        </Select>
                    </FormControl>
                  )
              } else {
                content = (
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Button sx= {{p:'1%', pt:2}} variant='text' disabled = {data.page.buttons[index].isDisabled} component='span' onClick={(event) => {
                        event.preventDefault()
                        handleClick(event, index)}}>
                        {generateIcon(data.page.buttons[index].icon)} {data.page.buttons[index].text}
                        </Button>
                    </FormControl>
                  )
              }

          }
        contents.push(content)
      }

      return (
        <Box sx = {{pb:'1%', pt:'1%'}}>
          {contents}
        </Box>
      )
    }

    const handleCloseGridAlert = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setGridAlert(previous => ({...previous, isError: false, textError: ""}))
  }


    return (
      loading ? (
        <Backdrop open={loading} sx={{position:'absolute', zIndex:1, alignItems:'center'}}>
          <CircularProgress sx={{color:'white'}} />
        </Backdrop>
      ) : (
        <Box sx={{p : 3, height: '100vh'}}>
          <Box>
            <Box>
              <Typography variant = 'h4'>
                {data.page.title}
              </Typography>
            </Box>
            <div>
                {generateButtons(data)}
            </div>
            

              <div style={{ display: 'flex', height:'80vh'}}>
                <div style={{ flexGrow: 1 }}>
                  {data.dataGrid.settings.show ? (
                    <DataGrid
                      experimentalFeatures={{ newEditingApi: true }}
                      {...data.dataGrid.settings}
                      components = {{
                        Toolbar: GridToolbar,
                        LoadingOverlay: LinearProgress,
                        NoRowsOverlay: NoDataOverlay 
                      }}
                      rows = {gridRows}
                      columns = {gridColumns}
                      onSelectionModelChange={(ids) => {
                          const selectedIDs = new Set(ids)
                          const selectedRowData = dataRows.filter((row) => selectedIDs.has(row.id))
                          if(!(selectedRowData === undefined) || (selectedRowData.length > 0)) {
                              console.log(selectedRowData)
                          }
                      }}
                      selectionModel = {data.dataGrid.selectedItems}
                    />
                  ) : (
                    <Box></Box>
                  )}
                </div>
              </div>
          </Box>
          <DialogForm data = {gridDialog} callback = {callbackGridDialog} />
          <Snackbar open={gridAlert.isError} autoHideDuration={6000} onClose={handleCloseGridAlert}>
            <Alert onClose={handleCloseGridAlert} severity={gridAlert.severity} sx={{ width: '100%' }}>
              {gridAlert.textError}
            </Alert>
          </Snackbar>
        </Box>
      )     
    )
}