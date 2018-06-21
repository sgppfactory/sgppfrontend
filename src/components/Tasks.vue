<template>
  <div>
    <app-menu></app-menu>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row class="">
        <b-col sm="10">
          <!-- <b-form inline @submit="search">
            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchTasks" placeholder="Buscar tareas" v-model="searchParam" />
          </b-form> -->
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addtasks">
            <icon name="plus" height="10" /> Nueva Tarea
          </b-button>
        </b-col>
      </b-row>
      <b-row class="">
        <full-calendar 
          ref="calendar" 
          :event-sources="eventSources" 
          @event-selected="eventSelected" 
          @event-created="eventCreated" 
          :config="config">    
        </full-calendar>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
    </b-container>
    <b-modal id="viewDetails" v-model="show" title="Detalle de Tarea">
      <p class="my-2">¿Está seguro que desea realizar la siguiente acción?</p>
      <!-- <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deleteTask()">
         Eliminar
       </b-btn>
       <b-btn size="sm" variant="primary" @click="show=false">
         Cancelar
       </b-btn>
     </div> -->
    </b-modal>
  </div>
</template>

<script>
// import moment from 'moment';
import tasks from '../apiClients/tasks'
import Menu from '@/components/Menu'
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/es'

export default {
  name: 'Tasks',
  components: {
    'app-menu': Menu,
    FullCalendar
  },
  data () {
    return {
      title: 'Agenda',
      cantResults: 1,
      show: false,
      events: [
        // {
        //   id: 1,
        //   title: 'event1',
        //   start: moment().hours(12).minutes(0),
        // },
        // {
        //   id: 2,
        //   title: 'event2',
        //   start: moment().add(-1, 'days'),
        //   end: moment().add(1, 'days'),
        //   allDay: true,
        // }
        // {
        //   id: 3,
        //   title: 'event3',
        //   start: moment().add(2, 'days'),
        //   end: moment().add(2, 'days').add(6, 'hours'),
        //   allDay: false,
        // },
      ],

      config: {
        eventClick: (event) => {
          this.selected = event
        },
        locale: 'es'
      },
      selected: {}
    }
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    refreshEvents () {
      this.$refs.calendar.$emit('refetch-events')
    },

    // removeEvent() {
    //   this.$refs.calendar.$emit('remove-event', this.selected);
    //   this.selected = {};
    // },

    eventSelected (event) {
      this.selected = event
      tasks.get(event)
        .then((result) => {
          console.log(result)
          if (result.status === 200) {
            this.toRemove = 0
          } else {

          }
        }).catch(this.getErrorMessage)
    },
    eventCreated (...args) {
    // eventCreated (/**/) {
      console.log(args)
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
  },
  computed: {
    eventSources () {
      const self = this
      return [
        {
          events (start, end, timezone, callback) {
            setTimeout(() => {
              callback(self.events.filter(() => Math.random() > 0.5))
            }, 1000)
          }
        },
        {
          events (start, end, timezone, callback) {
            let params = {start: start, end: end}
            tasks.getFilter(params)
              .then((response) => {
                console.log(response.data)
                self.cantResults = response.data.total
                if (response.status === 200) {
                  callback(response.data.data)
                }
              }).catch(self.getErrorMessage)
            // self.$http.get(`/anotherFeed`, {timezone: self.timezone}).then(response => {
            // })
          },
          color: 'red'
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
/*.form-inline {
  margin-bottom: 20px;
}
.form-inline-right {
  margin-left: 55%;
}*/
</style>
