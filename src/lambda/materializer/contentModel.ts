// AWS dependencies
import { DynamoDB } from "aws-sdk";
import { Callback, Context, Handler, DynamoDBStreamEvent } from "aws-lambda";

// Eventum dependencies
import { Event } from "eventum-sdk";

import { ContentModelMaterializer } from "../../materializer/ContentModelMaterializer";
const materializer = new ContentModelMaterializer();

/**
 * AWS Lambda function to handle the Eventum's events stream.
 *
 * This materialize the events into the Hyperdoc content model.
 *
 * @param event AWS DynamoDB Stream event
 * @param context AWS Lambda execution context
 * @param callback Callback
 */
export const handler: Handler = (event: DynamoDBStreamEvent, context: Context, callback: Callback) => {
  const promises = Promise.resolve();
  event.Records.forEach((record) => {
    if (record.dynamodb && record.dynamodb.NewImage) {
      const e = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as Event;

      promises.then(() => {
        return materializer.handle(e);
      });
    } else {
      // TODO handle unsupported record type
    }
  });

  promises
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      callback(error, null);
    });
};
