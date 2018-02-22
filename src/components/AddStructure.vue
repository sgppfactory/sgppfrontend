<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="next" @reset="onReset">
        <b-row>
          <b-col>
            <b-form-group label="Nombre:" label-for="name">
              <b-form-input id="name"
                            type="text"
                            v-model.trim="form.name"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Descripción:" label-for="description">
              <b-form-input id="description"
                            type="text"
                            v-model.trim="form.description"
                            placeholder="Ingresar descripción">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Siguiente</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import configuration from '../apiClients/configuration'
import Menu from '@/components/Menu'
import _ from 'underscore'

export default {
  name: 'AddStructure',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Alta de estructura',
      showTooltip: false,
      errorMessage: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Configuración',
        href: '#/config_system'
      }, {
        text: 'Alta de estructura',
        active: true
      }],
      form: {
        name: '',
        description: ''
      }
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
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    next () {
      localStorage.data = form
    },
    onReset () {
      this.form = {
        name: '',
        description: ''
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
</style>
