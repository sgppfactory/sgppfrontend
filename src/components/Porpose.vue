<template>
  <div>
    <app-menu></app-menu>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row>
        <b-col sm="10">
          <b-form inline @submit="search">
            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchPerson" placeholder="Buscar propuestas o proyectos" v-model="searchParam" />
          </b-form>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addporpose">
            <icon name="plus" height="10" /> Nueva Propuesta
          </b-button>
        </b-col>
      </b-row>
      <b-table striped hover show-empty 
        :items="porposeprojects" 
        :fields="fields" 
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc" >
        <template slot="HEAD_actions">
          Opciones
        </template>
        <template slot="actions" slot-scope="row">
          <router-link :to="{ name: 'addporpose', query: { personId: row.item.id }}" v-b-tooltip.hover title="Modificar Propuesta / Proyecto"> 
            <icon name="edit" />
          </router-link>
          <!-- v-bind="row.detailsShowing"  -->
          <a @click.stop="row.toggleDetails" v-b-tooltip.hover title="Más información">
            <icon name="info" />
          </a>
          <a @click="toRemove=row.item.id" v-b-tooltip.hover title="Borrar Propuesta / Proyecto" v-b-modal.deleteModal class="danger">
            <icon name="remove" />
          </a>
        </template>
        <template slot="empty">¡Sin propuestas o proyectos para mostrar!</template>
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
          <b-pagination-nav :link-gen="getLinkPag" 
                  :number-of-pages="cantPages" 
                  v-model="currentPage" />
        </b-col>
        <b-col sm="3" align="center">Registros: {{cantResults}}</b-col>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
    </b-container>
    <b-modal id="deleteModal" v-model="show" title="Eliminar Propuesta">
      <p class="my-2">¿Está seguro que desea realizar la siguiente acción?</p>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deleteporpose()">
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
import porpose from '../apiClients/porpose'
import Menu from '@/components/Menu'
export default {
  name: 'PorposesProjects',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Propuestas y Proyectos',
      porposeprojects: [],
      fields: [
        {label: 'Título', key: 'title', sortable: true},
        {label: 'Nodo', key: 'id_node', sortable: true},
        {label: 'Etapa', key: 'id_stage', sortable: true},
        {label: 'Estado', key: 'state'},
        {label: 'Ciclo', key: 'id_cicle'},
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
  beforeRouteUpdate (to, from, next) {
    this.search(to.query.page)
    next()
  },
  created () {
    this.search(this.$route.query.page)
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('/login')
    },
    getLinkPag (page) {
      return '#/porpose?page=' + page
    },
    search (page) {
      var loader = this.$loading.show()

      var params = this.searchParam ? {
        filter: [
          {key: 'title', value: this.searchParam, operator: 'like', operator_sup: 'OR'},
          {key: 'state', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      if (page) {
        params.page = page
      }
      // Muestro de a 10 registros...
      params.bypage = 5

      porpose.getFilter(params)
        .then((result) => {
          loader.hide()
          this.porposeprojects = (result.status === 200)
          ? result.data.result
          : []

          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(result)
        })
    },
    deleteporpose () {
      var loader = this.$loading.show()
      porpose.remove(this.toRemove)
        .then((result) => {
          // console.log(result)
          if (result.status === 200) {
            this.toRemove = 0
            this.show = false
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success',
              position: 'bottom right'
            })
            loader.hide()
            this.search(this.$route.query.page)
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(result)
        })
    },
    showDetails (id) {
      var loader = this.$loading.show()
      porpose.get(id)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.toRemove = 0
            // console.log(result)
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(result)
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
.form-inline {
  margin-bottom: 20px;
}
</style>
