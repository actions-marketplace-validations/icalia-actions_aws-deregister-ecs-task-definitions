import { info, getInput, setOutput } from "@actions/core";

import {
  validateInputs,
  getTaskDefinitionList,
  DeregisterDefinitionInputs,
  deregisterTaskDefinitionReducer,
} from "./definition-management";

export async function run(): Promise<number | undefined> {
  const definition = getInput("definition");
  validateInputs({ definition } as DeregisterDefinitionInputs);

  const definitionArns = await getTaskDefinitionList(definition);
  if (definitionArns.length < 1) {
    info(`No task definitions found for family '${definition}'.`);
    return 0;
  }

  info(`De-registering task definitions associated to '${definition}'...`);
  await definitionArns.reduce(deregisterTaskDefinitionReducer, undefined);
  info("...finished!");

  return 0;
}
