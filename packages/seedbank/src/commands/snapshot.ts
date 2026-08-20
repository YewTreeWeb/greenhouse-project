import {Command} from '@oclif/core'

export default class Snapshot extends Command {
  static override description = 'Take a snapshot of a project (or --all tracked projects) and store it at the configured destination'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('seedbank snapshot — work in progress')
  }
}
