/* global beforeAll describe expect test */

import { highlightYAML } from '../highlight-yaml'

const yamlPlain = `foo: 1
bar: A string!
baz: true
wha:
  a: false
  b: Another value
list:
  - an embedded
  - list
  - 1.5
block: |-
  This is a block of text.
  1
  true
  last line
`

describe('highlightYAML', () => {
  let highlighted
  beforeAll(() => { highlighted = highlightYAML(yamlPlain) })

  test('highlights keys (first level)', () => {
    expect(highlighted.match(/<h2>baz<rst>/m)).toBeTruthy()
    expect(highlighted.match(/<h2>bar<rst>/m)).toBeTruthy()
  })

  test('highlights keys (embedded)', () => {
    expect(highlighted.match(/<h2>a<rst>/m)).toBeTruthy()
    expect(highlighted.match(/<h2>b<rst>/m)).toBeTruthy()
  })

  test('highlights block operator', () => expect(highlighted.match(/<em>|-<rst>/)).toBeTruthy())

  test.each([
    ['integers', '1'],
    ['boolean', 'true'],
    ['object-embedded boolean', 'false'],
    ['list-embedded float', '1.5']
  ])('highlights %s (%s)', (desc, value) => expect(highlighted.match(new RegExp(`<code>${value}<rst>`))).toBeTruthy())
})
