const { electron, remote, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)
let donationId = urlGet;

clientId = localStorage.getItem("caseId")

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
let location = document.getElementById("callerContact")
let occupation = document.getElementById("occupation")
let language = document.getElementById("language")
let religion = document.getElementById("religion")
let nameTitle = document.getElementById("nameTitle")
let condition = document.getElementById("condition")
let purposeOfDon = document.getElementById("purposeOfDon")
let amtDonated = document.getElementById("amtDonated")
let loadingConditionRecord = document.getElementById("loadingConditionRecord")
let loadingDonationRecord = document.getElementById("loadingDonationRecord")
let updateDonateBtn = document.getElementById("updateDonateBtn")
let donateDate = document.getElementById("donateDate")
let donateItem = document.getElementById("donateItem")
let donateAmt = document.getElementById("donateAmt")
let donatePurpose = document.getElementById("donatePurpose")
const ok = document.getElementById("ok")
const styleErrorCard = document.getElementById("styleErrorCard")
const ok3 = document.getElementById("ok3")
const profileInsert = document.getElementById("profileInsert")




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


 ipcRenderer.send('get_data_for_donation', donationId)
    ipcRenderer.on('reply_data_for_donation', (event, arg) => {
		 donateDate.value = arg.dater
		 donateItem.value = arg.items
		 donateAmt.value = arg.amountDonated
		 donatePurpose.value = arg.purposeOfSupport
    })

	
let Validation_errors = []
//Validation
let validation = () => {
	if(!donateDate.value) return Validation_errors.push("No Date Available")
	if(!donatePurpose.value) return Validation_errors.push("Purpose Of Donation Not Available")
	if(!donateItem.value) return Validation_errors.push("If No items Please Indicate")
	if(!donateAmt.value) return Validation_errors.push("No Amount Indicated")
	if(isNaN(donateAmt.value)) return Validation_errors.push("Amount Cannot Be A Text")
	}

//Add Donation
let updateDonate = () => {
	
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
let updateDonation = {
	id: donationId,
	donateDate: donateDate.value,
	donateItem: donateItem.value,
	donateAmt: donateAmt.value,
	donatePurpose :  donatePurpose.value
	}
//console.log(updateCondition)
//Function to add Condition to database
ipcRenderer.invoke('submit_update_Donation', updateDonation)
	.then((result) => {
        console.log("Sent Message")
		profileInsert.style.display = "block"
    })
	}
}
	
updateDonateBtn.addEventListener("click", ()=>{
	updateDonate()
})

ok.addEventListener("click",()=>{
		profileInsert.style.display = "none"
	})

ok3.addEventListener("click",()=>{
		styleErrorCard.style.display = "none" 
		logoutErrors.innerHTML = ""
		Validation_errors = []
	})	
