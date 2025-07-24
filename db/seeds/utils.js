const db = require("../../db/connection");


exports.createLookupRef = (data, currentKey, targetKey) => {
  const ref = {}
  data.forEach((datum) => {
    const currentValue = datum[currentKey]
    ref[currentValue] = datum[targetKey]
  })
  return ref
}

