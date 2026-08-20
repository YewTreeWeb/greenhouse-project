import {Command} from '@oclif/core'

export default class Scaffold extends Command {
  static override description = 'Scaffold a new project (Vite, Astro, Laravel 12) with opinionated defaults and official starter kits'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Scaffold — work in progress')
  }
}
