<template>
  <div ref="temp" class="quill" :class="{ isValue, isFocus, withToolbar }">
    <div v-if="!useInComment" class="loading" :class="[{ show: loading }]">
      <img width="40" height="10" src="~assets/svg/icon-fetch.svg" alt="" />
    </div>
    <span v-if="!withToolbar" class="placeholder">{{ placeholder }}</span>
    <div ref="editor"></div>
    <span v-if="error" class="error">{{ error }}</span>
    <input
      :id="`id-${id}`"
      ref="file"
      type="file"
      class="hidden"
      accept=".jpg, .jpeg, .png, .gif, .svg, .bmp"
      @change="onChangeHandler"
    />
    <div class="hidden"><icon-fileupload ref="icon" /></div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import s from '@/assets/globalVars.module.scss'
import { Api } from '@/api.config'
import { random } from '@/helpers'

let pastedHTML

export default {
  props: {
    withToolbar: Boolean,
    value: String,
    name: String,
    error: String,
    placeholder: String,
    useInComment: {
      type: Boolean,
      default: () => {
        false
      }
    }
  },
  data() {
    return {
      id: null,
      loading: true,
      isValue: false,
      isFocus: false
    }
  },
  async mounted() {
    const vm = this as any
    vm.id = random()

    const colors = Object.keys(s)
      .filter((key) => key.startsWith('--c-'))
      .map((key) => s[key])

    const toolbar = vm.withToolbar
      ? [
          [{ header: [false, 3, 4, 5] }],
          ['bold', 'italic', 'underline', 'link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: colors }, { background: ['transparent', ...colors] }],
          ['clean'],
          ['source']
        ]
      : false

    // @ts-ignore
    const Quill = await import('quill').then((i) => i.default)
    const Parchment = Quill.import('parchment')

    const createPach = (x: string) =>
      new Parchment.Attributor.Class(x, `ql-${x}`, {
        scope: Parchment.Scope.INLINE
      })

    Quill.register(createPach('source'), true)

    const needsButton = `<label class="custom-label ql-source" for="id-${vm.id}">${vm.$refs.icon.outerHTML}</label>`
    const icons = Quill.import('ui/icons')
    icons.source = needsButton

    const quill = new Quill(vm.$refs.editor, {
      modules: {
        clipboard: {
          matchVisual: false
        },
        toolbar
      },
      placeholder: vm.withToolbar ? vm.placeholder : '',
      theme: 'snow'
    })

    vm.$_quill = quill
    setTimeout(() => {
      vm.loading = false
    }, 100)

    /*
     ** insert value after initialization
     */
    const unwatch = vm.$watch('value', () => {
      // quill.clipboard.dangerouslyPasteHTML(0, vm.value)
      quill.setContents(quill.clipboard.convert(vm.value))
      vm.isValue = !!vm.value
      unwatch()
    })
    // quill.clipboard.dangerouslyPasteHTML(0, vm.value)
    quill.setContents(quill.clipboard.convert(vm.value))
    vm.isValue = !!vm.value
    /*
     ** emiting content to parent
     */

    const emiting = () => {
      const value =
        vm.$refs.temp.querySelector('.ql-editor').innerHTML?.trim() || ''

      /** the only solution */
      // if (value === '<p><br></p>') value = ''
      vm.$emit('input', {
        target: {
          value,
          name: vm.name
        }
      })
    }

    emiting()
    quill.on('text-change', emiting)
    vm.$on('force-change', () => emiting())

    function focusCallback({ type }: any): void {
      switch (type) {
        case 'focusin': {
          vm.isFocus = true
          document.body.classList.add('g-in-focus')
          break
        }
        case 'focusout': {
          vm.isFocus = false
          vm.$emit('blur', vm.isFocus)

          document.body.classList.remove('g-in-focus')
          break
        }
      }
    }

    const ed = vm.$refs.editor as HTMLElement
    ed.addEventListener('focusin', focusCallback)
    ed.addEventListener('focusout', focusCallback)
    vm.$once('hook:beforeDestroy', () => {
      ed.removeEventListener('focusin', focusCallback)
      ed.removeEventListener('focusout', focusCallback)
    })

    /** replace source button to label with id  */
    vm.$nextTick(() => {
      const sourceBtn = vm.$refs.temp.querySelector('button.ql-source')
      if (sourceBtn) sourceBtn.outerHTML = needsButton
    })
  },
  methods: {
    async onChangeHandler() {
      const vm = this as any
      const fileInp = vm.$refs.file
      if (!fileInp.value) return

      try {
        const [file] = fileInp.files

        vm.loading = true
        const formData = new FormData()
        formData.append('upload', file)
        const { data } = await vm.$axios.post(
          Api.client.RESOURCES_UPLOAD,
          formData
        )
        // [w450, w700, w1400]
        const [, w700] = data.conversions
        const { id, original_url } = data

        const src = (() => {
          const ext = original_url.split('.').pop()
          switch (ext) {
            case 'bmp':
            case 'svg':
            case 'gif':
              return original_url
            default:
              return w700
          }
        })()

        /** Use id for uniq image */
        pastedHTML = `<img alt="wikihero-image-id: ${id}" src="${src}"/><p><br></p>`

        vm.$_quill.clipboard.dangerouslyPasteHTML(
          vm.$_quill.getSelection(true)?.index || 0,
          pastedHTML,
          'user'
        )
      } catch (e) {
        vm.$notification.error('smth')
      } finally {
        // vm.$emit('force-change')
        vm.loading = false
        /** clear file input */
        fileInp.value = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'v-quill.scss';
</style>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
</style>
