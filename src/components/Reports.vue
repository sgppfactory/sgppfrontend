<template>
  <div>
    <app-menu></app-menu>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row>
        <b-col sm="10">
          <b-form inline @submit="search">
            <b-input class="mb-3 mr-sm-3 mb-sm-0" id="searchReport" placeholder="Buscar reportes guardados" v-model="searchParam" />
          </b-form>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addreport">
            <icon name="plus" height="10" /> Nuevo Reporte
          </b-button>
        </b-col>
      </b-row>
      <b-table striped hover show-empty 
        :items="reports" 
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
          <router-link :to="{ name: 'showreport', params: { report: row.item.id }}" v-b-tooltip.hover title="Ver reporte"> 
            <icon name="info" />
          </router-link>
          <a @click="toRemove=row.item.id" v-b-tooltip.hover title="Borrar reporte" v-b-modal.deleteModal class="danger">
            <icon name="remove" />
          </a>
        </template>
        <template slot="empty">¡Sin reportes para mostrar!</template>
      </b-table>
      <b-row>
        <b-col sm="9">
          <b-pagination-nav :link-gen="search" base-url="#" :number-of-pages="cantPages" v-model="currentPage" />
        </b-col>
        <b-col sm="3" align="center">Registros: {{cantResults}}</b-col>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
    </b-container>
    <b-modal id="deleteModal" v-model="show" title="Eliminar Persona">
      <p class="my-2">¿Está seguro que desea realizar la siguiente acción?</p>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deletereport()">
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
import reports from '../apiClients/reports'
import Menu from '@/components/Menu'
export default {
  name: 'Persons',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Reportes',
      reports: [],
      fields: [
        {label: 'Título', key: 'title', sortable: true},
        // {label: 'Observaciones', key: 'observations', sortable: false},
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      currentPage: 1,
      searchParam: '',
      cantPages: 1,
      cantResults: 1,
      show: false,
      toRemove: 0,
      isBusy: false,
      sortBy: 'title',
      sortDesc: false
    }
  },
  computed: {
    resultNegative: () => {
      return this.cantResults === 0
    }
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    search (page) {
      var params = this.searchParam ? {
        filter: [
          {key: 'title', value: this.searchParam, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      if (page) {
        params.page = page
      }

      reports.getFilter(params)
        .then((result) => {
          this.reports = (result.status === 200)
          ? result.data.result
          : []

          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch(this.getErrorMessage)
    },
    deletereport () {
      reports.remove(this.toRemove)
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
            this.search()
          }
        }).catch(this.getErrorMessage)
    },
    showDetails (id) {
      reports.get(id)
        .then((result) => {
          if (result.status === 200) {
            this.toRemove = 0
            // console.log(result)
          } else {

          }
        }).catch((error) => {
          console.log(error)
          // this.logout()
        })
    },
    getErrorMessage (result) {
      let message = ''
      if (result.status === 404 || result.status === 500) {
        message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
      } else if (result.status === 401) {
        this.logout()
      } else {
        message = result.data.message
      }

      this.$notify({
        group: 'error',
        title: 'Ops!',
        text: message,
        type: 'error',
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
