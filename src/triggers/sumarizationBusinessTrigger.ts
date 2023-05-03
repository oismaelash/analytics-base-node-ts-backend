import { SQSEvent } from "aws-lambda";
import * as Response from "../utils/response.util";
import { IBusinessResponseDTO as IBusinessResponseDTO } from "../dtos/business.response.dto";
import * as DynamoDB from "../services/dynamodb.service";
import * as FormatToGraphic from "../utils/formatToGraphic.util";

export const handler = async (sqsEvent: SQSEvent) => {
  try {
    console.log('sqsEvent.Records.count', sqsEvent.Records.length)
    console.log('sqsEvent.Records', sqsEvent.Records)
    const BUSINESS_DATA: IBusinessResponseDTO = JSON.parse(sqsEvent.Records[0].body);
    const RANGE = sqsEvent.Records[0].attributes.MessageGroupId
    const HOME_PAGE_NAME = 'home'
    const CREATED_AT = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

    if (!RANGE) {
      throw new Error('Range undefined')
    }

    console.log("sumarization of client", BUSINESS_DATA.slug);
    console.log("sumarization of range", RANGE);

    const GRAPHIC_TOTAL_VIEWS = await FormatToGraphic.totalViews(BUSINESS_DATA.slug, RANGE);

    const HOME_PAGE_DATA = {
      "businessSlug#range#pageName": `${BUSINESS_DATA.slug}#${RANGE}#${HOME_PAGE_NAME}`,
      created_at: CREATED_AT,
      graphicViewsTotal: GRAPHIC_TOTAL_VIEWS
    };

    // console.log("HOME_PAGE_DATA", HOME_PAGE_DATA);

    await DynamoDB.createOrUpdateByPage(HOME_PAGE_DATA);

    return Response.handler(200, `sumarization with success of client ${BUSINESS_DATA.slug} of range: ${RANGE}`)
  } catch (error) {
    return Response.handler(500, error)
  }
};