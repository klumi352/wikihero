import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt as mtAuth } from '@/store/auth'

export default Vue.extend({
  props: {
    isVotes: Boolean,
    forceOpen: Boolean,
    underLimit: Boolean,
    it: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      limitTipPercent: process.env.LIMIT_TIP_PERCENT || 10,
      currTypeVote: null,
      load1: false,
      load2: false,
      load3: false
    }
  },
  computed: {
    checkVote() {
      return this.currTypeVote && !this.it.type_vote
    },
    typeVote() {
      return this.currTypeVote || this.it.type_vote
    },
    ...mapState('tip', ['globalIsWorked', 'globalFilterType']),
    ...mapGetters('auth', ['loggedIn', 'isAdmin'])
  },
  mounted() {
    this.$emit('onmount')
  },
  methods: {
    computeCount(type) {
      const vm = this
      const cw = vm.it[`count_${type}`]
      const isInitial = this.it.type_vote === type
      const is = vm.typeVote === type
      if (isInitial && !is) return cw - 1
      return isInitial ? cw : is ? cw + 1 : cw
    },
    toValidation(num) {
      const vm = this
      let tempVote

      this.$analytic.trackers['validate-tip']()
      const worked = (() => {
        switch (num) {
          case 1:
            tempVote = 'worked'
            return 1
          case 2:
            tempVote = 'not_worked'
            return 0
          case 3:
            tempVote = 'not_sure'
            return null
        }
      })()

      this.$data[`load${num}`] = true
      this.$axios
        .post(Api.client.TIP_VALIDATION, {
          tip_id: this.it.id,
          worked
        })
        .then(({ data }) => {
          this.$store.commit(`auth/${mtAuth.SET_USER_LEVEL}`, data.points)

          if (!this.typeVote) {
            this.$root.$emit('show-modal', {
              name: 'validating-tip',
              data: this.it.id
            })
          }
          vm.currTypeVote = tempVote
        })
        .finally(() => {
          this.$data[`load${num}`] = false
        })
    }
  }
})
