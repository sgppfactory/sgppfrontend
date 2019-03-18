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
        :sort-desc.sync="sortDesc" 
        id="porpose-table">
        <template slot="HEAD_actions">
          Opciones
        </template>
        <template slot="actions" slot-scope="row">
          <router-link :to="{ name: 'AddPorpose', query: { porposeId: row.item.id }}" 
                        v-b-tooltip.hover 
                        title="Modificar Propuesta / Proyecto"> 
            <icon name="edit" />
          </router-link>
          <!-- v-bind="row.detailsShowing"  -->
          <a @click="showDetails(row)" v-b-tooltip.hover title="Más información">
            <icon name="info" />
          </a>
          <a @click="openModalChangeState(row.item.id, row.item.state, row.item.type)" v-b-tooltip.hover title="Cambiar Estado"><!-- v-b-modal.changeState -->
            <icon name="level-up" />
          </a>
        </template>
        <template slot="empty">¡Sin propuestas o proyectos para mostrar!</template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-row>
              <b-col>
                <ul class="details">
                  <li v-for="(value, key) in dataDetails" :key="key"><b>{{ key }}</b>: {{ value }}</li>
                </ul>
                <h5>Registros de avance:</h5>
                <b-table striped hover :items="advanceProjectsDetails" :fields="advanceHeaders">
                </b-table>
                <b-pagination-nav :total-rows="cantRowsAdvance"
                                  align="center"
                                  :per-page="6"
                                  v-model="currentPageAdvance"
                                  @change="changePaginationAdvances" />
              </b-col>
              <b-col>
                <!-- <div id="gmapsdetails"></div> -->
                <gmap-map ref="mapRef"
                          :center="{lat:-34.097695, lng:-59.030265}"
                          :zoom="14"
                          map-type-id="terrain"
                          style="width: 100%; height: 300px">
                </gmap-map>
                <div class="bars-progress">
                  <h5>Avance Total:</h5>
                  <b-progress :precision="2" show-value variant="success" class="mb-2" show-progress>
                    <b-progress-bar :value="totalAdvance" variant="success">
                      Avance: {{totalAdvance}} %
                    </b-progress-bar>
                  </b-progress>
                  <b-progress :precision="2" :max="maxAmount" show-valueclass="mb-2">
                    <b-progress-bar :value="amountAdvance">
                      Monto gastado: $ {{amountAdvance}}
                    </b-progress-bar>
                  </b-progress>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-btn size="sm" variant="danger" @click="toggleRow(row)">
                  Cerrar
                </b-btn>
              </b-col>
            </b-row>
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
    <b-modal ref="changeState" title="Cambiar estado de la Propuesta / Proyecto">
      <p class="my-2">La propuesta cambia de estado a:</p>
      <b-form-select  id="state" 
                      placeholder="Seleccionar un estado" 
                      v-model="stateSelect"
                      :options="optionsNodes">
      </b-form-select>
      <div class="form-notify" v-show="notifyAdvanceForm">
        <h5>Notificación de avance</h5>
        <b-form-group label="Porcentaje:" label-for="percent">
          <b-form-input id="percent"
                        type="text"
                        v-model.trim="advanceProject.percent"
                        required
                        placeholder="Ingrese un porcentaje de avance"
                        v-b-tooltip.click.blur.rightbottom 
                        title="Campo requerido">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Monto gastado:" label-for="amount">
          <b-form-input id="amount"
                        type="text"
                        v-model.trim="advanceProject.amount"
                        required
                        placeholder="Ingrese un porcentaje de avance"
                        v-b-tooltip.click.blur.rightbottom 
                        title="Campo requerido">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Notas:" label-for="notes">
          <b-form-textarea id="notes"
                        type="text"
                        v-model.trim="advanceProject.notes"
                        required
                        placeholder="Ingrese notas al respecto del avance">
          </b-form-textarea>
        </b-form-group>
      </div>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="primary" @click="changeState">
         Cambiar
       </b-btn>
       <b-btn size="sm" variant="danger" @click="hideChangeState">
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
import {formatResponse} from '@/utils/tools.js'
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
      toChange: 0,
      isBusy: false,
      sortBy: 'title',
      sortDesc: false,
      optionsNodes: [],
      stateSelect: '',
      notifyAdvanceForm: false,
      advanceProject: {
        percent: '',
        amount: 0,
        notes: ''
      },
      advanceProjectsDetails: [],
      advanceHeaders: [
        {
          label: 'Porcentaje',
          key: 'percent',
          formatter: (value) => {
            return value + '%'
          }
        },
        {
          label: 'Monto gastado',
          key: 'amount',
          formatter: (value) => {
            return value ? '$ ' + value : ''
          }
        },
        {label: 'Notas', key: 'notes'},
        {
          label: 'Fecha',
          key: 'created_at',
          formatter: (value) => {
            if (value) {
              let dateP = new Date(value)
              return dateP.toLocaleString('es-AR')
            }
            return ''
          }
        }
      ],
      totalAdvance: 0,
      amountAdvance: 0,
      maxAmount: 0,
      dataDetails: {},
      labelsDetails: [],
      personsDetails: [],
      cantRowsAdvance: 0,
      currentPageAdvance: 0,
      marker: {},
      map: null
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
  watch: {
    // whenever question changes, this function will run
    stateSelect: function (newState, oldQuestion) {
      this.notifyAdvanceForm = newState === 'notify'
    }
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('/login')
    },
    openModalChangeState (id, state, type) {
      // var loader = this.$loading.show()
      // 'Creado','Cancelado','Avanzado - Propuesta','Proyecto nuevo','Avanzado - Proyecto','Finalizado'
      // Propuesta: Dar de baja la propuesta y Avanzar de Etapa
      // Proyecto: Dar de baja el proyecto, Notificar avance y Finalizar Proyecto
      if (type === 1) {
      // Es igual a propuesta
        this.optionsNodes = [
          {text: 'Seleccione una opción', value: ''},
          {text: 'Avanzar de Etapa', value: 'advance'},
          {text: 'Dar de baja la propuesta', value: 'delete'}
        ]
      } else {
        this.optionsNodes = [
          {text: 'Seleccione una opción', value: ''},
          {text: 'Notificar avance', value: 'notify'},
          {text: 'Finalizar proyecto', value: 'final'},
          {text: 'Dar de baja el proyecto', value: 'delete'}
        ]
      }
      this.toChange = id
      this.$refs.changeState.show()
    },
    hideChangeState () {
      this.optionsNodes = []
      this.toChange = 0
      this.$refs.changeState.hide()
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
      params.bypage = 10

      params.order = 'createdAt'
      params.criteria = 'DESC'

      porpose.getFilter(params)
        .then((result) => {
          loader.hide()
          this.porposeprojects = (result.status === 200)
            ? _.map(
                result.data.result,
                (porpose) => {
                  return porpose.type === 2 ? _.extend(porpose, {_rowVariant: 'success' }) : porpose
                }
              )
            : []

          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    showDetails (row) {
      // Necesito eliminar todas las filas antes de abrir otra...
      var elementsToRemove = document.getElementsByClassName('b-table-details')
      while (elementsToRemove.length > 0) {
        elementsToRemove[0].parentNode.removeChild(elementsToRemove[0])
      }
      if (!row.detailsShowing) {
        var loader = this.$loading.show()
        var self = this
        row.toggleDetails()
        self.totalAdvance = self.amountAdvance = 0
        porpose.getById(row.item.id)
          .then((result) => {
            if (result.status === 200) {
              var porpose = result.data.message
              var date = new Date(porpose.created_at)
              var localeString = date.toLocaleString('es-AR')
              var place = JSON.parse(porpose.location)
              var lat = place ? place.lat : null
              var lng = place ? place.lng : null

              this.dataDetails = {
                'Título': porpose.title,
                'Estado': porpose.state,
                'Tipo': porpose.type === 1 ? 'Propuesta' : 'Proyecto',
                'Ubicación': place ? place.address : ' - ',
                'Creado el': porpose.created_at ? localeString : '',
                'Monto destinado': porpose.amount ? '$ ' + porpose.amount : ' - ',
                'Detalles': (_.isEmpty(porpose.details) || porpose.details === 'null') ? '' : porpose.details
              }

              var totalShow = 5

              this.advanceProjectsDetails = porpose.project_steps
              this.labelsDetails = porpose.labels
              this.personsDetails = porpose.persons

              self.totalAdvance = _.reduce(_.pluck(porpose.project_steps, 'percent'), (memo, item) => {
                return memo + item
              })

              self.amountAdvance = _.reduce(_.pluck(porpose.project_steps, 'amount'), (memo, item) => {
                return memo + item
              })

              self.maxAmount = porpose.amount ? porpose.amount : self.amountAdvance
              self.cantRowsAdvance = porpose.project_steps ? porpose.project_steps.length / totalShow : 0
              self.currentPageAdvance = 1

              if (lat && lng) {
                self.$refs.mapRef.$mapCreated.then((map) => {
                  const position = new google.maps.LatLng(lat, lng)

                  // si tiene marcador en el mapa, se lo saco y hago uno nuevo
                  if (!_.isEmpty(self.marker)) {
                    self.marker.setMap(null)
                  }

                  self.marker = new google.maps.Marker({
                    position,
                    map
                  })

                  map.panTo({lat: lat, lng: lng})
                  loader.hide()
                })
              } else {
                loader.hide()
              }
            }
          }).catch((error) => {
            console.log(error)
            loader.hide()
            this.getErrorMessage(error)
          })
      }
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
      var advance = null
      if (this.stateSelect === 'notify') {
        advance = this.advanceProject
      }
      porpose
        .changeState(this.toChange, this.stateSelect, advance)
        .then((result) => {
          loader.hide()
          this.$refs.changeState.hide()
          this.showSuccessMsg(result)
          this.search(this.$route.query.page)
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
    },
    changePaginationAdvances (page) {

    },
    toggleRow (row) {
      row.toggleDetails()
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
ul.details {
  list-style-type: none;
  padding: 0;
}
ul.details li {
  display: block;
  margin: 5px; 
}
.form-inline {
  margin-bottom: 20px;
}
a:not([href]):not([tabindex]) {
  color: #007bff;
  cursor: pointer;
}
.form-notify {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #e9ecef;
}
h5. {
  margin-top: 5px;
}
div.bars-progress {
  margin-top: 20px;
}
</style>
