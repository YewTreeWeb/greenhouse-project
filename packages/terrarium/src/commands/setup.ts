import {Command} from '@oclif/core'

export default class Setup extends Command {
  static override description = 'Bootstrap a fresh Mac or Linux machine — Nix-first setup, Homebrew (macOS), dotfiles, SSH, git config'

  static override examples = [
    '<%= config.bin %>',
  ]

  public async run(): Promise<void> {
    this.log('Setup — work in progress')
  }
}
