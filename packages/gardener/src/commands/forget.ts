import {Command} from '@oclif/core'

export default class Forget extends Command {
  static override description = 'Stop tracking a project'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('gardener forget — work in progress')
  }
}
