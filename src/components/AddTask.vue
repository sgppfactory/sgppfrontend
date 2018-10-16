<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="submit" @reset="onReset">
        <b-row>
          <b-col>
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
            <b-form-group label="Fecha y Hora:" label-for="date_hour">
              <b-form-input id="date_hour"
                            type="date"
                            v-model.trim="form.date_hour"
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
                            required
                            placeholder="Estime la duración del evento"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Notas:" label-for="notes">
              <b-form-input id="notes"
                            type="text"
                            v-model.trim="form.notes"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Persona/s relacionada/s:" label-for="persons">
              <vue-bootstrap-typeahead :data="personsSearched"
                                        v-model="searchPerson"
                                        placeholder="Ingrese nombre y apellido de una persona"
                                        :serializer="s => s.lastname + ', ' + s.name"
                                        @hit="selectPerson"
                                        @input="searchPersons" />
              <div id="personsSelectedId" >
                <b-badge v-for="value in personsSelected" :id="value.id" pill variant="primary">
                {{value.lastname}}, {{value.name}} <a @click="deletePerson(value.id)" 
                                                      v-b-tooltip.hover 
                                                      title="No asociar a la persona">
                                                    <icon name="close" height="10"/>
                                                    </a>
                </b-badge>
              </div>
            </b-form-group>
            <b-form-group label="Estructura/Nodo:" label-for="node">
              <b-form-input id="node"
                            type="text"
                            v-model.trim="form.id_node"
                            placeholder="Seleccione un nodo o estructura">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>

          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Crear</b-button>
        <b-button type="reset" variant="danger">Cancelar</b-button>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import tasks from '@/apiClients/tasks'
import Menu from '@/components/Menu'
import node from '@/apiClients/node'
import _ from 'underscore'
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
        date_hour: '',
        duration: '',
        id_node: ''
      },
      optionsRols: [],
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
          this.optionsNodes = _.map(results.data.message, (item) => {
            return {
              value: item.id,
              text: item.name + (item.description !== '' ? ' - ' + item.description.substr(0, 25) : '')
            }
          })
        }
        if (this.$route.query.taskId) {
          tasks
            .getById(this.$route.query.taskId)
            .then((result) => {
              loader.hide()
              let task = result.data.message
              this.form = {
                title: task.title,
                notes: task.notes,
                date_hour: task.date_hour,
                duration: task.duration,
                id_node: task.id_node
              }

              // this.personsSelected
            }).catch((err) => {
              loader.hide()
              this.getErrorMessage(err)
            })
        } else {
          loader.hide()
        }
      }).catch((err) => {
        loader.hide()
        this.getErrorMessage(err)
      })
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
        })
    },
    selectPerson (value) {
      this.personsSelected.push(value)
      this.searchPerson = ''
    },
    submit (id) {
      let params = {}
      if (id) {
        params.id = id
      }

      tasks.post(_.extend(this.form, params))
        .then((result) => {
          console.log(result)
          if (result.status === 201) {
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
              // position: 'bottom right'
            })
            this.onReset()
            // this.showAlertSuccess()
          } else {
            this.$notify({
              group: 'error',
              title: 'Ops!',
              text: result.data.message,
              type: 'error'
            })
          }
        }).catch((error) => {
          // console.log(error)
          this.errorMessage = error.response.data.msg
          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: error.response.data.msg,
            type: 'error'
          })
          // this.logout()
        })
    },
    onReset () {
      this.form = {
        title: '',
        notes: '',
        date_hour: '',
        duration: '',
        id_node: ''
      }

      if (this.$route.query.taskId) {
        this.$route.push('/tasks')
      }
    },
    setError (input) {

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
