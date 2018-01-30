<template>
  <div class="hello">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">SGPP</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav v-for="item in menu" :key="item.id">
          <b-nav-item :to="item.url">{{item.label}}</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{username}}</em>
            </template>
            <b-dropdown-item v-for="itemU in menuUser" :key="itemU.id" :to="itemU.url">
              {{itemU.label}}
            </b-dropdown-item>
            <b-dropdown-item @click="logout()">Salir</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import menu from '../apiClients/menu'
import auth from '../apiClients/auth'
import _ from 'underscore'
export default {
  name: 'Menu',
  data () {
    return {
      username: 'Pepito',
      menu: [],
      menuUser: []
    }
  },
  created () {
    menu.get()
      .then((result) => {
        if (result.status === 200) {
          let actions = JSON.parse(result.data.result)
          this.menu = _.filter(actions, (item) => {
            return item.level === 1 && item.menu
          })

          this.menuUser = _.filter(actions, (item) => {
            return item.level === 2 & item.menu
          })
        } else {
          this.logout()
        }
      }).catch((error) => {
        if (error.response) {
          this.logout()
        }
      })

    auth.getUser()
      .then((result) => {
        if (result.status === 200) {
          let userData = JSON.parse(result.data.result)
          if (userData.username) {
            this.username = userData.username
          }
        } else {
          this.logout()
        }
      }).catch(() => {
        this.logout()
        // if (error.status == 409) {
        // }
      })
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
