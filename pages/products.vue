<template>
  <v-layout>
    <v-flex>
     <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn slot="activator" color="primary"  dark
              fixed
              bottom
              right
              fab><v-icon>add</v-icon></v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Products</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.name.length > 0 || 'This field is required']" required v-model="editedItem.name" label="Product name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.description.length > 0 || 'This field is required']" required v-model="editedItem.description" label="Description"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.price  > 0 || 'This field is required']" required v-model="editedItem.price" label="Price"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field :rules="[() => editedItem.stock > 0 || 'This field is required']" required v-model="editedItem.stock" label="Stock"></v-text-field>
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
      <h1 class="text-xs-center">Productos</h1>
      <v-data-table
        :items="products"
        :loading="loading"
        :headers="columns"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
        <template slot="items" slot-scope="props">
        
          <td class="text-xs-right">{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.description }}</td>
          <td class="text-xs-right">{{ props.item.price }}</td>
          <td class="text-xs-right">{{ props.item.stock }}</td>
          <td class="text-xs-right">{{ props.item.available }}</td>
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
    this.getProducts()
  },
  data() {
    return {
      selected: undefined,
      loading: false,
      columns: [
        {
          value: "id",
          text: "Id",
        },
        {
          value: "name",
          text: "Nombre"
        },
        {
          value: "description",
          text: "Description"
        },
        {
          value: "price",
          text: "Price"
        },
        {
          value: "stock",
          text: "Stock"
        },
        {
          value: "available",
          text: "Disponibles"
        },
      ],
      products: undefined,
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        available: 0
      },
      defaultItem: {
        id: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        available: 0
      },
      dialog: false,
      alert: null,
      customers: null
    }
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
    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = item.id
      confirm('Are you sure you want to delete this item?')
      this.$axios.delete('/ventas/api/products/' + index).then(result => {
        this.getProducts()
      }).catch(error => {
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
    },
    save() {
      this.loading = true
      if (this.editedIndex == -1)
      {
        this.$axios.post('/ventas/api/products',this.editedItem).then(result => {
          this.getProducts()
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
          } else {
            this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
          }
        })
      } else {
        this.$axios.put('/ventas/api/products',this.editedItem).then(result => {
          this.getProducts()
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
    getCustomer() {
      this.$axios.get('/ventas/api/customers').then(result => {
        this.customers = result.data
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
    getProducts() {
      this.loading = true
      this.$axios.setToken(this.$store.state.auth.token, 'Bearer')
      this.$axios.get('/ventas/api/products').then(result => {
        this.products = result.data
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
