<template>
  <div>
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="submit" @reset="onReset">
        <b-row>
          <b-col>
            <b-form-group label="Nombres:" label-for="name">
              <b-form-input id="name"
                            type="text"
                            v-model.trim="form.name"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>

          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Crear</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import porpose from '../apiClients/porpose'
import Menu from '@/components/Menu'
import _ from 'underscore'

export default {
  name: 'AddPorpose',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Alta de Propuesta',
      errorMessage: '',
      targetTooltip: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Propuestas / Proyectos',
        href: '#/reports'
      }, {
        text: 'Alta de propuesta',
        active: true
      }],
      form: {
        title: '',
        idNode: '',
        details: '',
        location: '',
        amount: ''
      },
      optionsEntities: []
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
    submit (id) {
      let params = {}
      if (id) {
        params.id = id
      }

      porpose.post(_.extend(this.form, params))
        .then((result) => {
          console.log(result)
          if (result.status === 201) {
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
            })
            this.onReset()
            // this.showAlertSuccess()
          } else {
            this.$notify({
              group: 'error',
              title: 'Ops!',
              text: result.data.message,
              type: 'error'
            })
          }
        }).catch((error) => {
          // console.log(error)
          this.errorMessage = error.response.data.msg
          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: error.response.data.msg,
            type: 'error'
          })
          // this.logout()
        })
    },
    onReset () {
      this.form = {
        name: '',
        lastname: '',
        email: '',
        tel: '',
        cel: '',
        location: '',
        withuser: false,
        rol: ''
      }
    },
    setError (input) {

    },
    getErrorMessage (result) {
      result = result.response
      let message = ''
      if (result.status === 404 || result.status === 500) {
        message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
      } else if (result.status === 401) {
        this.logout()
      } else {
        message = result.data.message
        if (_.isArray(message)) {
          message = _.reduce(
            message,
            (memo, msg) => {
              return memo + msg.message + '<br>'
            },'')
        }
      }

      this.$notify({
        group: 'error',
        title: 'Ops!',
        text: message,
        type: 'error',
        position: 'bottom right'
      })
    },
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
