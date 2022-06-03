import stripHtml from 'string-strip-html'

export const headGenerator = function(module) {
  const meta = []

  if (module.meta_title || module.name)
    meta.push({
      hid: 'og:title',
      name: 'og:title',
      content: module.meta_title || module.name
    })

  if (module.meta_description || module.description)
    meta.push(
      {
        hid: 'og:description',
        name: 'og:description',
        property: 'og:description',
        content: stripHtml(module.description || module.meta_description)
      },
      {
        hid: 'description',
        name: 'description',
        property: 'description',
        content: stripHtml(module.meta_description || module.description)
      }
    )

  if (module.image)
    meta.push(
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: module.image
      },
      {
        hid: 'image',
        name: 'image',
        property: 'image',
        content: module.image
      }
    )

  if (module.meta_keywords)
    meta.push({
      name: 'keywords',
      content: module.meta_keywords
    })

  return {
    title: module.meta_title || module.name,
    meta
  }
}
