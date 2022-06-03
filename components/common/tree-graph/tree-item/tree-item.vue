<template>
  <!-- $parent important is tree-graph -->
  <div class="wrapper" :class="`mode-${mode}`">
    <button
      v-if="reorderId && mode === 'from'"
      class="btn-back g-btn g-btn--fill"
      @click="$parent.reorderId = null"
    >
      {{ $t('global.back') }}
    </button>
    <v-stepper ref="stepper" no-loader>
      <v-step visible>
        <button
          v-if="treeData.data && treeData.data.every((i) => i.parent_id)"
          class="g-btn g-btn--link"
          @click="loadList(currentParentId)"
        >
          <icon-arrow class="a-rot90" width="12" height="12" />&nbsp;{{
            $t('global.back')
          }}
        </button>
        <button v-else disabled class="g-btn g-btn--link">
          {{ $t('global.overall') }}
        </button>
        <div class="list-group" group="people">
          <div
            v-for="element in list"
            :key="element.id"
            :class="{ hidden: reorderId === element.id }"
            class="list-group-item"
          >
            <span>{{ element.id }} / {{ element.name }}</span>
            <div class="controls">
              <button
                v-if="currentId && mode === 'from'"
                title="Move"
                class="g-t-btn g-t-btn--svg-black-hover"
                @click="change(element)"
              >
                <icon-move class="arrow a-rot-90" width="18" height="18" />
              </button>
              <button
                v-if="mode === 'to'"
                title="Paste into"
                class="g-t-btn g-t-btn--svg-black-hover"
                @click="change(element)"
              >
                <icon-plus class="arrow a-rot-90" width="18" height="18" />
              </button>
              <button
                class="g-t-btn g-t-btn--svg-black-hover"
                @click="loadList(element.id, 1, element.parent_id)"
              >
                <icon-arrow class="arrow a-rot-90" width="18" height="18" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="!treeData.data.length" class="nf a-tac">
          <h3>{{ $t('global.no-child') }}</h3>
        </div>

        <div class="a-tac">
          <v-pagination
            class="buttons"
            :meta="treeData.meta"
            :loading="false"
            @change="pagination"
          />
        </div>
      </v-step>
    </v-stepper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Api } from '@/api.config'

const PER_PAGE = 10

export default Vue.extend({
  props: {
    /** 'from' | 'to' */
    mode: String,
    reorderId: Number,
    relation: {
      type: Function
    }
  },
  data() {
    return {
      loadingId: null,

      mounted: false,
      currentId: null,
      currentParentId: null,
      treeData: {
        data: [],
        meta: {}
      }
    } as {
      mounted: boolean
      currentId: null | number
      currentParentId: null | number
      treeData: any
    }
  },
  computed: {
    list(): any[] {
      return (
        this.treeData.data || [{ disabled: true }].concat(this.treeData.data)
      )
    },
    rId() {
      const vm = this
      return Number(vm.$route.query['reorder-id']) || this.reorderId
    }
  },
  watch: {
    async reorderId() {
      const vm = this as any
      await vm.$nextTick()

      switch (vm.mode) {
        case 'from': {
          if (vm.reorderId) {
            vm.$refs.stepper.loading().show()
          } else {
            vm.$refs.stepper.loading().hide()
          }
          break
        }

        case 'to': {
          if (vm.reorderId) {
            vm.$refs.stepper.loading().hide()
          } else {
            vm.$refs.stepper.loading().show()
          }
          break
        }
      }
    }
  },
  mounted() {
    const vm = this
    vm.mounted = true

    if (vm.mode === 'to') {
      ;(this.$refs.stepper as any).loading().show()
    }

    const reorderId =
      vm.mode === 'from' ? Number(vm.$route.query['reorder-id']) : null

    if (reorderId) {
      vm.$emit('reorder', { id: reorderId })
    }

    vm.loadList(reorderId || vm.currentParentId)
  },
  methods: {
    refresh() {
      const vm = this
      vm.loadList(null)
    },
    loadList(id: any, page: number = 1, parentId: number | null = null) {
      const vm = this as any
      vm.$axios(
        id ? `/admin/subtopics/into/topic/${id}` : Api.admin.TOPIC_ALL,
        {
          params: {
            perPage: PER_PAGE,
            page
          }
        }
      ).then((data: any) => {
        // TODO Fix get correct parent directory
        // eslint-disable-next-line camelcase
        vm.currentParentId = data?.[0]?.parent_id || parentId
        vm.currentId = id
        if (page === 1) {
          vm.treeData = data
        } else {
          vm.treeData.data.push(...data.data)
          vm.treeData.meta = data.meta
        }
      })
    },
    pagination({ page }: any) {
      const vm = this
      vm.loadList(vm.currentId, page, vm.currentParentId)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change(element: any) {
      this.$emit('reorder', { id: element.id })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'tree-item';
</style>
