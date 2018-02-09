<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <b-container fluid>
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
      <b-table striped hover show-empty 
        :items="persons" 
        :fields="fields" 
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc" >
        <template slot="HEAD_actions">
          Opciones
        </template>
        <template slot="actions" slot-scope="row">
          <!-- We use click.stop here to prevent 'sort-changed' or 'head-clicked' events -->
          <!-- <input @click.stop type="checkbox" :value="foo.column" v-model="selected"> -->
          <!-- We use click.native.stop here to prevent 'sort-changed' or 'head-clicked' events -->
          <!-- <b-form-checkbox @click.native.stop :value="foo.column" v-model="selected" /> -->
          <router-link :to="{ name: 'modperson', params: { personId: row.id }}" v-b-tooltip.hover title="Modificar persona"> 
            <icon name="edit" />
          </router-link>
          <!-- v-bind="row.detailsShowing"  -->
          <a @click.stop="row.toggleDetails" v-b-tooltip.hover title="Más información">
            <icon name="info" />
          </a>
          <a @click="toRemove=row.id" v-b-tooltip.hover title="Borrar persona" v-b-modal.deleteModal class="danger">
            <icon name="remove" />
          </a>
        </template>
        <template slot="empty">¡Sin personas para mostrar!</template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
            </ul>
          </b-card>
        </template>
      </b-table>
      <b-row>
        <b-col sm="9">
          <b-pagination-nav :link-gen="search" base-url="#" :number-of-pages="cantPages" v-model="currentPage" />
        </b-col>
        <b-col sm="3" align="center">Registros: {{cantResults}}</b-col>
      </b-row>
    </b-container>
  <b-modal id="deleteModal" v-model="show" title="Eliminar Persona">
    <p class="my-2">¿Está seguro que desea realizar la siguiente acción?</p>
    <div slot="modal-footer" class="w-100 text-right">
     <b-btn size="sm" variant="danger" @click="deleteperson(this)">
       Eliminar
     </b-btn>
     <b-btn size="sm" variant="primary" @click="show=false">
       Cancelar
     </b-btn>
   </div>
  </b-modal>
  </div>
  <!-- </div> -->
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
        {label: 'Nombre', key: 'name', sortable: true},
        {label: 'Apellido', key: 'lastname', sortable: true},
        {label: 'Email', key: 'email', sortable: true},
        {label: 'Teléfono', key: 'tel'},
        {label: 'Usuario', key: 'username'},
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      currentPage: 1,
      searchParam: '',
      cantPages: 1,
      cantResults: 1,
      show: false,
      toRemove: 0,
      isBusy: false,
      sortBy: 'name',
      sortDesc: false
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
      persons.remove(this.toRemove)
      .then((result) => {
        if (result.status === 200) {
          this.toRemove = 0
          console.log(result)
        } else {

        }
      }).catch((error) => {
        console.log(error)
        // this.logout()
      })
    },
    showDetails (id) {
      console.log(id)
      persons.get(id)
      .then((result) => {
        if (result.status === 200) {
          this.toRemove = 0
          console.log(result)
        } else {

        }
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
a:not(.btn) {
  color: #42b983;
  cursor: pointer;
}
.form-inline {
  margin-bottom: 20px;
}
.form-inline-right {
  margin-left: 55%;
}
</style>
