import * as Progress from './index.js'

test('percentage', () => {
  expect(Progress.percentage(0)).toEqual('  0.0%')
  expect(Progress.percentage(1)).toEqual('100.0%')
})
