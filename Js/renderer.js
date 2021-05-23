const { electron, ipcRenderer } = require("electron")

const caseId = document.getElementById("caseId")
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
const sickConditionImage = document.getElementById("sickConditionImage")
const processingStage = document.getElementById("processingStage")
const submit_btn = document.getElementById("submit_info")
const hearOfDjf = document.getElementById("hearOfDjf")

let InformationGathered = {}

let gatherInfo = () => {
    InformationGathered.caseId = caseId.value
    InformationGathered.patientPic = patientPic.files[0].path
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
    InformationGathered.sickConditionImage = sickConditionImage.value
    InformationGathered.processingStage = processingStage.value
    InformationGathered.hearOfDjf = hearOfDjf.value


    //Console Log Total results
    console.log(InformationGathered)
    ipcRenderer.invoke('submit_helper_info', InformationGathered).then((result) => {
        console.log("Sent Message")
    })
}


submit_btn.addEventListener("click", () => {
    gatherInfo()
})