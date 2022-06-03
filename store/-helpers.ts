export const getAction = function(str: string) {
  const n = str.lastIndexOf('/')
  const result = str.substring(n + 1)
  return result
}
