export default function hostURL() {

    switch(process.env.REACT_APP_BASE_URL) {
        case "dev":
            return "https://localhost:3001"
        case "test":
            return "https://localhost:3002"
        case "prod":
            return "https://localhost:3000" 
    }
}