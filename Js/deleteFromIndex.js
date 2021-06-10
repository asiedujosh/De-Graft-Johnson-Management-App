const { electron, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)
let recordId = urlGet;

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
