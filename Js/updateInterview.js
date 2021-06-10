const { electron, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)
let interviewId = urlGet;

clientId = localStorage.getItem("caseId")

let frame = document.getElementById("picContainer")
let caseId = document.getElementById("caseId")
let nameOfPatient = document.getElementById("nameOfPatient")
let patientContact = document.getElementById("patientContact")
let nameOfCaller = document.getElementById("nameOfCaller")
let callerContact = document.getElementById("callerContact")
let location = document.getElementById("callerContact")
let occupation = document.getElementById("occupation")
let language = document.getElementById("language")
let religion = document.getElementById("religion")
let nameTitle = document.getElementById("nameTitle")
let condition = document.getElementById("condition")
let purposeOfDon = document.getElementById("purposeOfDon")
let amtDonated = document.getElementById("amtDonated")
let interviewYes = document.getElementById("interviewYes")
let interviewNo = document.getElementById("interviewNo")




    ipcRenderer.send('get_data_on_client', clientId)
    ipcRenderer.on('reply_info', (event, arg) => {
		let buf = new Buffer(arg.patientPic)
		let image = buf.toString('base64')
        console.log(arg)
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
		caseId.innerHTML += `${clientId}`
		nameOfPatient.innerHTML = `${arg.nameOfPatient}`
		patientContact.innerHTML = `${arg.patientContact}`
		nameOfCaller.innerHTML = `${arg.nameOfCaller}`
		callerContact.innerHTML = `${arg.callerContact}`
		location.innerHTML = `${arg.location}`
		occupation.innerHTML = `${arg.occupation}`
		language.innerHTML = `${arg.language}`
		religion.innerHTML = `${arg.religion}`
		nameTitle.innerHTML = `${arg.nameOfPatient}`
		condition.innerHTML = `${arg.nameOfCondition}`
		purposeOfDon.innerHTML = `${arg.purposeOfContact}`
		amtDonated.innerHTML += `${arg.amountDonated}`
    })



	
	/*
	let viewButton = document.getElementById("viewButton")
	viewButton.addEventListener("click",()=>{
		main.openWindow()
	}) */
//Add Donation
let interviewToUpdate = () => {
	let interviewPayLoad = {
		id : interviewId,
		InStatus: "success"
	}
//Function to add Condition to database
ipcRenderer.invoke('update_Interview', interviewPayLoad)
	.then((result) => {
        console.log("Sent Message")
		window.location.href = 'setInterview.html'
    })
}


interviewYes.addEventListener("click",()=>{
	interviewToUpdate()
})
