import * as Progress from '../index'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function random(max: number) {
  return Math.floor(Math.random() * max)
}

const main =
  async () => {
    const workers = 5
    const progress = Progress.of(workers).start()
    const next =
      (index: number) =>
        progress.update({
          index,
          target: Math.random(),
          text: `Worker ${index + 1}, task ${random(100)}`
        })
    for (let i = 0; i < workers; i++) {
      next(i)
    }
    const intervalId = setInterval(() => {
      const index = random(workers)
      console.log(`Done ${progress.text(index)}.`)
      next(index)
    }, 3 * 1000)
    await sleep(60 * 1000)
    clearInterval(intervalId)
    progress.stop()
  }

main()
  .catch(console.error)
