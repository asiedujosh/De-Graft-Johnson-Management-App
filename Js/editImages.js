const { electron, ipcRenderer } = require("electron")
const remote = require('electron').remote
const main = remote.require('./main.js')


const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('Id')
    console.log(urlGet)
let clientId = localStorage.getItem("caseId")



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
//let loadingConditionRecord = document.getElementById("loadingConditionRecord")
//let loadingDonationRecord = document.getElementById("loadingDonationRecord")
let getImg = document.getElementById("getImage")
let editImagesBtn = document.getElementById("editImagesBtn")
let imageTitle = document.getElementById("imageTitle")
let imageDesc = document.getElementById("imageDesc")

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


 ipcRenderer.send('get_unique_case_Img', urlGet)
    ipcRenderer.on('reply_unique_case_Img', (event, arg) => { 
		imageTitle.value = `${arg.title}`
		imageDesc.value = `${arg.description}`
    })


editImagesBtn.addEventListener("click", ()=>{
	let editImg
	 if(getImg.files[0]){
		 //Gather Object for case with images
		let editImg = {
			id : urlGet,
			imagePro : getImg.files[0].path,
			title: imageTitle.value,
			desc: imageDesc.value
		}
		//Load to database
	ipcRenderer.invoke('update_case_with_image', editImg)
	.then((result) => {
        console.log("Sent Message")
		window.location.href = 'imageDetails.html'
    })} else {
		 //Gathner without images
		let editImg = {
			id : urlGet,
			title: imageTitle.value,
			desc: imageDesc.value
		}
		//Load to database
	ipcRenderer.invoke('update_case_without_image', editImg)
	.then((result) => {
        console.log("Sent Message")
		window.location.href = 'imageDetails.html'
    })
	}
})	
	/*
	let viewButton = document.getElementById("viewButton")
	viewButton.addEventListener("click",()=>{
		main.openWindow()
	}) 
//Add Donation
let updateCondition = () => {
let updateCondition = {
	id: conditionId,
	dater : condDate.value,
	conditionText : condText.value 
}
console.log(updateCondition)
//Function to add Condition to database
ipcRenderer.invoke('submit_update_Condition', updateCondition)
	.then((result) => {
        console.log("Sent Message")
    })
}
*/
/*	
updateCondBtn.addEventListener("click", ()=>{
	updateCondition()
})	
*/