import * as React from 'react'

import { Edit } from '@mui/icons-material'
import { Button } from '@mui/material'
import { DataGrid, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid'

export const ADD_USERS_TABLE_COLUMNS = [
    {'field': 'email', 'headerName': 'Email', 'editable': false, 'width': 200},
    {'field': 'password', 'headerName': 'Parola', 'editable': false, 'width': 200},
    {'field': 'roleName', 'headerName': 'Rol', 'editable': false, 'width': 200},
    {'field': 'lastName', 'headerName': 'Nume', 'editable': false, 'width': 200},
    {'field': 'firstName', 'headerName': 'Prenume', 'editable': false, 'width': 200},
    {'field': 'phoneNumber', 'headerName': 'Telefon', 'editable': false, 'width':200}
]

export const STUDENTS_TABLE_COLUMNS = [
    {'field': 'email', 'headerName': 'Email', 'editable': false, 'width': 200},
    {'field': 'lastName', 'headerName': 'Nume', 'editable': false, 'width': 200},
    {'field': 'firstName', 'headerName': 'Prenume', 'editable': false, 'width': 200},
    {'field': 'identityId', 'headerName': 'CNP', 'editable': false, 'width': 200},
    {'field': 'educationForm', 'headerName': 'Forma de invatamant', 'editable': false, 'width': 200},
    {'field': 'budgetForm', 'headerName': 'Finantare', 'editable': false, 'width':200}
]

export const ADD_FACULTIES_TABLE_COLUMNS = [
    {'field': 'id', 'headerName': 'ID', 'editable': false, 'width': 200},
    {'field': 'name', 'headerName': 'Nume Facultate', 'editable': false, 'width': 200},
    {'field': 'address', 'headerName': 'Adresa Facultate', 'editable': false, 'width': 200},
    {'field': 'phoneNumber', 'headerName': 'Telefon', 'editable': false, 'width': 200},
    {'field': 'shortName', 'headerName': 'Cod Facultate', 'editable': false, 'width': 200},
    {'field': 'edit', 'headerName': 'Editeaza', renderCell: (params) => {
        const onClick = (e) => {
            e.stopPropagation()
            const api = params.api
            const thisRow = {}
            api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );
  
          return alert(JSON.stringify(thisRow, null, 4));
        }

        return(
            <Button onClick={onClick}>
                <Edit/>
            </Button>
        )
    }}
]