const { App, ExpressReceiver } = require("@slack/bolt");
require("dotenv").config();
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_BOT_TOKEN;
const port = 3000

const app = new App({
    token: slackToken,
    signingSecret: slackSigningSecret,
});


(async () => {
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();

app.event('app_mention', async ({ event, client, context }) => {
    try {
        const result = await client.views.publish({
            user_id: event.user,
            view: {
                type: 'home',
                callback_id: 'home_view',
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Welcome to your _App's Home_* :tada:"
                        }
                    }
                ]
            }
        });
    }
    catch (error) {
        console.error(error);
    }
});

app.command('/bot', async ({ ack, payload, context }) => {

    ack();

    try {
        const result = await app.client.chat.postMessage({
            token: context.botToken,
            channel: payload.channel_id,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Welcome. How are you doing?'
                    },
                    accessory: {
                        type: 'static_select',
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Doing Well"
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Neutral"
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Feeling Lucky"
                                },
                                "value": "value-2"
                            }
                        ],
                        action_id: 'action_feeling'
                    }
                }
            ],
            text: 'Message received!'
        });
    }
    catch (error) {
        console.error(error);
    }
});



app.action('action_feeling', async ({ ack, body, context }) => {
    ack();
    let selectedOption = body.actions[0].selected_option;
    try {
        const result = await app.client.chat.update({
            token: context.botToken,
            ts: body.message.ts,
            channel: body.channel.id,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'What are your favorite hobbies'
                    },
                    "accessory": {
                        "action_id": "action_hobbies",
                        "type": "multi_static_select",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Football"
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Music"
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Sleep"
                                },
                                "value": "value-2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Movies"
                                },
                                "value": "value-3"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Basketball"
                                },
                                "value": "value-4"
                            }
                        ]
                    }
                }
            ],
            text: 'Message received!'
        });
    }
    catch (error) {
        console.error(error);
    }
});

app.action('action_hobbies', async ({ ack, body, context }) => {

    ack();
    let selectedOption = body.actions[0].selected_options;
    selectedOption.map((item)=>{
        console.log(`Option selected: \n ${JSON.stringify(item)}`);
    })

    try {
        const result = await app.client.chat.update({
            token: context.botToken,
            ts: body.message.ts,
            channel: body.channel.id,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Thank you'
                    }
                }
            ],
            text: 'Message from Test App'
        });
    }
    catch (error) {
        console.error(error);
    }
});
