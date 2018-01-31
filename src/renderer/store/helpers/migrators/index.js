import Semver from 'semver'
const files = require.context('.', false, /\.js$/)
const migrators = []

files.keys().forEach(key => {
  if (key === './index.js') return
  migrators.push(files(key).default)
})

migrators.sort((a, b) => { return Semver.lt(a.version, b.version) })

export default migrators
