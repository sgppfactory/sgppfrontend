<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="generate" @reset="onReset" id="formReports">
        <b-row>
          <b-col>
            <b-form-group label="Nombre:" label-for="name">
              <b-form-input id="name"
                            type="text"
                            v-model.trim="form.title"
                            required
                            placeholder="Ingrese el nombre para guardar"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Seleccionar tipo de reporte:" label-for="type">
              <b-form-checkbox id="porpose"
                        v-model="porposesSelected"
                        title="Sólo se mostrarán propuestas."
                        value="true"
                        v-b-tooltip.click.blur.rightbottom
                        unchecked-value="false">
                Propuestas
              </b-form-checkbox>
              <b-form-checkbox id="project"
                        v-model="projectsSelected"
                        title="Sólo se mostrarán proyectos."
                        value="true"
                        v-b-tooltip.click.blur.rightbottom
                        unchecked-value="false">
                Proyectos
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Subtipo / Criterio de segregación:" label-for="subcategory">
              <b-form-select id="subcategory"
                            v-bind:disabled="porposesSelected !== 'true' && projectsSelected !== 'true'"
                            v-model="form.subcategory"
                            placeholder="Seleccionar una subtipo"
                            title="El subtipo de filtrado es una forma de aplicar distintas formas de segregar los datos a fin de obtener visualizaciones estadísticas relevantes acerca de todas las propuestas del sistema."
                            v-b-tooltip.click.blur.rightbottom
                            :options="optionsSubcategories">
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ciclos:" label-for="cicles">
              <b-form-select id="cicles"
                            v-bind:disabled="porposesSelected !== 'true' && projectsSelected !== 'true'"
                            v-model="form.cicle"
                            placeholder="Seleccionar por rango de Ciclos"
                            title="Se pueden mostrar el total de las propuestas / proyectos o por ciclo en particular."
                            v-b-tooltip.click.blur.rightbottom
                            :options="optionsCicles">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button type="submit" variant="success">Previsualizar</b-button>
        <b-button type="button" variant="primary" @click="save">Guardar</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
      <div id="showGraphics" v-if="showGraphics">
        <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions">
        </highcharts>
      </div>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import reports from '@/apiClients/reports'
import Menu from '@/components/Menu'
import _ from 'underscore'
import {formatResponse} from '@/utils/tools.js'

export default {
  name: 'AddReport',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Realización de reportes',
      errorMessage: '',
      targetTooltip: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Reportes',
        href: '#/reports'
      }, {
        text: 'Realización de reportes',
        active: true
      }],
      porposesSelected: false,
      projectsSelected: false,
      showGraphics: false,
      stockOptions: {
        chart: {
          type: 'column',
          alignTicks: false,
          displayErrors: false
        },
        credits: {
          enabled: false
        },
        title: {
          text: 'Previsualización'
        },
        legend: {
          navigation: {
            enabled: false
          }
        },
        plotOptions: {
          series: {
            colorByPoint: true
          }
        },
        navigator: {
          enabled: false
        },
        rangeSelector: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        xAxis: {
          tickInterval: 1,
          labels: {
            enabled: true
          }
        },
        yAxis: {
          allowDecimals: false,
          min: 0
        },
        series: []
      },
      form: {
        title: '',
        cicle: 0,
        subcategory: 1
      },
      toUpdate: 0,
      // updateArgs: {},
      optionsSubcategories: [{
        value: 1,
        text: 'Por Etiquetas / Categorías'
      }, {
        value: 2,
        text: 'Por Etiquetas  y Nodo'
      }, {
        value: 3,
        text: 'Por Avances'
      }, {
        value: 4,
        text: 'Por Nodo / Estructura'
      }],
      optionsCicles: [{
        value: 0,
        text: 'Todos los ciclos'
      // }, {
      //   value: 2,
      //   text: 'Separado por ciclos'
      }] // Se agrega el resto de los ciclos
    }
  },
  computed: {
    formClass: function () {
      return {
        'is-invalid': this.messageError !== ''
      }
    },
    showErrorMsg: function () {
      return this.messageError !== ''
    }
  },
  created () {
    var loader = this.$loading.show()
    var self = this
    reports.findCicles()
      .then((result) => {
        _.forEach(result.data.message, (item, index) => {
          this.optionsCicles.push({value: item.id, text: 'Ciclo ' + item.date})
        })

        if (this.$route.query.reportId) {
          reports.findById(this.$route.query.reportId)
            .then(report => {
              loader.hide()
              if (result.status === 200) {
                let report = report.data.message
                self.toUpdate = this.$route.query.reportId
                // let query = JSON.parse(report.query)
                self.projectsSelected = report.query
                self.porposesSelected = report.query
                self.form.title = report.title
                self.form.subcategory = report.query
              }
            }).catch((err) => {
              loader.hide()
              self.getErrorMessage(err)
            })
        } else {
          loader.hide()
        }
      })
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    generate (ev) {
      ev.preventDefault()
      var loader = this.$loading.show()
      var self = this
      var params = _.clone(this.form)
      params.porposes = this.porposesSelected
      params.projects = this.projectsSelected
      this.showGraphics = true

      reports.generate(params)
        .then(result => {
          loader.hide()
          if (result.status === 200) {
            var data = result.data.message
            if (params.subcategory === 2) {
              var seriesData = _.map(_.groupBy(data, item => {
                return item.labelName
              }), (item2, index) => {
                return {data: _.map(item2, item3 => { return item3.cant }), name: index}
              })

              var categories = _.map(_.groupBy(data, item => {
                return item.labelSubName
              }), (item2, index) => {
                return index
              })

              console.log(categories, seriesData)

              self.stockOptions.xAxis = {
                categories: categories
              }

              self.stockOptions.series = seriesData
              // self.stockOptions.series = [{
              //   type: 'column',
              //   data: data,
              //   // tooltip: {
              //   //   pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.y}</b><br/>'
              //   // }
              // }]

            } else {
              data = _.map(data, (item, index) => {
                return {y: item.cant, x: index, name: item.labelName}
              })

              self.stockOptions.series = [{
                type: 'column',
                data: data,
                tooltip: {
                  pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.y}</b><br/>'
                }
              }]
            }

            self.stockOptions.xAxis.categories = _.map(data, (item) => {
              return item.name
            })
          }
          
          self.stockOptions.yAxis.title = {
            text: params.porposes && !params.projects 
                  ? 'Propuestas'
                  : (!params.porposes && params.projects 
                    ? 'Proyectos'
                    : 'Propuestas y Poryectos')}
        }).catch(error => {
          console.log(error)
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    save () {
      var loader = this.$loading.show()
      let params = _.clone(this.form)
      let query = {
        porposes: params.porposes,
        projects: params.projects,
        projects: params.projects,
      }
      // params
      reports.post(params)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.getSuccessMessage(result)
            this.onReset()
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    onReset () {
      this.form = {
        name: '',
        subcategory: '',
        cicle: ''
      }

      this.porposesSelected = false
      this.projectsSelected = false
    },
    getSuccessMessage (msg) {
      this.$notify({
        group: 'success',
        title: 'Ok!',
        text: msg.data.message,
        type: 'success'
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
a {
  color: #42b983;
}
.stock {
  width: 90%;
  margin: 0 auto
}
</style>
