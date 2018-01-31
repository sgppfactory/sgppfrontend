<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      <h1>{{ title }}</h1>
      <b-form inline @submit="search">
        <b-col sm="10">
          <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchPerson" placeholder="Buscar personas" v-model="searchParam" />
          <b-button variant="primary"><icon name="search" /> Buscar</b-button>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addperson"><icon name="plus" /> Nueva Persona</b-button>
        </b-col>
      </b-form>
      <b-table striped hover :items="persons" :fields="fields" :key="person">
        <template slot="HEAD_actions">
          Opciones
        </template>
        <template slot="actions" slot-scope="person">
          <!-- We use click.stop here to prevent 'sort-changed' or 'head-clicked' events -->
          <!-- <input @click.stop type="checkbox" :value="foo.column" v-model="selected"> -->
          <!-- We use click.native.stop here to prevent 'sort-changed' or 'head-clicked' events -->
          <!-- <b-form-checkbox @click.native.stop :value="foo.column" v-model="selected" /> -->
          <router-link :to="{ name: 'modperson', params: { personId: person.id }}" title="Modificar persona"> 
            <icon name="edit" />
          </router-link>
          <a @click="deleteperson( person.id )" title="Borrar persona">
            <icon name="remove" />
          </a>
        </template>
      </b-table>
      <b-row>
        <b-col sm="9">
          <b-pagination-nav :link-gen="search" base-url="#" :number-of-pages="cantPages" v-model="currentPage" />
        </b-col>
        <b-col sm="3" align="center">Registros: {{cantResults}}</b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons'
import persons from '../apiClients/persons'
import Menu from '@/components/Menu'
export default {
  name: 'Persons',
  data () {
    return {
      title: 'Agenda de personas',
      persons: [],
      menuComponent: undefined,
      fields: [
        {label: 'Nombre', key: 'name'},
        {label: 'Apellido', key: 'lastname'},
        {label: 'Email', key: 'email'},
        {label: 'Teléfono', key: 'tel'},
        {label: 'Usuario', key: 'username'},
        {label: 'Opciones', key: 'actions'}
      ],
      currentPage: 1,
      searchParam: '',
      cantPages: 1,
      cantResults: 1
    }
  },
  computed: {
    resultNegative: () => {
      return this.cantResults === 0
    }
  },
  created () {
    this.menuComponent = Menu
    this.search()
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    search (page) {
      var params = this.searchParam ? {
        filter: [
          {key: 'name', value: 'fsoto', operator: 'like', operator_sup: 'OR'},
          {key: 'lastname', value: this.searchParam, operator: 'like', operator_sup: 'OR'},
          {key: 'email', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
          // {key: 'username', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      if (page) {
        params.page = page
      }

      persons.getFilter(params)
      .then((result) => {
        this.persons = (result.status === 200)
        ? result.data.result
        : []

        this.cantPages = result.data.pages
        this.cantResults = result.data.total
      }).catch((error) => {
        console.log(error)
        // this.logout()
      })
    },
    deleteperson (id) {
      console.log(id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin: 15px 0;
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
  cursor: pointer;
}
button a {
  color: #000000;
}
.form-inline {
  margin-bottom: 20px;
}
.form-inline-right {
  margin-left: 55%;
}
</style>
