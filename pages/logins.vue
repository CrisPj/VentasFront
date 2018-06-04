<template>
<v-layout>
    <v-flex text-xs-center>
        <v-data-table
        :items="tokens"
        :loading="loading"
        :headers="columns"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.username }}</td>
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
</v-layout>
</template>

<script>
export default {
    mounted()
    {
        this.getTokens();
    },
    data() {
        return {
            tokens: [],
            loading: false,
            columns: [
        {
          value: "id",
          text: "Id",
        },
        {
          value: "username",
          text: "Usuario"
        },
        {
          value: "name",
          text: "nombre"
        }
      ],
        }
    },
    methods: {
        deleteItem (item) {
      confirm('Are you sure you want to delete this item?')
      this.$axios.delete('/ventas/api/login/token',{data: {
          id: item.id,
	      token: item.token
      }}).then(result => {
        this.getTokens()
      }).catch(error => {
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
    },
        getTokens(){
            this.loading = true
      this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
      this.$axios.get('/ventas/api/login').then(result => {
        this.tokens = result.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
           if (error.response.status == 401)
            {
              this.$store.commit('update', null)
              this.$router.push('/')
            }
            else {
              this.alert = {
              type: 'error',
              message: error.response.data.message || error.response.status
              }
            }
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
        }
    }
}
</script>

