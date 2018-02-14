<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      <b-row>
        <b-col>
          <h3>{{ title }}</h3>
        </b-col>
        <b-col>
          <h4>{{ msg }}</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
        </b-col>
        <b-col>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu'
export default {
  name: 'Home',
  data () {
    return {
      title: 'Bienvenido/a',
      msg: 'Qué sucede en ...?',
      menuComponent: undefined
    }
  },
  created () {
    this.menuComponent = Menu
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
