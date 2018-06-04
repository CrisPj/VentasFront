<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="accent" dark fixed bottom right fab>
          <v-icon>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Clientes</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.name.length > 0 || 'This field is required']" required v-model="editedItem.name" label="Nombre del cliente"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.phone.length > 0 || 'This field is required']" required v-model="editedItem.phone" label="Telefono"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[rules.email]" required v-model="editedItem.email" label="email"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table :items="customers" :loading="loading" :headers="columns" :value="selected" hide-actions class="elevation-1" focusable>
        <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.phone }}</td>
                <td class="text-xs-right">{{ props.item.email }}</td>
                <td class="text-xs-right"><a :href="`https://www.openstreetmap.org/?mlat=${props.item.latlong.x}&mlon=${props.item.latlong.y}#map=17/${props.item.latlong.x}/${props.item.latlong.y}`"><v-icon>map</v-icon></a></td>
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
       this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
      this.getcustomers()
    },
    data() {
      return {
        selected: undefined,
        loading: false,
        columns: [{
            value: "id",
            text: "Id",
          },
          {
            value: "name",
            text: "Nombre"
          },
          {
            value: "phone",
            text: "Phone"
          },
          {
            value: "email",
            text: "Email"
          },
          {
            value: 'latlng',
            text: "Mapa"
          }
        ],
        customers: undefined,
        editedIndex: -1,
        editedItem: {
          id: 0,
          name: '',
          phone: '',
          email: '',
          latlong: null
        },
        defaultItem: {
          id: 0,
          name: '',
          phone: '',
          email: '',
          latlong: null
        },
        dialog: false,
        alert: null,
        rules: {
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'E-mail invalido.'
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
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        const index = item.id
        confirm('Are you sure you want to delete this item?')
        this.$axios.delete('/ventas/api/customers/' + index).then(result => {
          this.getcustomers()
        }).catch(error => {
          if (error.response && error.response.data) {
            this.alert = {
              type: 'error',
              message: error.response.data.message || error.reponse.status
            }
          } else {
            this.alert = {
              type: 'error',
              message: 'No se pudo contactar con el servidor'
            }
          }
        })
      },
      save() {
        this.loading = true
        if (this.editedIndex == -1) {
          this.$axios.post('/ventas/api/customers', this.editedItem).then(result => {
            this.getcustomers()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {
                type: 'error',
                message: error.response.data.message || error.reponse.status
              }
            } else {
              this.alert = {
                type: 'error',
                message: 'No se pudo contactar con el servidor'
              }
            }
          })
        } else {
          this.$axios.put('/ventas/api/customers', this.editedItem).then(result => {
            this.getcustomers()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {
                type: 'error',
                message: error.response.data.message || error.reponse.status
              }
            } else {
              this.alert = {
                type: 'error',
                message: 'No se pudo contactar con el servidor'
              }
            }
          })
        }
  this.close()
      },
      getcustomers() {
        this.loading = true
        this.$axios.get('/ventas/api/customers').then(result => {
          this.customers = result.data
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
            this.alert = {
              type: 'error',
              message: 'No se pudo contactar con el servidor'
            }
          }
        })
      }
    }
  }
</script>
