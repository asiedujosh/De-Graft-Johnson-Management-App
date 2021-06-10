const { electron, ipcRenderer } = require("electron")
const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    console.log(urlGet)
let donationId = urlGet;

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
let loadingConditionRecord = document.getElementById("loadingConditionRecord")
let loadingDonationRecord = document.getElementById("loadingDonationRecord")
let updateDonateBtn = document.getElementById("updateDonateBtn")
let donateDate = document.getElementById("donateDate")
let donateItem = document.getElementById("donateItem")
let donateAmt = document.getElementById("donateAmt")
let donatePurpose = document.getElementById("donatePurpose")



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


 ipcRenderer.send('get_data_for_donation', donationId)
    ipcRenderer.on('reply_data_for_donation', (event, arg) => {
		 donateDate.value = arg.dater
		 donateItem.value = arg.items
		 donateAmt.value = arg.amountDonated
		 donatePurpose.value = arg.purposeOfSupport
    })

	
	/*
	let viewButton = document.getElementById("viewButton")
	viewButton.addEventListener("click",()=>{
		main.openWindow()
	}) */
//Add Donation
let updateDonate = () => {
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
    })
}
	
updateDonateBtn.addEventListener("click", ()=>{
	updateDonate()
})	
