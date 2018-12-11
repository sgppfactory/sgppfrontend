<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="submit" @reset="onReset">
        <b-row>
          <b-col md="6" offset-md="3">
            <b-form-group label="Título:" label-for="title">
              <b-form-input id="title"
                            type="text"
                            v-model.trim="form.title"
                            required
                            placeholder="Ingrese un Título"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Fecha y Hora:" label-for="dateHour">
              <b-form-input id="dateHour"
                            type="datetime-local"
                            v-model.trim="form.dateHour"
                            required
                            placeholder="Ingrese fecha y hora del comienzo de la tarea"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Duración:" label-for="duration">
              <b-form-input id="duration"
                            type="text"
                            v-model.trim="form.duration"
                            placeholder="Estime la duración del evento"
                            title="La duración de la tarea, puede ser expresada en el formato hh:mm, pero a su vez, se puede denotar con una 'h' para las horas y 'm' para los minutos, ejemplo: 2h10m.">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Persona/s relacionada/s:" label-for="persons">
              <vue-bootstrap-typeahead :data="personsSearched"
                                        v-model="searchPerson"
                                        :serializer="s => s.lastname + ', ' + s.name + ' - ' + s.email"
                                        placeholder="Ingrese nombre y apellido de una persona"
                                        @hit="selectPerson"
                                        @input="searchPersons" />
              <div id="personsSelectedId">
                <b-badge v-for="value in personsSelected" :id="value.id" :key="value.id" pill variant="primary">
                {{value.lastname}}, {{value.name}} <a @click="deletePerson(value.id)" 
                                                      v-b-tooltip.hover 
                                                      title="No asociar a la persona">
                                                    <icon name="close" height="10"/>
                                                    </a>
                </b-badge>
              </div>
            </b-form-group>
            <b-form-group label="Estructura/Nodo:" label-for="idNode">
              <b-form-select id="idnode"
                            v-model="form.idNode"
                            :options="optionsNodes">
              </b-form-select>
            </b-form-group>

            <b-form-group label="Notas:" label-for="notes">
              <b-form-textarea id="notes"
                            v-model.trim="form.notes"
                            placeholder="Ingrese notas">
              </b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" offset-md="3">
            <b-button type="submit" variant="primary">Crear</b-button>
            <b-button type="reset" variant="danger">Limpiar</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import Menu from '@/components/Menu'
import node from '@/apiClients/node'
import task from '@/apiClients/tasks'
import _ from 'underscore'
import {formatResponse} from '../utils/tools.js'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import persons from '@/apiClients/persons'

export default {
  name: 'AddTask',
  components: {
    'app-menu': Menu,
    'vue-bootstrap-typeahead': VueBootstrapTypeahead
  },
  data () {
    return {
      title: 'Nueva Tarea',
      showTooltip: false,
      errorMessage: '',
      targetTooltip: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Tareas',
        href: '#/tasks'
      }, {
        text: 'Nueva tarea',
        active: true
      }],
      form: {
        title: '',
        notes: '',
        dateHour: '',
        duration: '',
        idNode: ''
      },
      optionsNodes: [],
      personsSearched: [],
      personsSelected: [],
      searchPerson: ''
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

    node.getChildrens()
      .then((results) => {
        if (results) {
          this.optionsNodes.push({value: '', text: 'Seleccione un Nodo o Estructura'})
          this.optionsNodes = this.optionsNodes.concat(_.map(results.data.message, (item) => {
            return {
              value: item.id,
              text: item.name + (item.description !== '' ? ' - ' + item.description.substr(0, 25) : '')
            }
          }))
        }
        loader.hide()
      }).catch((err) => {
        loader.hide()
        this.getErrorMessage(err)
      })
  },
  mounted () {
    document.getElementById('dateHour')
      .setAttribute('min', new Date())
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    searchPersons () {
      var params = this.searchPerson ? {
        filter: [
          {key: 'name', value: this.searchPerson, operator: 'like', operator_sup: 'OR'},
          {key: 'lastname', value: this.searchPerson, operator: 'like', operator_sup: 'OR'},
          {key: 'email', value: this.searchPerson, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      params.bypage = 5

      persons.getFilter(params)
        .then((result) => {
          this.personsSearched = (result.status === 200)
            ? result.data.result
            : []
        }).catch(this.getErrorMessage)
    },
    selectPerson (value) {
      this.personsSelected.push(value)
      this.searchPerson = ''
    },
    submit () {
      var loader = this.$loading.show()
      var params = _.clone(this.form)
      let durationToParse = params.duration
      if (durationToParse.indexOf('h') > -1) {
        let hour = durationToParse.split('h')
        let minutes = '00'
        if (durationToParse.indexOf('m') > -1) {
          minutes = parseInt(hour[1].replace('m', ''))
        }
        hour = parseInt(hour[0])

        this.form.duration = hour + ':' + minutes
      } else if (durationToParse.indexOf(':') === -1 && durationToParse.indexOf('m') > -1) {
        let hour = Math.floor(parseInt(durationToParse) / 60)
        let minutes = Math.round((parseInt(durationToParse) % 60) * 60)

        this.form.duration = hour + ':' + minutes
      }

      params.persons = _.map(this.personsSelected, (pers) => {
        return pers.id
      })

      task.post(this.form)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
            })
            this.onReset()
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    onReset () {
      this.form = {
        title: '',
        notes: '',
        dateHour: '',
        duration: '',
        idNode: ''
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
#personsSelectedId {
  margin-top: 10px;
}
</style>
