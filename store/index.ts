import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { initialData as iD } from './-initialData'

export const state = () => ({})
export type RootState = ReturnType<typeof state>
export const getters: GetterTree<RootState, RootState> = {}
export const mutations: MutationTree<RootState> = {}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ dispatch }) {
    await Promise.all([
      /** Auth */
      (iD.authentication as any).apply(this, arguments),
      /** Get translations / images */
      dispatch('translations/getAll')
    ])
  }
}
