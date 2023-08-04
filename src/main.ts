import * as core from '@actions/core'
import {Inputs, publish} from './publish'
import {AxiosError} from 'axios'

function getInputs(): Inputs {
  return {
    clientId: core.getInput('client_id'),
    clientSecret: core.getInput('client_secret'),
    appBundleAlias: core.getInput('appbundle_alias'),
    appBundleEngine: core.getInput('appbundle_engine'),
    appBundleId: core.getInput('appbundle_id'),
    appBundlePath: core.getInput('appbundle_path'),
    activities: core.getInput('activities'),
    create: core.getInput('create') === 'true'
  }
}

async function run(): Promise<void> {
  try {
    core.info('Publishing app bundle...')
    const inputs = getInputs()
    await publish(inputs)
    core.info('App bundle published successfully')
  } catch (error) {
    if (error instanceof AxiosError) {
      core.setFailed(error.response?.data)
      if (error.stack) core.debug(error.stack)
      return
    }
    if (error instanceof Error) {
      core.setFailed(error.message)
      if (error.stack) core.debug(error.stack)
      return
    }
    core.setFailed('Unknown error')
  }
}

run()
