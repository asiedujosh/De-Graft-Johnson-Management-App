const { electron, remote, ipcRenderer } = require("electron")

let search = document.getElementById("searchHold")
let searchHoldBtn = document.getElementById("searchHoldBtn")
let resultsOfSearch = document.getElementById("resultsOfSearch")
let close_table_card = document.getElementById("close_table_card")


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


let searchInfo = () => {
	if(search.value !== ""){
	let searchQuery = `%${search.value}%`
	ipcRenderer.send('get_result_from_search', searchQuery)
	ipcRenderer.on('reply_result_from_search', (event, arg) => {
		if(arg){
		document.getElementById("font_table").style.display = "block"
		resultsOfSearch.innerHTML = `<tr>
		<td>${arg.id}</td>
		<td>${arg.caseId}</td>
		<td>${arg.nameOfPatient}</td>
		<td>${arg.patientContact}</td>
		<td>${arg.nameOfCondition}</td>
		<td>${arg.purposeOfContact}</td>
		<td>${arg.conditionSeverity}</td>
		<td><span class = ${arg.benefit > 1 ? "green" : "red"}></span></td>
		<td>
		<span class = "btn btn-primary" onclick="location.href = 'pages/viewProfile.html?caseId=${arg.caseId}'">View</span>
		<span class = "btn btn-danger" onclick="location.href = 'pages/deleteFromIndex.html?caseId=${arg.caseId}'">Delete</span>
		</td>
		</tr>`
			}
	})} else {
			document.getElementById("font_table").style.display = "block"
		resultsOfSearch.innerHTML = `<tr>
		<td colspan = "9" style = "text-align: center; font-size: 1.2em; font-weight:600">
			No results
		</td>
		</tr>`
		} 
	}

close_table_card.addEventListener('click', ()=>{
	document.getElementById("font_table").style.display = "none"
})

search.addEventListener('change', ()=>{
	searchInfo()
})

searchHoldBtn.addEventListener('click', ()=>{
	searchInfo()
})