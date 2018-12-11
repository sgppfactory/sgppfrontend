<template>
  <div>
    <full-calendar 
      ref="calendar" 
      :event-sources="eventSources" 
      :config="config">    
    </full-calendar>
    <b-modal id="viewDetails" v-model="show" title="Detalle de Tarea">
      <ul class="details">
        <li v-for="(value, key) in dataDetails" :key="key"><b>{{ key }}</b>: {{ value }}</li>
      </ul>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="primary" @click="show=false">
         Cancelar
       </b-btn>
     </div>
    </b-modal>
    <notifications group="error" />
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'underscore'
import tasks from '@/apiClients/tasks'
import porpose from '@/apiClients/porpose'
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/es'
import {formatResponse} from '@/utils/tools.js'

export default {
  name: 'Task',
  components: {
    FullCalendar
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      title: 'Agenda',
      cantResults: 0,
      show: false,
      events: [],
      dataDetails: {}
    }
  },
  created () {
    var self = this
    this.config.eventClick = (event) => {
      var loader = self.$loading.show()
      tasks.findById(event.id)
        .then((result) => {
          if (result.status === 200) {
            let task = result.data.message
            let dateHour = new Date(task.dateHour)
            let localeString = dateHour.toLocaleString("es-AR");
            let persons = task.persons
            let node = task.node
            let userCreated = task.user
            var porposeProject = {}
            if (!_.isEmpty(task.idPorposeProject)) {
              porpose.getById(task.idPorposeProject)
                .then(porpose => {
                  console.log(porpose)
                  porposeProject = porpose.data.message
                  self.dataDetails['Propuesta / Proyecto'] = !_.isEmpty(porposeProject) 
                    ?   porposeProject.title 
                    :   ''
                })
            }

            self.show = true
            self.dataDetails = {
              'Título': task.title,
              'Fecha y hora': localeString,
              'Duración': !_.isEmpty(task.duration) ? task.duration : 'Todo el día',
              'Nodo / Estructura': !_.isEmpty(node) ? node.name : '',
              'Persona/s Asociada/s': !_.isEmpty(persons) ? persons.title : '',
              // 'Propuesta / Proyecto': !_.isEmpty(porposeProject) ? porposeProject.title : '',
              'Creado por': !_.isEmpty(userCreated) 
                ? userCreated.lastname + ', ' + userCreated.name + '(' + userCreated.username + ')'
                : '',
              'Notas': !_.isEmpty(task.notes) ? task.notes : '-'
            }
          }
          loader.hide()
        }).catch((error) => {
          // console.log(error)
          loader.hide()
          self.getErrorMessage(error)
        })
    }
  },
  methods: {
    getErrorMessage (result) {
      formatResponse(result, (err) => {
        if (err !== 'logout') {
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
  },
  computed: {
    eventSources () {
      const self = this
      return [
        {
          events (start, end, timezone, callback) {
            var loader = self.$loading.show()
            var params = {
              filter: [
                {key: 'date_hour', value: start, operator: '>', operator_sup: 'AND'},
                {key: 'date_hour', value: end, operator: '<', operator_sup: 'AND'}
              ]
            } 
            params = {start: start, end: end}
            tasks.getFilter(params)
              .then((response) => {
                self.cantResults = response.data.total

                var events = _.map(response.data.result, (item) => {
                  let end = moment(item.dateHour)
                  let durationArray = item.duration.split(':')

                  if (durationArray.length === 2) {
                    end.add(durationArray[0], 'hours')
                    end.add(durationArray[1], 'minutes')
                  } else if (durationArray.length === 1) {
                    end.add(durationArray[0], 'minutes')
                  }

                  return {
                    id : item.id,
                    title: item.title,
                    start: moment(item.dateHour),
                    end: end,
                    allDay: _.isEmpty(item.duration),
                    color: _.isEmpty(item.idPorposeProject) ? '#b51111' : '#11b52d',
                    textColor: '#000000'
                  }
                })

                self.events = events
                if (response.status === 200) {
                  callback(events)
                }

                loader.hide()
              }).catch(err => {
                loader.hide()
                self.getErrorMessage(err)
              })
          }
        }
      ]
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
.fc.fc-unthemed.fc-ltr {
  margin: 15px;
}
ul.details {
  list-style-type: none;
  padding: 0;
}
ul.details li {
  display: block;
  margin: 5px; 
}
</style>
