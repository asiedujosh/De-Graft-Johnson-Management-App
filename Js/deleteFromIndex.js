const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)
let recordId = urlGet;


//Window close Minimize and Maximize function
const minimize_button = document.getElementById("minimize_button")
const maximize_button = document.getElementById("maximize_button")
const close_button = document.getElementById("close_button")

minimize_button.addEventListener("click",()=>{
	remote.getCurrentWindow().minimize()
})

maximize_button.addEventListener("click",()=>{
	const currentWindow = remote.getCurrentWindow()
	if(currentWindow.isMaximized()){
		currentWindow.unmaximize()
	} else {
		currentWindow.maximize()
	}
})

close_button.addEventListener("click",()=>{
	remote.app.quit()
})



let delMainRecordBtn = document.getElementById("delMainRecordBtn")
let backMainRecordBtn = document.getElementById("backMainRecordBtn")

delMainRecordBtn.addEventListener("click", ()=> {
	deleteClient()
})

let deleteClient = () => {
//Function to add Condition to database
ipcRenderer.invoke('delete_Record', recordId)
	.then((result) => {
        console.log("Sent Message")
		window.location.href = 'index.html'
    })
}


backMainRecordBtn.addEventListener("click", () => {
	window.location.href = 'index.html'
})

delMainRecordBtn.addEventListener("click", ()=> {
	deleteClient()
})
