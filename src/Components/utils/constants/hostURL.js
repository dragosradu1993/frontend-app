export default function hostURL() {

    switch(process.env.REACT_APP_BASE_URL) {
        case "dev":
            return "http://localhost:3001"
        case "test":
            return "http://localhost:3002"
        case "prod":
            return "http://localhost:3000" 
    }
}