const { electron, remote, ipcRenderer } = require("electron")

//Function to dynamically generate case id 
let caseNo = () => {
	let face = "DJF_"
	let back = Math.floor(Math.random()*10000)
	let caseResult = face + back
	return caseResult
	//console.log(caseResult)
}

let caseIdVal = caseNo()

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


const caseId = document.getElementById("caseId").value = caseIdVal
const patientPic = document.getElementById("patientPicture")
const dater = document.getElementById("date")
const nameOfCaller = document.getElementById("nameOfCaller")
const callerContact = document.getElementById("callerContact")
const nameOfPatient = document.getElementById("nameOfPatient")
const patientContact = document.getElementById("patientContact")
const location = document.getElementById("location")
const occupation = document.getElementById("occupation")
const age = document.getElementById("age")
const sex = document.getElementById("sex")
const maritalStatus = document.getElementById("maritalStatus")
const nameOfCondition = document.getElementById("nameOfCondition")
const purposeOfContact = document.getElementById("purposeOfContact")
const conditionSeverity = document.getElementById("conditionSeverity")
const languageSpoken = document.getElementById("languageSpoken")
const religion = document.getElementById("religion")
const medicalHistory = document.getElementById("medicalHistory")
const submit_btn = document.getElementById("submit_info")
const hearOfDjf = document.getElementById("hearOfDjf")
const ok = document.getElementById("ok")
const ok2 = document.getElementById("ok2")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")
const profileFail = document.getElementById("profileFail")
const styleErrorCard = document.getElementById("styleErrorCard")
const logoutErrors = document.getElementById("logoutErrors")

let clearInfo = () =>{
	caseId.value = caseNo()
	patientPic.files[0] = null
	dater.value = ""
	nameOfCaller.value = ""
	callerContact.value = ""
	nameOfPatient.value = ""
	patientContact.value = ""
	location.value = ""
	occupation.value = ""
	age.value = ""
	sex.value = "Male" 
	maritalStatus.value = "Single"
	nameOfCondition.value = ""
	purposeOfContact.value = ""
	conditionSeverity.value = 1
	languageSpoken.value = ""
	religion.value = ""
	medicalHistory.value = ""
	hearOfDjf.value = ""
}

let InformationGathered = {}


let Validation_errors = []
//Validation
let validation = () => {
	if(nameOfPatient.value == "") return Validation_errors.push("Patient Name is empty")
	if(patientContact.value == "") return Validation_errors.push("Patient Contact is empty")
	if(age.value == "") return Validation_errors.push("Patient Age is empty")
	if(nameOfCondition.value == "") return Validation_errors.push("Name of condition is empty")
	if(purposeOfContact.value == "") return Validation_errors.push("Purpose of contact is empty")
	
	//Check If patient Contact is exactly or less than 10 digits
	let valNo = patientContact.value.split("")
	if(valNo.length < 10) return Validation_errors.push("Patient Contact Number Incorrect")
	if(valNo.length > 10) return Validation_errors.push("Patient Contact Number Incorrect")
}

let gatherInfo = () => {
    InformationGathered.caseId = caseIdVal
    InformationGathered.dater = dater.value
    InformationGathered.nameOfCaller = nameOfCaller.value
    InformationGathered.callerContact = callerContact.value
    InformationGathered.nameOfPatient = nameOfPatient.value
    InformationGathered.patientContact = patientContact.value
    InformationGathered.location = location.value
    InformationGathered.occupation = occupation.value
    InformationGathered.age = age.value
    InformationGathered.sex = sex.value
    InformationGathered.maritalStatus = maritalStatus.value
    InformationGathered.nameOfCondition = nameOfCondition.value
    InformationGathered.purposeOfContact = purposeOfContact.value
    InformationGathered.conditionSeverity = conditionSeverity.value
    InformationGathered.languageSpoken = languageSpoken.value
    InformationGathered.religion = religion.value
    InformationGathered.medicalHistory = medicalHistory.value
    InformationGathered.hearOfDjf = hearOfDjf.value
	InformationGathered.caseStatus = "open"
	InformationGathered.benefit = 1

	if(patientPic.files[0]){
		//console.log("Yes there is files")
		InformationGathered.patientPic = patientPic.files[0].path
	} else {
		//console.log("No there is no files")
		InformationGathered.patientPic = ""
	}
	
	//Validate Before
	validation()
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
		ipcRenderer.invoke('submit_helper_info', InformationGathered)
		ipcRenderer.on('reply_result_of_submit', (event, arg) => {
		console.log(arg)
		if(arg == "success"){
		profileInsert.style.display = "block"
		} else {
		profileFail.style.display = "block"
			}
		})
		console.log("Success")
	}
}

ok.addEventListener("click",()=>{
		profileInsert.style.display = "none"
		clearInfo()
	})
	
ok2.addEventListener("click",()=>{
		profileFail.style.display = "none" 
	})

ok3.addEventListener("click",()=>{
		styleErrorCard.style.display = "none" 
		logoutErrors.innerHTML = ""
		Validation_errors = []
		clearInfo()
	})

submit_btn.addEventListener("click", () => {
    gatherInfo()
})