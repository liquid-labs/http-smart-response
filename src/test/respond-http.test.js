/* global beforeAll describe expect test */

import { allFormats, dataFormats, nonDataFormats, respondHTTP } from '../respond-http'

const ResMock = class {
  #done
  #log
  #status
  #type

  constructor() {
    this.#done = false
    this.#log = []
  }

  write(string) {
    this._checkDone()
    this.#log.push(string)
    return this
  }

  send(string) {
    this.write(string)
    this.#done = true
    return this
  }

  status(code) {
    this.#status = code
    return this
  }

  type(format) {
    this.#type = format
    return this
  }

  get log() { return this.#log.join('\n') }
  _checkDone() {
    if (this.#done === true) throw new Error('Attempted to write to result after result closed.')
  }
  _getType() { return this.#type }
  _getStatus() { return this.#status }
}

describe('respondHTTP', () => {
  test.each(nonDataFormats)("sends message for '%s' responses", (format) => {
    const req = { accepts : () => format }
    const res = new ResMock()
    respondHTTP({ msg: 'Hi!', data: { foo: 'bar' }, req, res })
    expect(res._getType()).toBe(format)
    expect(res.log.match(/^Hi!/)).toBeTruthy()
  })

  test('Results in a 406 response if no format is supported.', () => {
    const req = { accepts: () => false }
    const res = new ResMock()
    respondHTTP({ msg: 'Hi!', data: { foo: 'bar' }, req, res })
    expect(res._getStatus()).toBe(406)
  })

  test("'application/json' requests result in JSON output", () => {
    const req = { accepts : () => 'application/json' }
    const res = new ResMock()
    const data = { foo: 'bar' }
    respondHTTP({ msg: 'Hi!', data, req, res })
    expect(res._getType()).toBe('application/json')
    expect(res.log.match(/^Hi!/)).toBe(null)
    expect(JSON.parse(res.log)).toEqual(data)
  })
})