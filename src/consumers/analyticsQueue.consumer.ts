import { SQSEvent, SQSRecord } from 'aws-lambda';
import { mysqlService } from '../services/mysql.service'
import { IAnalyticsRequestDTO } from '../dtos/analytics.request.dto'
import * as Queries from '../utils/queries.util'

export const handler = async (event: SQSEvent) => {

  try {
    const messages: SQSRecord[] = event.Records
    console.log('sqs.data', messages)
    if (messages) {
      for (const message of messages) {
        const sessionBody = JSON.parse(message.body) as IAnalyticsRequestDTO
        await sendToDataBase(sessionBody)
      }
    }

    return 'send all messages for database'
  } catch (error) {
    throw new Error(`Error consumer: ${error}`);
  }
}

const sendToDataBase = async (data: IAnalyticsRequestDTO) => {
  try {
    const query = Queries.createSessionTable(data)
    console.log('query for execute', query)
    const result = await mysqlService(query)
    console.log('sendToDataBase', result)
  } catch (error) {
    throw new Error(`Error sendToDataBase: ${error}`);
  }
}
