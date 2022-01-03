//Airtable script using airtable.js


// load response package from trigger and assign needed info to variables
let inputConfig = input.config();
let returnPackage = JSON.parse(inputConfig.payload);

let user = returnPackage.user.username;
let value = returnPackage.actions[0].value;
let channelID = returnPackage.channel.id;
let threadTs = returnPackage.message.ts;
let consultRecID = returnPackage.message.blocks[1].text.text;
let responseFlag ="";

//load SIGNIN Table
let signinTable = base.getTable("SIGNIN");

//load ID Consult record
let idConsultTable = base.getTable("CONSULTATIONS");
let idConsultRec = await idConsultTable.selectRecordAsync(consultRecID);

//test variables
let designer = idConsultRec.getCellValue("Designer");
let signinLink = idConsultRec.getCellValue("Signin");

// check to keep from repeating
if (!designer && signinLink){
    if (value !== "CANCEL") {

// Accept quest
    responseFlag = "Brave " + user + " heeds the call. :crossed_swords:";

// get records from TEAM 
    let teamTable = base.getTable("TEAM");
    let teamRecords = await teamTable.selectRecordsAsync({
        fields : ["Slack ID"]
    });

// and match user that responded to team rec
    for (let record of teamRecords.records) {
        if (user === record.getCellValueAsString("Slack ID")){

// update current record - link team member to record
            idConsultTable.updateRecordAsync(consultRecID,{
                "Designer" : [{id: record.id}]
            })
        }
    };

    } else { 
        responseFlag="Quest canceled by: " + user
        // Cancel Quest - delete signin rec
        await signinTable.deleteRecordAsync(signinLink[0].id)
        };

// Handle instances of multiple buttons clicked (this is pretty messy)
} else if (value === "CANCEL" && signinLink){ 
    responseFlag="Quest canceled by: " + user;
    // Cancel Quest - delete signin rec and designer link 
    await signinTable.deleteRecordAsync(signinLink[0].id);
    if(designer){
        idConsultTable.updateRecordAsync(consultRecID,{
                "Designer" : []
            });
    }
} else if (value === "CANCEL" && !signinLink) {
    responseFlag="Quest already canceled."
} else if (value === "TRUE" && !signinLink){
        responseFlag="Quest already canceled."
} else if (value === "TRUE" && signinLink) {
        responseFlag="Quest already claimed by " + designer[0].name
    };


if (value !== "NOTES") 
{
    let response = await fetch("https://hooks.slack.com/services/SECRET", {
    method: "POST",
    body: JSON.stringify({
        "text": responseFlag,
        "channel": channelID,
        "thread_ts": threadTs
    }),
    headers: {
        "Content-Type": "application/json",
    },
});
}
