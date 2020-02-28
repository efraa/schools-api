import WinstonSlackHook from 'winston-slack-webhook-transport'
import { Configuration as config } from '../../../../config/Configuration'

const slackOptions: any = {
  webhookUrl: config.utils.slackHook,
  formatter: data => ({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: data.level === 'error' ?
            ":sos: :fire: *EXCEPTION, UNEXPECTED ERROR* :fire: :sos:"
            : ":information_source: *INFORMATION+ :snowflake:"
        }
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: data.level === 'error' ? 
            ":fire: Hi Team, we have problems, an uncontrolled error has occurred in the API Server, this is what happened: :fire:"
            : ":coffee: Hi Team, we have a bit of movement in the API Server, this is what happened:"
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.level === 'error' ? `*ERROR: * ${data.message}` : `*MESSAGE: * ${data.message}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            "type": "mrkdwn",
            "text": `*At* ${new Date()} `
          }
        ]
      }
    ],
  }) 
}
// @ts-ignore
export const SlackHook = new WinstonSlackHook(slackOptions)
