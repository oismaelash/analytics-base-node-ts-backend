import * as AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

const ANALYTICS_TABLE_SUMARIZATION_NAME = process.env.ANALYTICS_TABLE_SUMARIZATION_NAME

export const createOrUpdateByPage = async function (Item: any) {

  if (!ANALYTICS_TABLE_SUMARIZATION_NAME) {
    throw new Error('ANALYTICS_TABLE_SUMARIZATION_NAME undefined')
  }

  const params = {
    TableName: ANALYTICS_TABLE_SUMARIZATION_NAME,
    Item,
  };

  try {
    await dynamoDBClient.put(params).promise();
    return Item;
  } catch (error) {
    console.error("createOrUpdate.error:", error);
    throw new Error(error);
  }
};

export const getByPage = async function (
  businessSlug: string,
  range: string,
  pageName: string
) {
  if (!ANALYTICS_TABLE_SUMARIZATION_NAME) {
    throw new Error('ANALYTICS_TABLE_SUMARIZATION_NAME undefined')
  }

  const params = {
    TableName: ANALYTICS_TABLE_SUMARIZATION_NAME,
    KeyConditionExpression: `#pk = :pk and #cAt = :cAt`,
    ExpressionAttributeNames: {
      "#pk": "businessId#range#pageName",
      "#cAt": "created_at",
    },
    ExpressionAttributeValues: {
      ":pk": `${businessSlug}#${range}#${pageName}`,
      ":cAt": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    },
  };
  console.log("DDB.get.params", params);
  try {
    const data = await dynamoDBClient.query(params).promise();
    console.log("data", data.Items);
    return data.Items ? data.Items[0] : {};
  } catch (error) {
    console.error("get.error:", error);
    throw new Error(error);
  }
};