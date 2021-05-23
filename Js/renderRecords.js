window.onload = ()=> {
const { electron, ipcRenderer } = require("electron")
let sqlite3 = require('sqlite3').verbose()
let DJF_database = new sqlite3.Database('./djf_database.sqlite3')

//Getting the tableBody and appending
let tableBody = document.getElementById('tableBody')
//let getBtn = document.querySelectorAll(".viewcase")

let LoadData = () => {
    let sql = `SELECT * FROM djf_client`;
    DJF_database.all(sql, [], (err, rows) => {
    if (err) {
    throw err
    }
    rows.forEach((row) => {
    //console.log(row.nameOfPatient);
    //Appending Rows to table body
    tableBody.innerHTML += `<tr>
    <td>${row.id}</td>
    <td>${row.caseId}</td>
    <td>${row.nameOfPatient}</td>
    <td>${row.patientContact}</td>
    <td>${row.nameOfCondition}</td>
    <td>${row.purposeOfContact}</td>
    <td>${row.conditionSeverity}</td>
    <td><span class = "btn btn-primary" onclick="location.href = 'viewProfile.html?caseId=${row.caseId}'">View</span></td>
    <td><a href = "">Delete Case</a></td>
    </tr>
    <tr>`
        })
    })
    DJF_database.close()
  }
  LoadData()
}


/*let secondLoad = () =>{
    getBtn.addEventListener("click", ()=>{
        window.location.href = "/viewProfile.html"
    })
}*/

//LoadData()




