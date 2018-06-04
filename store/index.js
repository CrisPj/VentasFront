import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
  auth: null
})
export const mutations = {
  update (state, data) {
    state.auth = data
  }
}

export const actions = {

}

export const plugins = [
  createPersistedState()
]