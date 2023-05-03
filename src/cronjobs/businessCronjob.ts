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

        if(!process.env.ENDPOINT_CLIENTS){
            throw new Error('ENDPOINT_CLIENTS undefined')
        }

        const CLIENTS = await (await axios.get(process.env.ENDPOINT_CLIENTS)).data as IBusinessResponseDTO[]
        const RANGES = process.env.RANGES?.split(',')
        
        // console.log('CLIENTS', CLIENTS)
        // console.log('RANGES', RANGES)

        if (!RANGES) {
            throw new Error('Ranges undefined')
        }

        let response = [] as any[]

        for (const client of CLIENTS) {
            for (const range of RANGES) {
                const SQS_PARAMS = getSQSParams(client, range)
                await SQS.send(new SendMessageCommand(SQS_PARAMS));
                response.push({
                    client: client.slug,
                    range: range
                })
                console.log('sended', client.slug, range)
            }
        }

        // console.log('response', response)

        return {
            statusCode: 200,
            body: `send all business by ranges with success` 
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
        QueueUrl: process.env.ANALYTICS_SUMARIZATION_QUEUE,
        MessageGroupId: range
    };
    return SQS_PARAMS
}