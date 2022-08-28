import type { Default } from './config.interface'
import { config } from './envs/default'

export const configuration = (): Default => {
  return config
}
