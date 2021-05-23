const { electron, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)

let frame = document.getElementById("picContainer")

    ipcRenderer.send('get_data_on_client', urlGet)
    ipcRenderer.on('reply_info', (event, arg) => {
        console.log(arg)
        let buf = new Buffer(arg.patientPic)
        let image = buf.toString('base64')
        //console.log(image)
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
        //console.log(image)
        //frame
    })

