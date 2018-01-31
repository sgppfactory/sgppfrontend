<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      {{title}}
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons'
import persons from '../apiClients/persons'
import Menu from '@/components/Menu'
export default {
  name: 'Persons',
  data () {
    return {
      title: 'Alta de personas',
      persons: [],
      menuComponent: undefined
    }
  },
  created () {
    this.menuComponent = Menu
    // this.search()s
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    submit (id) {
      let params = {}
      if (id) {
        params.id = id
      }

      persons.post(params)
      .then((result) => {
        console.log(result)
        this.persons = (result.status === 200)
        ? result.data.result
        : []
      }).catch((error) => {
        console.log(error)
        // this.logout()
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
