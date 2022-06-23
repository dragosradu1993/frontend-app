import * as React from 'react'
import { 
    Box,
    Button,
    Input,
    Typography, 
} from '@mui/material'

import {
    FileUpload,
    Add,
    GroupAdd
} from '@mui/icons-material'
import DataTable from '../recycled-components/DataTable'
import { STUDENTS_TABLE_COLUMNS } from '../../../../utils/constants/tableConstants'
import Cookies from 'universal-cookie'
import secretaryContent from './utils/secretaryContent.utils'
import utils from '../AdminContent/utils/utils'


export default function SecretaryDataTable(props) {
    const [data, setData] = React.useState({
        title: '',
        tableType: '',
        loading: true,
        pageContent: {
            existImportExcel: false,
            isAddedFile: false,
            existManualAdd: false,
            manualAddLabel: '',
            existRegister: false,
            registerLabel: '',
            existRefresh: false,
            refreshLabel: ''
        },
        toSend: {
            data: null,
            url: null,
            token: null
        },
        promotions: null,
        dataGrid: {
            show: false,
            columns: null,
            rows: null,
            isSelectable: false,
            selectedRows: null
        },
        isDialog: false,
        dialog: {
            showDialog: false,
            title: '',
            content: {
                text: '',
                content: null
            }
        }
    })

    const cookies = new Cookies()

    const getAddDataByRole = async (type) => {
        const results = await secretaryContent.getAllByRole(cookies.get('s'),secretaryContent.getRoleByType(type))
        console.log(results)
    }

    React.useState(() => {
        if(props.data.title.length > 0) {
            setData(props.data)
            getAddDataByRole(props.data.type)
            
            
        }
        console.log(data)
    }, [props.data])

    const handleClickManualAdd = (e) => {
        console.log(data)
        console.log(e)
    }

    const handleClickRegister = (e) => {
        console.log(e)
    }

    const handleUploadExcel = (e) => {
        e.preventDefault()
        let rows = []
        if(e.target.files) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const tempJSON = utils.xlsxToJSON(e)
                let tempColumns
                if(tempJSON.length > 0) {
                    switch (data.type) {
                        case 'Students':
                            tempColumns = STUDENTS_TABLE_COLUMNS
                            break
                        case 'Teachers':
                            break
                    }

                    
                    for(let i=0;i<tempJSON.length; i++){   
                        let tempData = {}
                        for(let i=0;i<tempColumns.length;i++) {
                            Object.keys(tempJSON[i]).forEach(function eachKey(key) {
                                console.log(tempJSON[i][key])
                                if(tempColumns[i].field === key) {
                                    tempData[key] = tempJSON[i][key]
                                }
                                if(tempColumns[i].headerName === key) {
                                    tempData[tempColumns[i].field] = tempJSON[i][key]
                                }
                            })
                        }                              
                        tempData.id = rows.length+1
                        console.log(tempData)
                        const newRow = JSON.parse(JSON.stringify(tempData))
                        rows = [...rows, newRow]
                    }
                    setData({...data,dataGrid:{...data.dataGrid, rows: [...data.dataGrid.rows, rows]}})
                    console.log(data)
                }
            }
            reader.readAsArrayBuffer(e.target.files[0])
           
        }
    }  
    



    const callback = (selectedRows) => {
        setData({...data, dataGrid:{...data.dataGrid, selectedRows:selectedRows}})
    }

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{height: '100%'}}>
            <Box gridColumn="span 12">
                <Typography variant='h4'>
                    {data.title}
                </Typography>
            </Box>
            <Box gridColumn="span 12" minHeight={500} >
                {data.pageContent.existImportExcel ? (
                    <label htmlFor="contained-button-file">
                        <Input style={{display: 'none'}} accept="image/*" id="contained-button-file" type="file" onChange={handleUploadExcel}/>
                        <Button variant="text" disabled = {data.pageContent.isAddedFile} component="span">
                            <FileUpload />
                            Incarca fisier Excel
                        </Button>
                    </label>
                ): (<Box></Box>)}
                {data.pageContent.existManualAdd ? (
                    <Button variant="text" onClick={handleClickManualAdd}>
                        <Add/>
                        {data.pageContent.manualAddLabel}
                    </Button> 
                ): (<Box></Box>)}
                {data.pageContent.existRegister ? (
                    <Button variant="text" onClick={handleClickRegister}>
                        <GroupAdd/>
                        {data.pageContent.registerLabel}
                    </Button>
                ): (<Box></Box>)}
                {data.dataGrid.show ? (
                     <DataTable data = {data.dataGrid} isSelectable = {false} callback={callback}/>
                ): (<Box></Box>)}
            </Box>
        </Box>
    )
}