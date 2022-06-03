/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionsList } from '@/store/post'
export const ChunkPostMixin = () =>
  Vue.extend({
    data() {
      return {
        currMode: ''
      }
    },
    methods: {
      handleModal($mode: String) {
        const vm = this
        switch ($mode) {
          case 'create':
            vm.currMode = 'modalCreatePost'
            break
          case 'edit':
            vm.currMode = 'modalEditPost'
        }
        // @ts-ignore
        vm.$refs[vm.currMode].open()
      },
      async editHandle($id: any) {
        const vm = this
        try {
          await vm.$store.dispatch(`post/${ActionsList.FIND_POST}`, {
            slug: $id,
            isAdmin: true
          })
        } catch (e) {
          throw e
        } finally {
          vm.handleModal('edit')
        }
      }
    }
  })
