<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login</v-toolbar-title>

        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
            <v-text-field prepend-icon="person" label="Username" v-model="username" />
            <v-text-field prepend-icon="lock" label="Password" v-model="password" type="password" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" @click="submit" :loading="loading" :disabled="loading">Log In</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    middleware: 'authenticated',
    data() {
      return {
        username: '',
        password: '',
        alert: null,
        loading: false
      }
    },
    methods: {
      submit() {
        this.alert = null
        this.loading = true
        this.$axios.post('/ventas/api/login', {
          username: this.username,
          password: this.password
        }).then(result => {
          this.alert = {
            type: 'success',
            message: 'logeado'
          }
          this.loading = false
          console.log(result)
          const auth = result.data
          this.$store.commit('update', auth)
          this.$axios.setToken(result.data.token, 'Bearer')
          Cookie.set('auth', auth)
          this.$router.push('/admin')
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {
              type: 'error',
              message: error.response.data.message || error.response.status
            }
          }
        })
      }
    }
  }
</script>
