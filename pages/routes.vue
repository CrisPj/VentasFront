<template>
     <v-layout>
    <v-flex text-xs-center>
     <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn @click="reload" slot="activator" color="primary"  dark
              fixed
              bottom
              right
              fab><v-icon>add</v-icon></v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Routes</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.idRoute >= 0 || 'This field is required']" required v-model="editedItem.idRoute" label="Id Routa"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
          :items="employees"
          v-model="editedItem.idEmployee"
          label="Select"
          single-line
          item-text="name"
          item-value="id"
          required
          hint="Empleado"
          persistent-hint
        > </v-select>

                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
          :items="customers2"
          v-model="editedItem.idCustomer"
          label="Select"
          single-line
          item-text="name"
          item-value="id"
          required
          hint="Cliente"
          persistent-hint
        > </v-select>
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
      <v-data-table
        :items="routes"
        :loading="loading"
        :headers="columns"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.idRoute }}</td>
          <td class="text-xs-right"><span v-if="employees.find(x =>x.id === props.item.idEmployee)">{{ employees.find(x =>x.id === props.item.idEmployee).name }}</span></td>
          <td class="text-xs-right"><span v-if="customers.find(x =>x.id === props.item.idCustomer)">{{ customers.find(x =>x.id === props.item.idCustomer).name }}</span></td>
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
    middleware: 'noAuthenticated',
    data() {
      return {
        selected: undefined,
        loading: false,
        columns: [
          {
            value: "idRoute",
            text: "IdRoute",
          },
          {
            value: "idEmployee",
            text: "Empleado"
          },
          {
            value: "idCustomer",
            text: "Cliente"
          }
        ],
        routes: [],
        editedIndex: -1,
        editedItem: {
          idRoute: 0,
    
          idEmployee: 0,
          idCustomer: 0
        },
        defaultItem: {
          idRoute: 0,
      
          idEmployee: 0,
          idCustomer: 0
        },
        dialog: false,
        alert: null,
        customers: [],
        customers2: [],
        employees: []
      }
    },
  mounted() {
    this.getRoutes()
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    close(){
      this.dialog = false
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },
     deleteItem (item) {
       console.log(item.idCustomer)
       console.log(item.idEmployee)
      confirm('Are you sure you want to delete this item?')
      this.$axios.delete('/ventas/api/users/routes',{data: {
        idEmployee: item.idEmployee,
	      idCustomer: item.idCustomer
      }}).then(result => {
        this.getRoutes()
      }).catch(error => {
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
    },
    reload(){
      this.$axios.get('/ventas/api/users/customers').then(result => {
        this.customers2 = result.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
    },
    save(){
       this.loading = true
        if (this.editedIndex == -1) {
          this.$axios.post('/ventas/api/users/routes', this.editedItem).then(result => {
            this.getRoutes()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {
                type: 'error',
                message: error.response.data.message || error.response.status
              }
            } else {
              this.alert = {
                type: 'error',
                message: 'No se pudo contactar con el servidor'
              }
            }
          })
        } else {
          this.$axios.put('/ventas/api/users/routes', this.editedItem).then(result => {
            this.getRoutes()
          }).catch(error => {
            this.loading = false
            if (error.response && error.response.data) {
              this.alert = {
                type: 'error',
                message: error.response.data.message || error.response.status
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
      editItem (item) {
        this.$axios.get('/ventas/api/users/customers').then(result => {
        this.customers2 = result.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
        this.editedIndex = this.routes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      getRoutes(){
         this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
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
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
       this.$axios.get('/ventas/api/users').then(result => {
        this.employees = result.data
        console.log(this.employees)
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
          this.$axios.get('/ventas/api/users/routes').then(result => {
        this.routes = result.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
      }
  }
}
</script>

