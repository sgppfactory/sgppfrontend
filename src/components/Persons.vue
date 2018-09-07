<template>
  <div>
    <app-menu></app-menu>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row>
        <b-col sm="10">
          <b-form inline @submit="search">
            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchPerson" placeholder="Buscar personas" v-model="searchParam" />
          </b-form>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addperson">
            <icon name="plus" height="10" /> Nueva Persona
          </b-button>
        </b-col>
      </b-row>
      <b-table striped hover show-empty 
        :items="persons" 
        :fields="fields" 
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc" >
        <template slot="HEAD_actions">
          Opciones
        </template>
        <template slot="actions" slot-scope="row">
          <router-link v-bind:to="{ path: 'addperson', query: { personId: row.item.id }}" v-b-tooltip.hover title="Modificar persona"> 
            <icon name="edit" />
          </router-link>
          <!-- v-bind="row.detailsShowing"  -->
          <a @click.stop="row.toggleDetails" v-b-tooltip.hover title="Más información">
            <icon name="info" />
          </a>
          <a @click="toRemove=row.item.id" v-b-tooltip.hover title="Borrar persona" v-b-modal.deleteModal class="danger">
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
        <!-- base-url="#"  -->
          <b-pagination-nav :link-gen="getLinkPag" 
                            :number-of-pages="cantPages" 
                            v-model="currentPage" />
        </b-col>
        <b-col sm="3" align="center">Registros: {{cantResults}}</b-col>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
    </b-container>
    <!-- MODAL DELETE -->
    <b-modal id="deleteModal" v-model="show" title="Eliminar Persona">
      <p class="my-2">¿Está seguro que desea realizar la siguiente acción?</p>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deleteperson()">
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
import {formatResponse} from '../utils/tools.js'

export default {
  name: 'Persons',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Agenda de personas',
      persons: [],
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
    this.search(this.$route.query.page)
  },
  beforeRouteUpdate (to, from, next) {
    // console.log(to)
    this.search(to.query.page)
    next()
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('/login')
    },
    getLinkPag (page) {
      return '#/persons?page=' + page
    },
    search (page) {
      var loader = this.$loading.show()

      var params = this.searchParam ? {
        filter: [
          {key: 'name', value: this.searchParam, operator: 'like', operator_sup: 'OR'},
          {key: 'lastname', value: this.searchParam, operator: 'like', operator_sup: 'OR'},
          {key: 'email', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
          // {key: 'username', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      if (page) {
        params.page = page
      }
      // Muestro de a 10 registros...
      params.bypage = 5

      persons.getFilter(params)
        .then((result) => {
          loader.hide()
          this.persons = (result.status === 200)
          ? result.data.result
          : []
          // console.log(result.data)
          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch((result) => {
          loader.hide()
          this.getErrorMessage(result)
        })
    },
    deleteperson () {
      var loader = this.$loading.show()

      persons.remove(this.toRemove)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.toRemove = 0
            this.show = false
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
            })
            this.search(this.$route.query.page)
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    showDetails (id) {
      var loader = this.$loading.show()

      persons.get(id)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.toRemove = 0
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    getErrorMessage (result) {
      formatResponse(result, (err) => {
        if (err === 'logout') {
          this.logout()
        } else {
          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: err,
            type: 'error',
            position: 'bottom right'
          })
        }
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
