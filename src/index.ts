export type Worker = {
  progress: number,
  target: number,
  text: string
}

export const ansi = {
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  inverse: '\x1b[7m',
  hidden: '\x1b[8m',
  strikethrough: '\x1b[9m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',

  up: (n: number) => `\x1b[${n}A`,
  down: (n: number) => `\x1b[${n}B`,
  right: (n: number) => `\x1b[${n}C`,
  left: (n: number) => `\x1b[${n}D`,

  reset: '\x1b[0m',
  clear: '\x1b[2J',
  clearLine: '\x1b[2K',
  clearScreenDown: '\x1b[0J',
  clearLineRight: '\x1b[0K',

  cursorTo: (x: number, y: number) => `\x1b[${y};${x}H`,
  cursorMove: (x: number, y: number) => `\x1b[${y};${x}f`,
  scrollUp: (n: number) => `\x1b[${n}S`,
  scrollDown: (n: number) => `\x1b[${n}T`,

  save: '\x1b[s',
  restore: '\x1b[u',

  beep: '\x07'
}

export const spinnerChars = '◐◓◑◒'

export function bar(length: number, progress: number) {
  const chars = ' ▏▎▍▌▋▊▉█'
  return Array
    .from({ length })
    .map((_, i) => {
      const j = Math.round(i * 8)
      const k = Math.round(progress * length * 8)
      return chars[k < j ? 0 : k >= (j + 8) ? 8 : k % 8]
    })
    .join('')
}

export function percentage(progress: number) {
  return (progress * 100).toFixed(1).padStart(5, ' ') + '%'
}

export function progressBar(progress: number, text: string): string {
  return `${bar(25, progress)} ${percentage(progress)} ${text}${ansi.clearLineRight}`
}

export function of(length = 1) {
  return new Progress(length)
}

export class Progress {

  #intervalId?: ReturnType<typeof setInterval>
  #workers: Worker[]

  constructor(length = 1) {
    this.#workers = Array.from({ length }, () => ({
      progress: 0,
      target: 0,
      text: ''
    }))
  }

  text(index = 0) {
    return this.#workers[index].text
  }

  update({ index = 0, progress, target, text }: Partial<{ index: number } & Worker>) {
    const worker = this.#workers[index]
    if (!worker) {
      return
    }
    if (progress !== undefined) {
      worker.target = progress
      worker.progress = progress
    }
    if (target !== undefined) {
      worker.target = target
    }
    if (text !== undefined) {
      worker.text = text
    }
  }

  print() {
    process.stdout.write(ansi.clearLine + '\n')
    for (const { progress, text } of this.#workers) {
      process.stdout.write(`${bar(25, progress)} ${percentage(progress)} ${text}${ansi.clearLineRight}\n`)
    }
    process.stdout.write(ansi.up(this.#workers.length + 1))
  }

  stop() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId)
      this.#intervalId = undefined
    }
  }

  start(fps = 12) {
    this.stop()
    this.#intervalId = setInterval(() => {
      for (const worker of this.#workers) {
        worker.progress += (worker.target - worker.progress) / fps
      }
      this.print()
    }, 1000 / fps)
    return this
  }

}
