<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      <h1>{{ title }}</h1>
      <b-form inline @submit="search">
        <div class="form-inline-left">
          <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchPerson" placeholder="Buscar personas" v-model="searchParam" />
          <b-button variant="primary">buscar</b-button>
        </div>
        <div class="form-inline-right">
          <b-button variant="primary" class="">Nueva Persona</b-button>
        </div>
      </b-form>
      <b-table striped hover :items="persons" :fields="fields"></b-table>
      <div class="row">
        <div class="mt-8">
          <b-pagination-nav base-url="#" :number-of-pages="10" v-model="currentPage" />
        </div>
        <!-- <b-pagination-nav :link-gen="linkGen" :number-of-pages="10" v-model="currentPage" /> -->
        <div class="mt-4">Página actual: {{currentPage}}</div>
      </div>
    </div>
  </div>
</template>

<script>
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
        {label: 'Usuario', key: 'username'}
      ],
      currentPage: 1,
      searchParam: ''
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
    search (ev) {
      var params = this.searchParam ? { 
        // var params = { 
        filter: [
          {key: 'name', value: 'fsoto', operator: 'like', operator_sup: 'OR'},
          {key: 'lastname', value: this.searchParam, operator: 'like', operator_sup: 'OR'},
          {key: 'email', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
          // {key: 'username', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      persons.getFilter(params)
      .then((result) => {
        this.persons = (result.status === 200)
        ? result.data.result
        : []
      }).catch((error) => {
        console.log(error)
        // this.logout()
      })
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
}
.form-inline {
  margin-bottom: 20px;
}
.form-inline-right {
  margin-left: 60%;
}
</style>
