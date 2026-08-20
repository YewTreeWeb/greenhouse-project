import {Command} from '@oclif/core'

export default class Clean extends Command {
  static override description = 'Cleanup'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Clean — work in progress')
  }
}
