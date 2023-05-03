import {
    SQSClient,
    SendMessageCommand,
    SendMessageCommandInput
} from "@aws-sdk/client-sqs";
import axios from "axios";
import { IBusinessResponseDTO } from "../dtos/business.response.dto"

export const handler = async () => {
    try {
        const SQS = new SQSClient({ region: process.env.AWS_REGION });
        const CLIENTS = (await axios.get(process.env.ENDPOINT_CLIENTS ?? '')).data as IBusinessResponseDTO[]
        const RANGES = process.env.RANGES?.split(',')

        if (!RANGES) {
            throw new Error('Ranges undefined')
        }

        for (const client of CLIENTS) {
            for (const range of RANGES) {
                const SQS_PARAMS = getSQSParams(client, range)
                await SQS.send(new SendMessageCommand(SQS_PARAMS));
            }
        }

        return {
            statusCode: 200,
            body: 'send all business by ranges with success'
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error
        }
    }
}

function getSQSParams(client: IBusinessResponseDTO, range: string) {
    const SQS_PARAMS: SendMessageCommandInput = {
        MessageDeduplicationId: client.id,
        MessageBody: JSON.stringify(client),
        QueueUrl: process.env.ANALYTICS_BUSINESS_QUEUE,
        MessageGroupId: range
    };
    return SQS_PARAMS
}