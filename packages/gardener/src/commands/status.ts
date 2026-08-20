import {Command} from '@oclif/core'

export default class Status extends Command {
  static override description = 'Get a snapshot of all project health right now'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('gardener status — work in progress')
  }
}
