<template>
  <div>
    <app-menu></app-menu>
    <div class="container">
      <b-row>
        <b-col sm="7">
          <h3 class="mb-8">{{ title }}</h3>
        </b-col>
        <b-col sm="5">
          <h4 class="mb-8">{{ msg }}</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="7">
          <!-- <div> -->
          <b-row>
            <b-col>
              <b-alert show variant="primary" class="mb-8 text-center">
                 {{porposeEnabled}} propuestas activas!
              </b-alert>
            </b-col>
            <b-col>
              <b-alert show variant="secondary" class="mb-8 text-center">
                 {{projectsEnabled}} proyectos activos!
              </b-alert>
            </b-col>
          </b-row>
          <!-- </div> -->
          <calendar 
            ref="calendar" 
            :config="config">    
          </calendar>
        </b-col>
        <b-col sm="5">
          <ul class="list-unstyled ml-4">
            <b-media vertical-align="center" tag="li" class="my-1" v-for="(activities, index) in lastActivities">
              <b-img slot="aside" blank blank-color="#abc" width="64" alt="placeholder" />
              <h5 class="mt-0 mb-1">{{activities.title}}</h5>
              {{activities.details}}
            </b-media>
          </ul>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu'
import implementation from '@/apiClients/implementation'
import user from '@/apiClients/auth'
import porpose from '@/apiClients/porpose'
import Calendar from '@/components/Task'

export default {
  name: 'Home',
  components: {
    'app-menu': Menu,
    Calendar
  },
  data () {
    return {
      title: 'Bienvenido/a',
      msg: 'Qué sucede en ',
      lastActivities: [],
      porposeEnabled: 0,
      projectsEnabled: 0,
      events: [],
      config: {
        eventClick: (event) => {
          this.selected = event
        },
        locale: 'es',
        defaultView: 'listWeek',
        header: {
          left: '',
          center: 'title',
          right: ''
        }
      }
    }
  },
  created () {
    var params = {}
    params.bypage = 5
    params.orderby = 'id'
    params.criteria = 'DESC'
    params.filter = [{key: 'type', value: 1, operator: '='}]
    // params.orderby = 5
    porpose.getFilter(params)
      .then((response) => {
        this.lastActivities = (response.status === 200)
          ? response.data.result
          : []
        this.porposeEnabled = response.data ? response.data.total : 0
      }).catch((error) => {
        this.getErrorMessage(error)
      })

    var params2 = {}
    params2.bypage = 1
    params2.filter = [{key: 'type', value: 2, operator: '='}]
    // params.orderby = 5
    porpose.getFilter(params2)
      .then((response) => {
        this.projectsEnabled = response.data ? response.data.total : 0
      }).catch((error) => {
        this.getErrorMessage(error)
      })

    implementation.get()
      .then((result) => {
        if (result.status === 200) {
          let implData = result.data.message
          if (implData) {
            this.msg = this.msg + implData.name + '?'
          } else {
            this.msg += '...'
          }
        }
      })

    user.getUserPerson()
      .then((result) => {
        if (result.status === 200) {
          let userData = result.data.message
          if (userData) {
            this.title = this.title + ' ' + userData.name + '!'
          }
        }
      })
  },
  beforeCreate () {
    document.body.className = ''
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
/*ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}*/
a {
  color: #42b983;
}
.container {
  margin-top: 20px;
}
</style>
