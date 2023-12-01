import hljs from 'highlight.js/lib/core'
import yamlLanguage from 'highlight.js/lib/languages/yaml'

import yaml from 'js-yaml'

hljs.registerLanguage('yaml', yamlLanguage)

const allFormats = [
  'application/json',
  'application/yaml',
  'application/x-yaml',
  'text/terminal',
  'text/plain'
]

const dataFormats = ['application/json', 'application/yaml', 'application/x-yaml']

const nonDataFormats = ['text/terminal', 'text/plain']

/**
 * Parameters:
 *
 * - `data`: _(object, optional)_ any data associated with the response.
 * - `msg`: _(string, optional)_ the message to send for non-data / human directed output.
 * - `req`: _(object, required)_ the request object.
 * - `res`: _(object, required)_ the results object.
 * - `sendData`: _(boolean)_ by default, data is not send with a human-directed message (i.e., when the request 'Accept' header is a non-data format). If true, then a YAML representaiton of the data is printed before the message.
 * - 'sendUndefined`` : _(boolean)_ by default, an undefined data directed response sends nothing. If true, then `undefined` is sent.
 */
const httpSmartResponse = ({
  data,
  msg,
  req = throw new Error("Missing required 'req' parameter."),
  res = throw new Error("Missing required 'res' parameter."),
  sendData = false,
  sendUndefined = false
}) => {
  const format = req.accepts(allFormats)

  if (format === false) {
    res.status(406).send(`No acceptable response supported. Try one of ${allFormats.join(', ')}`)
    return
  }
  // else good to go
  res.type(format)

  const userDirectedOutput = nonDataFormats.includes(format)

  if ((data !== undefined || sendUndefined === true) && userDirectedOutput === false) {
    const dataString = format === 'application/json'
      ? JSON.stringify(data, null, '  ')
      : yaml.dump(data)
    res.write(dataString)
  }
  else if (userDirectedOutput === true) {
    if (sendData === true) {
      const yamlString = yaml.dump(data)
      const highlightedYAML = hljs.highlight(yamlString, { language : 'yaml' }).value
      res.write(highlightedYAML + '\n\n')
    }

    if (msg !== undefined) {
      res.write(msg)
    }
  }

  res.end()
}

export { allFormats, dataFormats, nonDataFormats, httpSmartResponse }
