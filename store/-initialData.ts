import { ActionTree } from 'vuex'
import { RootState } from '@/store'
const cookieparser = process.server ? require('cookieparser') : undefined

export const initialData: ActionTree<RootState, RootState> = {
  async authentication({ dispatch }, { req, res }) {
    const parsed = cookieparser.parse(req.headers.cookie || '')
    try {
      if (!parsed[`${process.env.COOKIE_PREFIX}access_token`]) {
        /** Will auth as temp user */
        throw new Error('NOT_AUTH')
      }

      this.$axios.setToken(
        parsed[`${process.env.COOKIE_PREFIX}access_token`],
        'Bearer'
      )
      await dispatch('auth/me')
      // eslint-disable-next-line no-console
      console.info('LOGGED')
    } catch (err) {
      try {
        // eslint-disable-next-line no-console
        console.info('NO_LOGGED')
        await dispatch('auth/createTempUser').then((data) => {
          Object.keys(data).forEach((key) => {
            res.cookie(`${process.env.COOKIE_PREFIX}${key}`, data[key])
          })
        })
        // eslint-disable-next-line no-console
        console.info('SUCCESS_TEMP_USER')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.info('UNSUCCESS_TEMP_USER')
      }
    }
  }
}
