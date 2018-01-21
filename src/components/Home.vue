<template>
  <div class="hello">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">SGPP</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav v-for="item in menuPrincipal">
          <b-nav-item :to="item.url">{{item.label}}</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown> -->

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{username}}</em>
            </template>
            <b-dropdown-item to="userconfig">Configuración</b-dropdown-item>
            <b-dropdown-item to="login">Salir</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <div class="container">
      <h1>{{ msg }}</h1>
    </div>
  </div>
</template>

<script>
import menu from '../apiClients/menu'
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Al toke perro!',
      username: 'Pepito',
      menu: []
    }
  },
  computed: {
    menuPrincipal: () => {
      var _this = this
      menu.get()
        .then((data) => {
          _this.menu = data
        })

      return this.menu
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
