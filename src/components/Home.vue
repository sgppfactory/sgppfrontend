<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <div class="container">
      <h1>{{ msg }}</h1>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu'
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Al toke perro!',
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
