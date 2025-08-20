import axios from "axios";


function login(username: string,pwd :string, host :string,port :string) {
    const formdata = new FormData()
    formdata.append("username", username)
    formdata.append("password", pwd)
    formdata.append("lhost", host)
    formdata.append("lport", port)
    return axios.post("/login", formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    } )
}

const tokenkey = "token"
function storetoken(token: string) {
    localStorage.setItem(tokenkey, token)
}

function gettoken() {
    return localStorage.getItem(tokenkey)
}


export {login,storetoken,gettoken}