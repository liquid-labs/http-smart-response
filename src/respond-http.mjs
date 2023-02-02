import { highlightYAML } from './highlight-yaml'
import yaml from 'js-yaml'

const allFormats = [
  'application/json',
  'application/yaml',
  'application/x-yaml',
  'text/terminal',
  'text/plain'
]

const dataFormats = ['application/json', 'application/yaml', 'application/x-yaml']

const nonDataFormats = ['text/terminal', 'text/plain']

const respondHTTP = ({ data, msg, req, res, sendUndefined = false }) => {
  const format = req.accepts(allFormats)

  if (format === false) {
    res.status(406).send(`No acceptable response supported. Try one of ${allFormats.join(', ')}`)
    return
  }
  // else good to go
  res.type(format)

  if (msg && nonDataFormats.includes(format)) {
    res.write(msg + '\n\n')
  }

  if (data !== undefined || sendUndefined === true) {
    if (format === 'application/json') {
      const json = JSON.stringify(data, null, '  ')
      res.send(json)
    }
    else {
      let yamlString = yaml.dump(data)
      if (format === 'text/terminal') {
        yamlString = highlightYAML(yamlString)
      }

      res.send(yamlString)
    }
  }
}

export { allFormats, dataFormats, nonDataFormats, respondHTTP }
