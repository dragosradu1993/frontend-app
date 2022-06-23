import * as xlsx from "xlsx"

const handlerAddUser = (event, value) => {
    
}

const xlsxToJSON = (e) => {
    const data = e.target.result
    const workBook = xlsx.read(data, { type: 'array' })
    const sheetName = workBook.SheetNames[0]
    const worksheet = workBook.Sheets[sheetName]
    const json = xlsx.utils.sheet_to_json(worksheet)
    
    return json
}

export default {
    xlsxToJSON
}