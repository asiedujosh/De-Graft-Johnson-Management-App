const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
let clientId = localStorage.getItem("caseId")

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



let frame = document.getElementById("picContainer")
let caseId = document.getElementById("caseId")
let nameOfPatient = document.getElementById("nameOfPatient")
let patientContact = document.getElementById("patientContact")
let nameOfCaller = document.getElementById("nameOfCaller")
let callerContact = document.getElementById("callerContact")
let clientLocation = document.getElementById("clientLocation")
let occupation = document.getElementById("occupation")
let language = document.getElementById("language")
let religion = document.getElementById("religion")
let nameTitle = document.getElementById("nameTitle")
let condition = document.getElementById("condition")
let amtDonated = document.getElementById("amtDonated")
let purposeOfDon = document.getElementById("purposeOfDon")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")
const closeCase = document.getElementById("closeCase")
const addNameToTitle = document.getElementById("addNameToTitle")
const addNameToSentence = document.getElementById("addNameToSentence")


//Id Specific for personal details
let personalClientName = document.getElementById("personalClientName")
let personalClientContact = document.getElementById("personalClientContact")
let personalClientCallerName = document.getElementById("personalClientCallerName")
let personalClientCallerContact = document.getElementById("personalClientCallerContact")
let personalClientAge = document.getElementById("personalClientAge")
let personalClientSex = document.getElementById("personalClientSex")
let personalClientLocation = document.getElementById("personalClientLocation")
let personalClientOccupation = document.getElementById("personalClientOccupation")
let personalClientMaritalStatus = document.getElementById("personalClientMaritalStatus")
let personalClientNameOfCondition = document.getElementById("personalClientNameOfCondition")
let personalClientLanguage = document.getElementById("personalClientLanguage")
let personalClientReligion = document.getElementById("personalClientReligion")
let personalClientPurposeOfContact = document.getElementById("personalClientPurposeOfContact")
let personalConditionSeverity = document.getElementById("personalConditionSeverity")
let personalMedicalHistory = document.getElementById("personalMedicalHistory")
let personalHearingMedium = document.getElementById("personalHearingMedium")
let editButton = document.getElementById("editButton")

//Personal Details Editing Values
let editClientName = document.getElementById("editClientName")
let editClientContact = document.getElementById("editClientContact")
let editCallerName = document.getElementById("editCallerName")
let editCallerContact = document.getElementById("editCallerContact")
let editAge = document.getElementById("editAge")
let editSex = document.getElementById("editSex")
let editLocation = document.getElementById("editLocation")
let editOccupation = document.getElementById("editOccupation")
let editMaritalStatus = document.getElementById("editMaritalStatus")
let editCondition = document.getElementById("editCondition")
let editLanguageSpoken = document.getElementById("editLanguageSpoken")
let editReligion = document.getElementById("editReligion")
let editPurposeOfContact = document.getElementById("editPurposeOfContact")
let editConditionSeverity = document.getElementById("editConditionSeverity")
let editMedicalHistory = document.getElementById("editMedicalHistory")
let editHearingMedium = document.getElementById("editHearingMedium")
 


ipcRenderer.send('get_data_on_client', clientId)
    ipcRenderer.on('reply_info', (event, arg) => {
			let buf = new Buffer(arg.patientPic)
			let image = buf.toString('base64')
			
        //console.log(image)
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
		caseId.innerHTML += `${clientId}`
		nameOfPatient.innerHTML = `${arg.nameOfPatient}`
		patientContact.innerHTML = `${arg.patientContact}`
		nameOfCaller.innerHTML = `${arg.nameOfCaller}`
		callerContact.innerHTML = `${arg.callerContact}`
		clientLocation.innerHTML = `${arg.location}`
		occupation.innerHTML = `${arg.occupation}`
		language.innerHTML = `${arg.language}`
		religion.innerHTML = `${arg.religion}`
		nameTitle.innerHTML = `${arg.nameOfPatient}`
		condition.innerHTML = `${arg.nameOfCondition}`
		purposeOfDon.innerHTML = `${arg.purposeOfContact}`
		addNameToTitle.innerHTML += ` ${arg.nameOfPatient}`
		addNameToSentence.innerHTML += ` ${arg.nameOfPatient}`
		
		personalClientName.innerHTML += `${arg.nameOfPatient}`
		personalClientContact.innerHTML += `${arg.patientContact}`
		personalClientCallerName.innerHTML += `${arg.nameOfCaller}`
		personalClientCallerContact.innerHTML += `${arg.callerContact}`
		personalClientLocation.innerHTML += `${arg.location}`
		personalClientOccupation.innerHTML += `${arg.occupation}`
		personalClientMaritalStatus.innerHTML += `${arg.maritalStatus}`
		personalClientNameOfCondition.innerHTML += `${arg.nameOfCondition}`
		personalClientLanguage.innerHTML += `${arg.language}`
		personalClientReligion.innerHTML += `${arg.religion}`
		personalClientPurposeOfContact.innerHTML += `${arg.purposeOfContact}`
		personalConditionSeverity.innerHTML += `${arg.conditionSeverity}`
		personalClientSex.innerHTML += `${arg.sex}`
		personalClientAge.innerHTML += `${arg.age}`
		personalMedicalHistory.innerHTML = `${arg.medicalHistory}`
		personalHearingMedium.innerHTML += `${arg.hearingMedium}`
		amtDonated.innerHTML += `${arg.amountDonated}`
		
		editClientName.value = `${arg.nameOfPatient}`
		editClientContact.value = `${arg.patientContact}`
		editCallerName.value = `${arg.nameOfCaller}`
		editCallerContact.value = `${arg.callerContact}`
		editAge.value = `${arg.age}`
		editSex.value = `${arg.sex}`
		editLocation.value = `${arg.location}`
		editOccupation.value = `${arg.occupation}`
		editLanguageSpoken.value = `${arg.language}`
		editReligion.value = `${arg.religion}`
		editCondition.value = `${arg.nameOfCondition}`
		editMaritalStatus.value = `${arg.maritalStatus}`
		editPurposeOfContact.value = `${arg.purposeOfContact}`
		editConditionSeverity.value = `${arg.conditionSeverity}`
		editMedicalHistory.value = `${arg.medicalHistory}`
		editHearingMedium.value = `${arg.hearingMedium}`
    })
	

let mainInterview = document.getElementById("mainInterview")
	ipcRenderer.send('get_top_interview_date', clientId)
	ipcRenderer.on('reply_top_interview_date', (event, arg) => {
		let convertDate = arg.interviewDate
		let interviewDate = convertDate.split("-")
		//console.log(interviewDate)
		let mainDate = new Date(interviewDate[0], interviewDate[1], interviewDate[2]);
		//console.log(mainDate)
		let g = mainDate.toString()
		//let secondPhase = mainDate.split(" ")
		//let secondDate = secondPhase[0]+" "+secondPhase[1]+" "+secondPhase[2]
		let v = g.split(" ")
		let currentDate = v[0]+" "+v[1]+", "+v[2]+" "+v[3]
		mainInterview.innerHTML = currentDate
		})


let closeCaseRun = () => {
	let clientInfo = {
	clientId : clientId,
	caseStatus: "close"
	}
//Function to add Condition to database
ipcRenderer.invoke('CloseCase', clientInfo)
	.then((result) => {
        console.log("Sent Message")
		window.location.href = 'setInterview.html'
    })
}


//Close Case
closeCase.addEventListener("click", ()=>{
		closeCaseRun()
	})
	//window.location.href = 'personalDetails.html'




	
	
//For personal detail page
let firstButton = document.getElementById("printProfileBtn")
let secondButton = document.getElementById("editProfileBtn")
let thirdButton = document.getElementById("closeBtn")




document.getElementById("printProfile").style.display = "block"
//Opencity function
function displayTabBlock(tabName){
	let i
	let tabcontent
	
	tabcontent = document.getElementsByClassName("tabcontent")
	console.log(tabcontent)

	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none"
	}
	
	document.getElementById(tabName).style.display = "block"
}


firstButton.addEventListener("click",()=>{
	displayTabBlock("printProfile")
})

secondButton.addEventListener("click",()=>{
	displayTabBlock("editProfile")
})

thirdButton.addEventListener("click",()=>{
	displayTabBlock("closeCase")
})



ok.addEventListener("click",()=>{
		profileInsert.style.display = "none"
		//clearInfo()
	})

ok3.addEventListener("click",()=>{
		styleErrorCard.style.display = "none" 
		logoutErrors.innerHTML = ""
		Validation_errors = []
		//clearInfo()
	})

let Validation_errors = []
//Validation
let validation = () => {
	if(editClientName.value == "") return Validation_errors.push("Patient Name is empty")
	if(editClientContact.value == "") return Validation_errors.push("Patient Contact is empty")
	if(editAge.value == "") return Validation_errors.push("Patient Age is empty")
	if(editCondition.value == "") return Validation_errors.push("Name of condition is empty")
	if(editPurposeOfContact.value == "") return Validation_errors.push("Purpose of contact is empty")
	
	//Check If patient Contact is exactly or less than 10 digits
	let valNo = editClientContact.value.split("")
	if(valNo.length < 10) return Validation_errors.push("Patient Contact Number Incorrect")
	if(valNo.length > 10) return Validation_errors.push("Patient Contact Number Incorrect")
}


//Edit function
let EditPersonalDetail = () => {
	let clientEdit = {
		clientId: clientId,
		clientName: editClientName.value,
		clientContact: editClientContact.value,
		callerName: editCallerName.value,
		callerContact: editCallerContact.value,
		Age: editAge.value,
		sex: editSex.value,
		Location: editLocation.value,
		Occupation: editOccupation.value,
		languageSpoken: editLanguageSpoken.value,
		Religion: editReligion.value,
		Condition: editCondition.value,
		maritalStatus: editMaritalStatus.value,
		purposeOfContact: editPurposeOfContact.value,
		conditionSeverity: editConditionSeverity.value,
		medicalHistory: editMedicalHistory.value,
		hearingMedium: editHearingMedium.value
	}
	console.log(clientEdit)
	
	validation()

//console.log(Validation_errors)	

	if(Validation_errors.length){
		console.log(Validation_errors)
		styleErrorCard.style.display = "block"
		logoutErrors.innerHTML += Validation_errors.map((val)=>{
			return(
				`<ul style = "display: block; width: 100%; text-align: center;">
				<li style = "display: block; width: 100%;">${val}</li>
				</ul>`
				)
			})
		} else {
	ipcRenderer.invoke('submit_edit', clientEdit).then((result) => {
        console.log("Sent Message")
		profileInsert.style.display = "block"
		})
		}
	}

editButton.addEventListener("click",()=>{
	EditPersonalDetail()
})





/*
function openCity(evt, cityName){
	let i
	let tabcontent
	
	tabcontent = document.getElementsByClassName("tabcontent")
	console.log(tabcontent)
	/*
	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none"
	}
}
*/