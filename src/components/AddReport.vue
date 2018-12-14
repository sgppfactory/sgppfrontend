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
                            v-model.trim="form.name"
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
            <b-form-group label="Seleccionar reporte:" label-for="type">
              <b-form-checkbox id="porpose"
                        v-model="porposesSelected"
                        title="La subcategoría es una forma de generar una división"
                        value="true"
                        unchecked-value="false">
                Propuestas
              </b-form-checkbox>
              <b-form-checkbox id="project"
                        v-model="projectsSelected"
                        title="La subcategoría es una forma de generar una división"
                        value="true"
                        unchecked-value="false">
                Proyectos
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Subcategoría:" label-for="subcategory">
              <b-form-select id="subcategory"
                            v-bind:disabled="porposesSelected !== 'true' && projectsSelected !== 'true'"
                            v-model="form.subcategory"
                            placeholder="Seleccionar una subcategoría"
                            title="La subcategoría es una forma de generar una división"
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
      <div id="showGraphics">
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
import HighchartsVue from 'highcharts-vue'

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
      form: {
        title: '',
        cicle: '',
        porpose: '',
        poject: '',
        subcategory: ''
      },
      toUpdate: 0,
      optionsSubcategories: [{
        value: 1,
        text: 'Por Etiquetas / Categorías'
      }, {
        value: 2,
        text: 'Por Avances'
      }, {
        value: 2,
        text: 'Por Nodo / Estructura'
      }],
      optionsCicles: [{
        value: 1,
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
          this.optionsCicles.push({value: index, text: 'Ciclo ' + item.date})
        })

        if (this.$route.query.reportId) {
          reports.findById(this.$route.query.reportId)
            .then((result) => {
              if (result.status === 200) {

                this.toUpdate = this.$route.query.porposeId
                // reports = reports.data.message
                // this.optionsRols = _.map(rolData, (item) => {
                //   return {
                //     value: item.id,
                //     text: item.name
                //   }
                // })
              }
              loader.hide()
            }).catch((err) => {
              loader.hide()
              this.getErrorMessage(err)
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
    generate () {
      var loader = this.$loading.show()
      let params = _.clone(this.form)
      params.porposesSelected = this.porposesSelected
      params.projectsSelected = this.projectsSelected

      reports.generate(params)
        .then((result) => {
          console.log(result)
          loader.hide()
          if (result.status === 200) {
          }
        }).catch(error => {
          console.log(error)
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    save () {
      var loader = this.$loading.show()
      let params = _.clone(this.form)
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
</style>
