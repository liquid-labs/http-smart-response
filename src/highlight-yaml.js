const highlightYAML = (yaml) => {
  let highlighted = ''
  let inBlock = false
  let indentLevel = 0
  const lines = yaml.split('\n')

  for (let line of lines) {
    const currIndent = line.match(/^ */)[0].length
    if (inBlock && currIndent < indentLevel) {
      inBlock = false
    }
    if (!inBlock) {
      line = line.replace(/^(\s*)([^:]+):/, '$1<h2>$2<rst>:')
      line = line.replace(/([:-]\s*)(\d+\.?\d*|true|false|null|undefined)/i, '$1<code>$2<rst>')
    }
    if (line.match(/\|-$/)) {
      line = line.replace(/(\|-)$/, '<em>$1<rst>')
      inBlock = true
    }

    highlighted += line + '\n'

    indentLevel = currIndent
  }

  return highlighted
}

export { highlightYAML }
