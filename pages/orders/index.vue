<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn slot="activator" color="primary" dark fixed bottom right fab>
          <v-icon>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Orders</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                 <v-flex>
  <v-select
          :items="customers"
          v-model="editedItem.customerId"
          label="Select"
          single-line
          item-text="name"
          item-value="id"
          required
        >

        </v-select>
                  <v-data-table
        :items="products"
        :loading="loading"
        :headers="columns2"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.price }}</td>
          <td class="text-xs-right">{{ props.item.stock }}</td>
          <td class="text-xs-right">
            <v-btn @click="restar(props.item)" icon ripple>
              <v-icon color="accent">remove</v-icon>
            </v-btn>{{ props.item.quantity }}
            <v-btn @click="sumar(props.item)" icon ripple>
              <v-icon color="accent">add</v-icon>
            </v-btn></td>

        </template>
        
      </v-data-table>

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
      <h1 class="text-xs-center">Ordenes</h1>
      <v-data-table
        :items="orders"
        :loading="loading"
        :headers="columns"
        :value="selected"
        hide-actions
        class="elevation-1"
        focusable>
<template slot="items" slot-scope="props">
  <td>
    {{ props.item.orderId }}</td>
  <td class="text-xs-right">{{ props.item.customerId}}</td>
  <td class="text-xs-right"><v-checkbox v-model="props.item.status" disabled> </v-checkbox></td>
  <td class="text-xs-right">{{ props.item.productList.length }}</td>
  <td class="text-xs-right">{{ props.item.orderdate.dayOfMonth + '/' + props.item.orderdate.monthValue + '/' + props.item.orderdate.year}} </td>
  <td class="text-xs-right" v-if="props.item.completeddate">{{ props.item.completeddate.dayOfMonth + '/' + props.item.completeddate.monthValue + '/' + props.item.completeddate.year}} </td>
  <td class="text-xs-right" v-else>-</td>
  <td class="justify-center layout px-0">
    <v-btn v-if="props.item.status == false" icon class="mx-0" @click="complete(props.item)">
      <v-icon color="teal">check</v-icon>
    </v-btn>
    <v-btn v-if="props.item.status == false" icon class="mx-0" @click="editItem(props.item)">
      <v-icon color="teal">edit</v-icon>
    </v-btn>
    <v-btn v-if="props.item.status == false" icon class="mx-0" @click="deleteItem(props.item)">
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
       this.getorders()
    },
    data() {
      return {
        selected: undefined,
        loading: false,
        products: undefined,
        customers: [],
        columns: [{
            value: "id",
            text: "Id",
          },
          {
            value: "customerid",
            text: "Cliente"
          },
          {
            value: "status",
            text: "Completado"
          },
          {
            value: "numprods",
            text: "Numero de productos"
          },
          {
            value: "OrderDate",
            text: "Fecha Orden"
          }
          ,
          {
            value: "completedDate",
            text: "Fecha Completada"
          }
        ],
        columns2: [{
            value: "id",
            text: "Id",
          },
          {
            value: "name",
            text: "Nombre"
          },
          {
            value: "price",
            text: "Precio"
          },
          {
            value: "stock",
            text: "En stock"
          },
          {
            value: "quantity",
            text: "Cantidad"
          }
        ],
        orders: undefined,
        formHasErrors: false,
        editedIndex: -1,
        editedItem: {
          orderId: 0,
          customerId: 0,
          status: false,
          productList: [],
        },
        defaultItem: {
          orderId: 0,
          customerId: 0,
          status: false,
          productList: [],
        },
        dialog: false,
        select:  [],
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
      this.$axios.get('/ventas/api/products/').then(result => {
          this.products = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.$toast.open({
              duration: 5000,
              message: error.response.data.message || error.reponse.status,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
      },
      sumar(item) {
        if(item.quantity < item.stock)
        item.quantity = item.quantity + 1;
      },
      restar(item) {
if(item.quantity > 0)
        item.quantity = item.quantity - 1;

      },
      editItem(item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.$axios.get('/ventas/api/orders/products/'+item.orderId).then(result => {
          this.products = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.$toast.open({
              duration: 5000,
              message: error.response.data.message || error.reponse.status,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
      },
      complete(item) {
        item.status = true
        var newitem = Object.assign({}, item);
        delete newitem.orderdate
        this.$axios.put('/ventas/api/orders',newitem).then(result => {
          this.getorders()
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.response.status}
          } else {
            this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
          }
        })
      },
      deleteItem(item) {
        const index = item.orderId
        console.log(item)
        confirm('Are you sure you want to delete this item?')
         this.$axios.delete('/ventas/api/orders/' + index).then(result => {
        this.getorders()
      }).catch(error => {
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        } else {
          this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
        }
      })
      },
      save() {
        
        if (this.editedIndex > -1) {
          this.orders[this.editedIndex].productList = this.products
          this.orders[this.editedIndex].customerId = this.editedItem.customerId
          var newitem = Object.assign({}, this.orders[this.editedIndex]);
          delete newitem.orderdate
          this.$axios.put('/ventas/api/orders',newitem).then(result => {
          this.getorders()
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.response.status}
          } else {
            this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
          }
        })
        } else {
         this.editedItem.productList = this.products
          this.editedItem.employeeId = this.$store.state.auth.id
          var newitem = Object.assign({}, this.editedItem);
          delete newitem.orderdate
          this.$axios.post('/ventas/api/orders',newitem).then(result => {
          this.getorders()
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.response.status}
          } else {
            this.alert = {type: 'error', message: 'No se pudo contactar con el servidor'}
          }
        })
        }
        this.close()
      },
      getorders() {
        this.loading = true
         this.$axios.get('/ventas/api/customers').then(result => {
          this.customers = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.$toast.open({
              duration: 5000,
              message: error.response.data.message || error.reponse.status,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
         this.$axios.get('/ventas/api/products/').then(result => {
          this.products = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.$toast.open({
              duration: 5000,
              message: error.response.data.message || error.reponse.status,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
        this.$axios.get('/ventas/api/orders').then(result => {
          this.orders = result.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          if (error.response && error.response.data) {
            this.$toast.open({
              duration: 5000,
              message: error.response.data.message || error.reponse.status,
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
      }
    }
  }
</script>
