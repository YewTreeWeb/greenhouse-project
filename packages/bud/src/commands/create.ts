import {Command} from '@oclif/core'

export default class Create extends Command {
  static override description = 'Sandbox environments'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Create — work in progress')
  }
}
