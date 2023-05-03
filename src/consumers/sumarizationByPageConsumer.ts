import { APIGatewayEvent } from "aws-lambda";
import * as DynamoDB from "../services/dynamodb.service";
import * as Response from "../utils/response.util";

export const handler = async (apiGatewayEvent: APIGatewayEvent) => {
  try {
    if (!apiGatewayEvent.pathParameters) {
      throw new Error("pathParameters imcomplete for get analytics");
    }

    const BUSINESS_SLUG = apiGatewayEvent.pathParameters.businessSlug as string;
    const RANGE = apiGatewayEvent.pathParameters.range as string;
    const PAGE_NAME = apiGatewayEvent.pathParameters.pageName as string;

    if (!BUSINESS_SLUG || !RANGE || !PAGE_NAME) {
      throw new Error("Data imcomplete for get analytics");
    }

    console.log(BUSINESS_SLUG, RANGE, PAGE_NAME)
    const DATA = await DynamoDB.getByPage(BUSINESS_SLUG, RANGE, PAGE_NAME);
    console.log("DATA", DATA)
    return Response.handler(200, JSON.stringify(DATA));
  } catch (error) {
    console.log('error', error)
    return Response.handler(400, error);
  }
};
