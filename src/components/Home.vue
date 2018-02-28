<template>
  <div>
    <app-menu></app-menu>
    <div class="container">
      <b-row>
        <b-col>
          <h4>{{ msg }}</h4>
        </b-col>
        <b-col>
          <h3>{{ title }}</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ul class="list-unstyled">
            <b-media vertical-align="center" tag="li">
              <b-img slot="aside" blank blank-color="#abc" width="64" alt="placeholder" />
              <h5 class="mt-0 mb-1">List-based media object</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
              ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus
              viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec
              lacinia congue felis in faucibus.
            </b-media>
            <b-media tag="li" class="my-4" vertical-align="center">
              <b-img slot="aside" blank blank-color="#cba" width="64" alt="placeholder" />
              <h5 class="mt-0 mb-1">List-based media object</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
              ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus
              viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec
              lacinia congue felis in faucibus.
            </b-media>
            <b-media tag="li" vertical-align="center">
              <b-img slot="aside" blank blank-color="#bac" width="64" alt="placeholder" />
              <h5 class="mt-0 mb-1">List-based media object</h5>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
              ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus
              viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec
              lacinia congue felis in faucibus.
            </b-media>
          </ul>
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
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Bienvenido/a',
      msg: 'Qué sucede en ...?'
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
.container {
  margin-top: 20px;
}
</style>
