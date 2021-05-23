let fs = require('fs')

const createTables = () => {
    let dbExists = fs.existsSync('./djf_database.sqlite3')

    if (!dbExists) {
        fs.openSync('./djf_database.sqlite3', 'w');
    }

    if (!dbExists) {
        DJF_database.serialize(function() {
            //Creating djf_client registration table
            DJF_database.run("CREATE TABLE djf_client (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, dater TEXT, profilePic BLOB, nameOfCaller TEXT, callerContact TEXT, nameOfPatient TEXT, patientContact TEXT, location TEXT, occupation TEXT, age INTEGER, sex TEXT, maritalStatus TEXT, nameOfCondition TEXT, purposeOfContact TEXT, conditionSeverity TEXT, languageSpoken TEXT, religion TEXT, medicalHistory TEXT, hearingMedium TEXT)")

            //Creating djf_case_status table
            DJF_database.run("CREATE TABLE djf_case_status (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, status TEXT)")

            //Creating interview table
            DJF_database.run("CREATE TABLE interview_assign (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, dater TEXT, interviewStatus)")


            //Creating conditionUpdate table
            DJF_database.run("CREATE TABLE conditionUpdate (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, condition TEXT, dater TEXT)")

            //Creating of imageOfCondition table
            DJF_database.run("CREATE TABLE imageOfCondition (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, image BLOB)")


            //Creating Of additional Image
            DJF_database.run("CREATE TABLE additionalImages (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, images BLOB, dater TEXT)")

            //Creating of support table
            DJF_database.run("CREATE TABLE support (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT, supportId TEXT, support TEXT, purposeOfSupport TEXT, amountDonated FLOAT, dateOfSupport TEXT)")

            //Creating of Support Receipt Image table
            DJF_database.run("CREATE TABLE supportReceipt (id INTEGER PRIMARY KEY AUTOINCREMENT, supportId TEXT, receipt BLOB)")

            /*let stmt = db.prepare("INSERT INTO lorem VALUES (?)");
              for (var i = 0; i < 10; i++) {
                  stmt.run("Ipsum " + i)
              }
              stmt.finalize()

              db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                  console.log(row.id + ":" + row.info)
              }) */
        })
    }
}

exports.createTables = createTables

//DJF_database.close()