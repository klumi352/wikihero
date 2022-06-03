/* eslint-disable no-prototype-builtins */
/* eslint-disable no-dupe-keys */
import slugGenerator from 'slugify'

const generate = (s) =>
  slugGenerator(s, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true // strip special characters except replacement, defaults to `false`
  })

export function slugify(s) {
  return generate(typeof s === 'string' ? s : '')
}
