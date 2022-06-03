/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Vue from 'vue'
import _ob, { createDefaultObserver } from '@/helpers/dom/observer'

Vue.filter('pluralize', function(count, single, plural, withCount = true) {
  count = Number(count) || 0

  switch (count) {
    case 0:
    case 1:
      return withCount ? `${count} ${single}` : single
    default:
      return withCount ? `${count} ${plural}` : plural
  }
})

Vue.filter('paginator', function([moreTxt, reduceTxt], meta) {
  if (!meta) return 'NO_META_DATA'
  let result
  const diff = meta.total - meta.to
  if (meta.per_page < diff) {
    result = meta.per_page
  } else {
    result = diff
  }
  return result ? `${moreTxt} ${result}` : reduceTxt
})

Vue.mixin({
  mounted() {
    // local ob instanse
    ;(() => {
      const obs = this.$options.localObserver
      if (!obs) return

      const _ob = createDefaultObserver()
      const options = obs.call(this)
      const components = this.$options.components
      Promise.all(
        Object.keys(components).map((i) => {
          try {
            const asyncModule = components[i]
            return asyncModule()
          } catch (e) {
            return Promise.resolve()
          }
        })
      ).then(() => {
        if (options.collection) _ob.collection(options.collection())
        if (options.single) _ob.single(options.single())
        _ob.watch()
        this.$once('hook:beforeDestroy', () => {
          _ob.disconnect()
        })
      })
    })()

    // global ob instanse
    ;(() => {
      const obs = this.$options.globalObserver
      if (!obs) return

      const options = obs.call(this)
      const components = this.$options.components
      Promise.all(
        Object.keys(components).map((i) => {
          try {
            const asyncModule = components[i]
            return asyncModule()
          } catch (e) {
            return Promise.resolve()
          }
        })
      ).then(() => {
        if (options.collection) _ob.collection(options.collection())
        if (options.single) _ob.single(options.single())
        _ob.watch()
        this.$once('hook:beforeDestroy', () => {
          _ob.disconnect()
        })
      })
    })()
  },
  methods: {
    $parseEntity(entity) {
      let type
      if (!entity.slug) {
        return {
          type: 'tip',
          slug: `/tip/${entity.id}`
        }
      } else if (!entity.parent_id) {
        return {
          type: 'topic',
          slug: `/${entity.slug}`,
          generateChild: (slug) => `/${entity.slug}/${slug}`
        }
      } else {
        return {
          type: 'subtopic',
          slug: `/${entity.overall_topic?.slug}/${entity.slug}`,
          generateChild: (slug) => `/${entity.overall_topic?.slug}/${slug}`
        }
      }
    },
    fintContentInEditor(data = {}, key) {
      if (typeof key === 'undefined') {
        let html = ''
        if (data.blocks)
          data.blocks.forEach(function(block) {
            switch (block.type) {
              case 'header':
                html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
                break
              case 'paragraph':
                html += `<p>${block.data.text}</p>`
                break
              case 'delimiter':
                html += '<hr />'
                break
              case 'image':
                html += `<img src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`
                break
              case 'list':
                html += '<ul>'
                block.data.items.forEach(function(li) {
                  html += `<li>${li}</li>`
                })
                html += '</ul>'
                break
              default:
                // eslint-disable-next-line no-console
                console.log('Unknown block type', block.type)
                break
            }
          })
        return html
      }

      const isIndex = typeof key === 'number'
      const { blocks = [] } = data
      const finded = blocks.find((i, index) => {
        if (isIndex) return index === key
        else return i.type === key
      })

      return finded?.data.text || finded?.data.items
    }
  }
})
