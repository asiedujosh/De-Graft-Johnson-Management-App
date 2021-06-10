const { electron, ipcRenderer } = require("electron")

//Getting the tableBody and appending
let tableBody = document.getElementById('tableBody')
let caseNo = document.getElementById('caseNo')
let beneficiaryNo = document.getElementById('beneficiaryNo')
let closeNo = document.getElementById('closeNo')

//let getBtn = document.querySelectorAll(".viewcase")

//Render Records 
ipcRenderer.send('get_data_on_records')
ipcRenderer.on('reply_get_records', (event, arg) => {
	tableBody.innerHTML += `<tr>
    <td>${arg.id}</td>
    <td>${arg.caseId}</td>
    <td>${arg.nameOfPatient}</td>
    <td>${arg.patientContact}</td>
    <td>${arg.nameOfCondition}</td>
    <td>${arg.purposeOfContact}</td>
    <td>${arg.conditionSeverity}</td>
	<td><span class = ${arg.benefit > 1 ? "green" : "red"}></span></td>
    <td>
	<span class = "btn btn-primary recordBtn" onclick="location.href = 'viewProfile.html?caseId=${arg.caseId}'">View</span>
    <span class = "btn btn-danger recordBtn" onclick="location.href = 'deleteRecords.html?caseId=${arg.caseId}'">Delete</span>
	</td>
    </tr>
    <tr>`
	})
	
//Count Records
ipcRenderer.on('reply_count_records', (event, arg) => {
		caseNo.innerHTML = `${arg.countId}`
	}) 
	
//Count Beneficials
ipcRenderer.on('reply_count_beneficials', (event, arg) => {
		beneficiaryNo.innerHTML = `${arg.countBenefits}`
	})
	
//Count Case
ipcRenderer.on('reply_count_caseClose', (event, arg) => {
		closeNo.innerHTML = `${arg.countCaseClose}`
	})




/*let secondLoad = () =>{
    getBtn.addEventListener("click", ()=>{
        window.location.href = "/viewProfile.html"
    })
}*/

//LoadData()




