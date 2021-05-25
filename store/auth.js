export const state = () => ({
  accessToken: null,
  userData: null
});

export const mutations = {
  SET_USER_DATA(state, payload) {
    state.userData = payload;
  },
  SET_ACCESS_TOKEN(state, payload) {
    state.accessToken = payload;
  }
};

export const getters = {
  isAuthenticated(state) {
    return !!state.accessToken;
  }
};
