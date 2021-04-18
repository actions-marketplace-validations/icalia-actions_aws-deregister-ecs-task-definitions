import ECS, {
  StringList,
  ListTaskDefinitionsRequest,
  DeregisterTaskDefinitionRequest,
} from "aws-sdk/clients/ecs";

export interface DeregisterDefinitionInputs {
  definition: string;
}

function getClient(): ECS {
  return new ECS({
    customUserAgent: "icalia-actions/aws-action",
    region: process.env.AWS_DEFAULT_REGION,
  });
}

export async function deregisterTaskDefinitionReducer(
  _accumulator: any,
  currentTaskDefinitionArn: string
) {
  const { taskDefinition } = await getClient()
    .deregisterTaskDefinition({
      taskDefinition: currentTaskDefinitionArn,
    } as DeregisterTaskDefinitionRequest)
    .promise();

  return taskDefinition;
}

export function validateInputs(inputs: DeregisterDefinitionInputs): void {
  const { definition } = inputs;
  if (!definition) throw "No given definition string";
  if (!definition.match(/^(arn:.+)?[a-z0-9-]+(:\d+)?$/i)) {
    throw `The given definition string '${definition}' doesn't match the expected format`;
  }
}

export async function getTaskDefinitionList(
  definition: string
): Promise<StringList> {
  if (definition.startsWith("arn:") || definition.match(/^[a-z0-9-]+:\d+$/i)) {
    return [definition] as StringList;
  }

  let response,
    nextToken,
    arns = [] as StringList;
  do {
    response = await getClient()
      .listTaskDefinitions({
        nextToken,
        familyPrefix: definition,
      } as ListTaskDefinitionsRequest)
      .promise();
    nextToken = response.nextToken;
    arns = arns.concat(response?.taskDefinitionArns || []);
  } while (nextToken);

  return arns;
}
