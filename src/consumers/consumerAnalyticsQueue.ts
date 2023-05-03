import { SQSEvent, SQSRecord } from 'aws-lambda';
import { mysqlService } from '../services/mysql'
import { AnalyticsRequestDTO } from '../dto/analytics.request.dto'
import * as Queries from '../utils/queries'

export const handler = async (event: SQSEvent) => {

  try {
    const messages: SQSRecord[] = event.Records
    console.log('sqs.data', messages)
    if (messages) {
      for (const message of messages) {
        const sessionBody = JSON.parse(message.body) as AnalyticsRequestDTO
        await sendToDataBase(sessionBody)
      }
    }

    return 'send all messages for database'
  } catch (error) {
    throw new Error(`Error consumer: ${error}`);
  }
}

const sendToDataBase = async (data: AnalyticsRequestDTO) => {
  try {
    const query = Queries.insertAnalyticsTable(data)
    console.log('query for execute', query)
    const result = await mysqlService(query)
    console.log('sendToDataBase', result)
  } catch (error) {
    throw new Error(`Error sendToDataBase: ${error}`);
  }
}
