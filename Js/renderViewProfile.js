const { electron, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)

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

    ipcRenderer.send('get_data_on_client', urlGet)
    ipcRenderer.on('reply_info', (event, arg) => {
			let buf = new Buffer(arg.patientPic)
			let image = buf.toString('base64')
			
			//Store in session
			//sessionStorage.setItem("Image", image)
			/*sessionStorage.setItem("caseId", arg.caseId)
			sessionStorage.setItem("nameOfPatient", arg.nameOfPatient)
			sessionStorage.setItem("patientContact", arg.patientContact)
			sessionStorage.setItem("nameOfCaller", arg.nameOfCaller)
			sessionStorage.setItem("callerContact", arg.callerContact)
			sessionStorage.setItem("location", arg.location)
			sessionStorage.setItem("occupation", arg.occupation)
			sessionStorage.setItem("language", arg.language)
			sessionStorage.setItem("religion", arg.religion)
			sessionStorage.setItem("condition", arg.nameOfCondition)
			sessionStorage.setItem("purposeOfContact", arg.purposeOfContact)
		
			//Get the information from session storage
			//let profImage = sessionStorage.getItem("") */
	   
	   
	   
	   
	   
        //console.log(image)
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
		caseId.innerHTML += `${urlGet}`
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
		
		
		
        //console.log(image)
        //frame
    })

