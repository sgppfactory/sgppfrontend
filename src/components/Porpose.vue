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
          <router-link :to="{ name: 'addporpose', query: { porposeId: row.item.id }}" 
                        v-b-tooltip.hover 
                        title="Modificar Propuesta / Proyecto"> 
            <icon name="edit" />
          </router-link>
          <!-- v-bind="row.detailsShowing"  -->
          <a @click.stop="row.toggleDetails" v-b-tooltip.hover title="Más información">
            <icon name="info" />
          </a>
          <a @click="toChange=row.item.id" v-b-tooltip.hover title="Cambiar Estado" v-b-modal.changeState>
            <icon name="level-up" />
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
    <b-modal id="changeState" v-model="showChangeState" title="Cambiar estado de la Propuesta / Proyecto">
      <p class="my-2">La propuesta cambia de estado a:</p>
      <b-form-select  id="state" 
                      placeholder="Seleccionar un estado" 
                      v-model="stateSelect" 
                      :options="optionsNodes">
      </b-form-select>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="changeState">
         Cambiar
       </b-btn>
       <b-btn size="sm" variant="primary" @click="showChangeState=false">
         Cancelar
       </b-btn>
     </div>
    </b-modal>
  </div>
  <!-- </div> -->
</template>

<script>
import 'vue-awesome/icons'
import porpose from '@/apiClients/porpose'
import Menu from '@/components/Menu'
import {formatResponse} from '../utils/tools.js'
import _ from 'underscore'
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
        {
          label: 'Nodo',
          key: 'node',
          formatter: (value) => {
            return value ? value.name : ''
          }
        },
        {
          label: 'Tipo',
          key: 'type',
          formatter: (value) => {
            return value === 2 ? 'Proyecto' : 'Propuesta'
          }
        },
        {
          label: 'Etapa',
          key: 'stage',
          formatter: (value) => {
            return value ? value.name : ''
          }
        },
        {
          label: 'Creación',
          key: 'created_at',
          sortable: true,
          formatter: (value) => {
            if (value) {
              let dateP = new Date(value)
              return dateP.getDate() + '/' + (dateP.getMonth() + 1) + '/' + dateP.getFullYear()
            }
            return ''
          }
        },
        {label: 'Estado', key: 'state'},
        {
          label: 'Ciclo',
          key: 'cicle',
          formatter: (value) => {
            return value ? value.date : ''
          }
        },
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      currentPage: 1,
      searchParam: '',
      cantPages: 1,
      cantResults: 1,
      showChangeState: false,
      toChange: 0,
      isBusy: false,
      sortBy: 'title',
      sortDesc: false,
      optionsNodes: [],
      stateSelect: ''
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
      return '#/porposes_projects?page=' + page
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
          // console.log(JSON.parse(result.data.result))
          loader.hide()
          this.porposeprojects = (result.status === 200)
            ? _.map(
                result.data.result,
                (porpose) => {
                  return porpose.type === 2 ? _.extend(porpose, { _rowVariant : 'success' }) : porpose
                }
              )
            : []

          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch((error) => {
          console.log(error)
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    showDetails (id) {
      var loader = this.$loading.show()
      porpose.get(id)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.toRemove = 0
            this.showSuccessMsg(result)
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
    },
    changeState () {
      var loader = this.$loading.show()
      porpose
        .changeState(this.toChange, this.showChangeState)
        .then((result) => {
          loader.hide()
          this.showChangeState = false
          this.showSuccessMsg(result)
        }).catch((err) => {
          loader.hide()
          this.getErrorMessage(err)
        })
    },
    showSuccessMsg (result) {
      this.$notify({
        group: 'success',
        title: 'Ok!',
        text: result.data.message,
        type: 'success',
        position: 'bottom right'
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
