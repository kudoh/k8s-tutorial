import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import client from "./dynamodb-client";
import { TaskCreateRequest } from "./types";

const createTaskHandler: RequestHandler<
  {},
  { taskId: string },
  TaskCreateRequest
> = async (req, res) => {
  const { body } = req;
  console.log("received create request", body);
  const taskId = uuidv4();
  const response = await client
    .put({
      TableName: process.env.TASK_TABLE_NAME || "tasks",
      Item: {
        user_name: body.userName,
        task_id: taskId,
        start_at: body.startAt,
        title: body.title,
        contents: body.contents,
        notified: false,
        status: "UNDONE",
      },
    })
    .promise();
  console.log(
    "[CREATE]success! consumed capacity:",
    response.ConsumedCapacity?.CapacityUnits
  );
  res.status(201);
  res.send({ taskId });
};

export default createTaskHandler;
