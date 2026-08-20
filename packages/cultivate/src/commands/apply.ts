import {Command} from '@oclif/core'

export default class Apply extends Command {
  static override description = 'Apply dev configs to an existing project (ESLint, Prettier, Tailwind, Stylelint)'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Apply — work in progress')
  }
}
