import {Command} from '@oclif/core'

export default class List extends Command {
  static override description = 'List all snapshots for a project'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('seedbank list — work in progress')
  }
}
