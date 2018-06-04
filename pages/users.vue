<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable>
        <v-btn slot="activator" color="primary" dark
               fixed
               bottom
               right
               fab>
          <v-icon>add</v-icon>
        </v-btn>
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="close">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field required :rules="[
              () => !!editedItem.username && editedItem.username.length >= 3 || 'Nombre de usuario debe ser mayor a 3 caracteres',
            ]"
                                v-model="editedItem.username" label="Username"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :append-icon="e3 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e3 = !e3)"
                                :type="e3 ? 'password' : 'text'" v-model="editedItem.password" required
                                :rules="[() => !!editedItem.password && editedItem.password.length >= 6 || 'Contraseña ser mayor a 6 caracteres']"
                                label="Password"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-checkbox v-model="editedItem.admin" label="Admin"></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field required :rules="[() => !!editedItem.name && editedItem.name.length <= 6 || 'Nombre debe ser mayor a 6 caracteres']"
                                v-model="editedItem.name" label="Nombre"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field required :rules="[() => !!editedItem.paternalName && editedItem.paternalName.length >= 4 || 'Apellido paterno ser mayor a 4 caracteres']"
                                v-model="editedItem.paternalName"
                                label="Apellido Paterno"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field required :rules="[() => !!editedItem.maternalName && editedItem.maternalName.length >= 5 || 'Apellido materno ser mayor a 5 caracteres']"
                                v-model="editedItem.maternalName"
                                label="Apellido Materno"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field required :rules="[rules.email]" v-model="editedItem.email"
                                label="Email"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-data-table
        :items="users"
        :loading="loading"
        :headers="columns"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.username }}</td>
          <td>
            <v-checkbox v-model="props.item.admin" disabled></v-checkbox>
          </td>
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.paternalName }}</td>
          <td class="text-xs-right">{{ props.item.maternalName }}</td>
          <td class="text-xs-right">{{ props.item.email }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
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
    middleware: 'noAuthenticated',
    mounted() {
      this.$axios.setToken(this.$store.state.auth, 'Bearer')
      this.getusers()
    },
    data() {
      return {
        selected: undefined,
        loading: false,
        errorMessages: [],
        columns: [
          {
            value: "id",
            text: "Id",
          },
          {
            value: "username",
            text: "Nombre de usuario"
          },
          {
            value: "admin",
            text: "Admin"
          },
          {
            value: "name",
            text: "Nombre"
          },
          {
            value: "paternalName",
            text: "Apellido Paterno"
          },
          {
            value: "maternalName",
            text: "Apellido Materno"
          },
          {
            value: "email",
            text: "email"
          }
        ],
        users: undefined,
        editedIndex: -1,
        editedItem: {
          id: 0,
          username: '',
          password: '',
          admin: false,
          name: '',
          paternalName: '',
          maternalName: '',
          email: ''
        },
        formHasErrors: false,
        defaultItem: {
          id: 0,
          username: '',
          password: '',
          admin: false,
          name: '',
          paternalName: '',
          maternalName: '',
          email: ''
        },
        dialog: false,
        e3: true,
        rules: {
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
      }
    },
    watch: {
      dialog(val) {
        val || this.close()
      }
    },
    methods: {
      close() {
        this.dialog = false
        this.editedIndex = -1
        this.editedItem = Object.assign({}, this.defaultItem)
      },
      editItem(item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        const index = item.id
        confirm('Are you sure you want to delete this item?')
        this.$axios.delete('/ventas/api/users/' + index).then(result => {
          this.getusers()
        }).catch(error => {
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
          } else {
            this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
          }
        })
      },
      save() {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })
        this.loading = true
        if (this.editedIndex == -1) {
          this.$axios.post('/ventas/api/users', this.editedItem).then(result => {
            this.getusers()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
            } else {
              this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
            }
          })
        } else {
          this.$axios.put('/ventas/api/users', this.editedItem).then(result => {
            this.getusers()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
            } else {
              this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
            }
          })
        }
        this.close()
      },
      getusers() {
        this.loading = true
        this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
        this.$axios.get('/ventas/api/users').then(result => {
          this.users = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            if (error.response.status == 401) {
              this.$store.commit('update', null)
              this.$router.push('/')
            }
            else {
              this.alert = {
                type: 'error',
                message: error.response.data.message || error.response.status
              }
            }
          }
        })
      }
    }
  }
</script>
