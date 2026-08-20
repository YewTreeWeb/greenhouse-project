import {Command} from '@oclif/core'

export default class Doctor extends Command {
  static override description = 'Greenhouse environment health check, inspired by flutter doctor'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Doctor — work in progress')
  }
}
