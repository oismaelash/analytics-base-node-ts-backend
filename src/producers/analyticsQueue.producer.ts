import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput
} from "@aws-sdk/client-sqs";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { randomUUID } from 'crypto'
import { IAnalyticsRequestDTO } from '../dtos/analytics.request.dto'
import * as DatetimeUtil from "../utils/datetime.util";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const sqs = new SQSClient({ region: process.env.AWS_REGION });

    const data = JSON.parse(event.body!) as IAnalyticsRequestDTO
    data.id = randomUUID()
    data.created_at = DatetimeUtil.getDatetimeIso();
    data.updated_at = DatetimeUtil.getDatetimeIso();

    const SQS_PARAMS: SendMessageCommandInput = {
      MessageDeduplicationId: data.id,
      MessageBody: JSON.stringify(data),
      QueueUrl: process.env.ANALYTICS_QUEUE,
      MessageGroupId: "1"
    };

    console.log('sqsParams', SQS_PARAMS)
    const sqsResponse = await sqs.send(new SendMessageCommand(SQS_PARAMS));
    console.log('sqsResponse', sqsResponse)

    return {
      statusCode: 200,
      body: sqsResponse.MessageId
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }
}