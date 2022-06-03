<template>
  <div v-if="checkTypeSelected" class="list-box">
    <h3 class="list-box__title">{{ $t('search.groups') }}</h3>
    <ul>
      <GroupItem
        v-for="(item, index) in groupData.data"
        :key="index"
        :item="item"
      ></GroupItem>
    </ul>
    <div v-if="!groupData.data.length" class="list-box__no-data">
      {{ $t('search.no-data') }}
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapGetters, mapState } from 'vuex'
import GroupItem from '@/components/group/group-list/item/item'
export default {
  components: {
    GroupItem
  },
  computed: {
    ...mapState('search', ['groupData', 'modForType', 'selectedTypeValue']),
    checkTypeSelected() {
      return !this.modForType
        ? true
        : this.selectedTypeValue.some(
            ({ id }) => id === 'groupData_type_selector'
          )
    }
  }
}
</script>

<style lang="scss" scoped>
@import './group-list.scss';
</style>
