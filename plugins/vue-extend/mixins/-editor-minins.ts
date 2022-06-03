import Vue from 'vue'
import cd from 'lodash/cloneDeep'

export const EditorMixins = () =>
  Vue.extend({
    methods: {
      _fintContentInEditor(data: any = {}, key: any) {
        try {
          if (typeof key === 'undefined') {
            let html = ''
            data?.blocks?.forEach(function(block: any) {
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
                  block.data.items.forEach(function(li: any) {
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
          const finded = blocks.find((i: any, index: any) => {
            if (isIndex) return index === key
            else return i.type === key
          })

          return finded?.data.text || finded?.data.items
        } catch (e) {
          return ''
        }
      },
      _chunkData(data: any, compareType = 'header') {
        let currArr: any
        const result: any = []
        const getEmpty = () => ({ blocks: [] })
        data.blocks.forEach(({ data, type }: any) => {
          if (type === compareType) {
            currArr = getEmpty()
            currArr.blocks.push({ data, type })
            result.push(currArr)
          } else if (currArr) {
            currArr.blocks.push({ data, type })
          }
        })
        return result
      },
      _trimFirstBlock(data: any) {
        data = cd(data)
        data.blocks = data.blocks.slice(1)
        return data
      }
    }
  })
