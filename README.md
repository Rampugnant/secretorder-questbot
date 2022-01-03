# ⚔️ Secret Order: QuestBoard

In fair fields and open roads, trouble stirs. Weary travelers are taken aback by phenomena, ghastly setbacks :ghost:, and poorly designed ed tech. As members of the Secret Order, we must heed their calls for assistance as it is our sworn duty!

The Secret Order: QuestBoard is a Slack App that uses webhooks to create a quest themed assistance request system and integrates with an Airtable CRM. It was created to help instructional designers manage the influx of ed tech assistance requests during the online ed transition that was spurred on by COVID-19. This repo holds the 2 scripts used in the app.

Sequence Breakdown:
1. An instructor requests assistance using Airtable appointments calendar
2. Airtable automation triggers SendCalltoSlackApp.JS as an Airtable script and it sends a packet to Slack App via webhook
3. Secret Order: QuestBoard Slack app receives the packet and posts it to #secret-order-quests channel in our Slack
4. Designers respond to the post through the buttons (accept, cancel, notes), which sends an interactivity response back to Secret Order : QuestBoard
5. The Secret Order: QuestBoard has an Airtable webhook listed as the response URL, so it forwards the interactivity response to Airtable's webhook
6. The Airtable webhook triggers ResponseHandler.JS as an Airtable script
7. ResponseHandler.JS parses the response, updates Airtable records accordingly and then uses the same process as earlier to thread onto the original message a status update




