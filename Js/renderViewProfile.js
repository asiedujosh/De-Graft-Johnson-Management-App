const { electron, ipcRenderer } = require("electron")
const remote = require('electron').remote
const main = remote.require('./main.js')


const fs = require('fs')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const urlGet = urlParams.get('caseId')
    //console.log(urlGet)
let clientId;

if(urlGet){
	localStorage.setItem("caseId", urlGet)
	clientId = urlGet
} else {
	clientId = localStorage.getItem("caseId")
} 



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
let purposeOfDon = document.getElementById("purposeOfDon")
let amtDonated = document.getElementById("amtDonated")
let loadingConditionRecord = document.getElementById("loadingConditionRecord")
let loadingDonationRecord = document.getElementById("loadingDonationRecord")



    ipcRenderer.send('get_data_on_client', clientId)
    ipcRenderer.on('reply_info', (event, arg) => {
		
		if(arg.patientPic == "NoImage"){
		frame.innerHTML = `<img src = "../image/profile.jpg" alt = "profile Picture" id = "profileImg"/>`
		} else {
		let buf = new Buffer(arg.patientPic)
		let image = buf.toString('base64')
        console.log(arg)
        frame.innerHTML = `<img src = "data:image/png;base64,${image}" alt = "profile Picture" id = "profileImg"/>`
		}
		
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

//Populating condition table
//Render Records 
ipcRenderer.send('get_data_on_condition', clientId)
ipcRenderer.on('reply_to_conditionUpdate', (event, arg) => {
	loadingConditionRecord.innerHTML += `<tr>
		<td>${arg.id}</td>
		<td>${arg.dater}</td>
		<td>${arg.condition}</td>
        <td colspan = "2">
        <span class = "btn btn-warning recordBtn profBtn" onclick="location.href = 'homeEdit.html?caseId=${arg.id}'">View</span>
        <span class = "btn btn-danger recordBtn profBtn" onclick="location.href = 'homeDel2.html?caseId=${arg.id}'">Delete</span>
        </td>
		</tr>`
	})
	
	
	
	/*
	let viewButton = document.getElementById("viewButton")
	viewButton.addEventListener("click",()=>{
		main.openWindow()
	}) */

	
//Loading donation records
ipcRenderer.send('get_data_on_donationUpdate', clientId)
ipcRenderer.on('reply_to_donationUpdate', (event, arg) => {
	loadingDonationRecord.innerHTML += `<tr>
	  <td>${arg.id}</td>
      <td>${arg.dateOfSupport}</td>
      <td>${arg.purposeOfSupport}</td>
      <td>${arg.support}</td>
      <td>${arg.amountDonated}</td>
      <td>
      <span class = "btn btn-warning recordBtn profBtn" onclick="location.href = 'homeEdit2.html?caseId=${arg.id}'">View</span>
      <span class = "btn btn-danger recordBtn profBtn" onclick="location.href = 'homeDel.html?caseId=${arg.id}'">Delete</span>
      </td>
	</tr>`
	})
	
