<template>
  <v-app>
    <v-navigation-drawer fixed temporary v-model="drawer" app>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              <span>Menu</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in menuItems" exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark app>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
      <v-btn v-if="this.$store.state.auth" @click="onLogout" flat>
        <span>Logout</span>
         <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
          <nuxt />
          </v-container>
    </v-content>
    <v-footer color="primary" dark app>
      <span class="white--text text-xs-center">CrisPJ&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    computed: {
      menuItems() {
        let menuItems = [{
          icon: 'home',
          title: 'Index',
          to: '/'
        }, ]
        if (this.$store.state.auth)
        {
        if (this.$store.state.auth.admin) {
          menuItems = [{
              icon: 'bubble_chart',
              title: 'Admin',
              to: '/admin'
            },
            {
              icon: 'bubble_chart',
              title: 'Productos',
              to: '/products'
            },
            {
              icon: 'map',
              title: 'Rutas',
              to: '/routes'
            },
            {
              icon: 'bubble_chart',
              title: 'Ordenes',
              to: '/orders'
            },
            {
              icon: 'person',
              title: 'Usuarios',
              to: '/users'
            },
            {
              icon: 'bubble_chart',
              title: 'Clientes',
              to: '/customers'
            },
            {
              icon: 'bubble_chart',
              title: 'Logins',
              to: '/logins'
            },
            {
              icon: 'bubble_chart',
              title: 'FCM',
              to: '/fcm'
            }
          ]
        }
        else {
          menuItems = [{
              icon: 'bubble_chart',
              title: 'Admin',
              to: '/admin'
            },
            {
              icon: 'bubble_chart',
              title: 'Productos',
              to: '/products'
            },
            {
              icon: 'map',
              title: 'Rutas',
              to: '/routes'
            },
            {
              icon: 'bubble_chart',
              title: 'Ordenes',
              to: '/orders'
            },
            {
              icon: 'bubble_chart',
              title: 'Clientes',
              to: '/customers'
            },
          ]
        }
      }
        return menuItems
      }
    },
    methods: {
      onLogout() {
        this.$store.commit('update', null)
        this.$router.push('/')
      }
    },
    data() {
      return {
        clipped: true,
        drawer: false,
        fixed: false,
        items: undefined,
        title: 'Donapp'
      }
    }
  }
</script>
