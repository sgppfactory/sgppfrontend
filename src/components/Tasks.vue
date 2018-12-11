<template>
  <div>
    <app-menu></app-menu>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row class="">
        <!-- <b-col sm="10">
        </b-col> -->
        <b-col sm="12">
          <b-button variant="primary" href="#/addtasks" class="float-xl-right">
            <icon name="plus" height="10" /> Nueva Tarea
          </b-button>
        </b-col>
      </b-row>
      <b-row class="">
        <calendar 
          ref="calendar" 
          :config="config">    
        </calendar>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Menu from '@/components/Menu'
import Calendar from '@/components/Task'

export default {
  name: 'Tasks',
  components: {
    'app-menu': Menu,
    Calendar
  },
  data () {
    return {
      title: 'Agenda',
      config: {
        locale: 'es'
      }
    }
  },
  methods: {
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
</style>
