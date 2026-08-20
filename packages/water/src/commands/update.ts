import {Command} from '@oclif/core'

export default class Update extends Command {
  static override description = 'Dependency updates'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Update — work in progress')
  }
}
