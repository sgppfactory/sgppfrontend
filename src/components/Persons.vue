<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      <h1>{{ title }}</h1>

      <b-table striped hover :items="persons" :fields="fields"></b-table>
    </div>
  </div>
</template>

<script>
import persons from '../apiClients/persons'
import Menu from '@/components/Menu'
const items = [
  { name: 'Dickerson', lastname: 'Macdonald', email: 'asd@asd.com', tel: '', username: '' },
  { name: 'Dickerson', lastname: 'Macdonald', email: 'asd@asd.com', tel: '', username: 'algo' },
  { name: 'Dickerson', lastname: 'Macdonald', email: 'asd@asd.com', tel: '', username: '' },
  { name: 'Dickerson', lastname: 'Macdonald', email: 'asd@asd.com', tel: '', username: '' }
]
export default {
  name: 'Persons',
  data () {
    return {
      title: 'Agenda de personas',
      persons: items,
      menuComponent: undefined,
      fields: [
        {label: 'Nombre', key: 'name'},
        {label: 'Apellido', key: 'lastname'},
        {label: 'Email', key: 'email'},
        {label: 'Teléfono', key: 'tel'},
        {label: 'Usuario', key: 'username'}
      ]
    }
  },
  created () {
    this.menuComponent = Menu
    persons.get()
      .then((result) => {
        console.log(result)
        // if (result.status === 200) {
        //   // console.log(result.data.result)
        //   this.menu = JSON.parse(result.data.result)
        // } else {
        //   this.logout()
        // }
      }).catch((error) => {
        console.log(error)
        // if (error.response) {
        //   this.logout()
        // }
      })
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
