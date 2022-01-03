// This is an Airtable Script so it uses airtable.js and triggers from within AT

// get the record when it triggers and put it into a JS object
let inputConfig = input.config();
let table = base.getTable("CONSULTATIONS");


let sendRecord = await table.selectRecordAsync(inputConfig.recID);
let recordInfo = {
    id: sendRecord.id,
    name: sendRecord.name,
    "SIGNINLink": sendRecord.getCellValue("Signin"),
    "InstructorEmail": sendRecord.getCellValueAsString("Plain signin email"),
    "NeedsHelpWith": sendRecord.getCellValueAsString("Plain - lookup - issue"),
	  "InstructorName": sendRecord.getCellValueAsString("look up - instructor name")

}


// API call to slack app webhook with blocks structure
let response = await fetch("https://hooks.slack.com/services/SECRET", {
    method: "POST",
    body: JSON.stringify({"text":"A fellow adventurer is in need of assistance!" ,
        "blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*" + recordInfo.name +  "*\n\n:star: *Instructor:* " + recordInfo.InstructorName + " - " + recordInfo.InstructorEmail +  "\n\n :mountain: *Needs Help With:* " + recordInfo.NeedsHelpWith
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ""+recordInfo.id
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Will you heed the call?*"
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Yes! It is I...",
						"emoji": true
					},
					"value": "TRUE",
					"style": "primary"
				},
                {
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Access Notes",
						"emoji": true
					},
					"value": "NOTES",
					"url": "https://airtable.com/SECRET" + recordInfo.SIGNINLink[0].id
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Cancel Consult",
						"emoji": true
					},
					"style": "danger",
					"value": "CANCEL",
					"confirm": {
						"title": {
							"type": "plain_text",
							"text": "Are you sure?"
						},
						"confirm": {
							"type": "plain_text",
							"text": "Yes Cancel"
						},
						"deny": {
							"type": "plain_text",
							"text": "No, I clicked the wrong button"
						}
					}
				}
			]
		}
	]
    }),
    headers: {
        "Content-Type": "application/json",
    },
});
