<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-row>
        <b-form @submit="submit" @reset="onReset">
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
            <b-button type="submit" variant="primary">Crear</b-button>
            <b-button type="reset" variant="danger">Limpiar</b-button>
          </b-col>
        </b-form>
      </b-row>
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
      </b-row>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import reports from '@/apiClients/reports'
import Menu from '@/components/Menu'
import _ from 'underscore'
import {formatResponse} from '@/utils/tools.js'
import HighchartsVue from 'highcharts-vue'

export default {
  name: 'AddReport',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Realización de reportes',
      errorMessage: '',
      targetTooltip: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Reportes',
        href: '#/reports'
      }, {
        text: 'Realización de reportes',
        active: true
      }],
      form: {
        name: '',
        entity: '',
        filterBy: ''
      },
      toUpdate: 0,
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
    if (this.$route.query.reportId) {
      var loader = this.$loading.show()
      reports.findById(this.$route.query.reportId)
        .then((result) => {
          if (result.status === 200) {

            this.toUpdate = this.$route.query.porposeId
            // reports = reports.data.message
            // this.optionsRols = _.map(rolData, (item) => {
            //   return {
            //     value: item.id,
            //     text: item.name
            //   }
            // })
          }
          loader.hide()
        }).catch((err) => {
          loader.hide()
          this.getErrorMessage(err)
        })
    }
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    submit (id) {
      var loader = this.$loading.show()
      let params = _.clone(this.form)

      if (this.toUpdate) {
        reports.update(this.toUpdate, params)
          .then((result) => {
            if (result.status === 200) {
              this.getSuccessMessage(result)
            }
            loader.hide()
            this.$route.push('reports')
          }).catch((error) => {
            loader.hide()
            this.getErrorMessage(error)
          })
      } else {
        reports.post(_.extend(this.form, params))
          .then((result) => {
            loader.hide()
            if (result.status === 201) {
              this.getSuccessMessage(result)
              this.onReset()
            }
          }).catch((error) => {
            loader.hide()
            // console.log(error)
            this.getErrorMessage(error)
          })
      }
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
    getSuccessMessage (msg) {
      this.$notify({
        group: 'success',
        title: 'Ok!',
        text: msg.data.message,
        type: 'success'
      })
    },
    getErrorMessage (result) {
      formatResponse(result, (err) => {
        if (err === 'logout') {
          this.logout()
        } else {
          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: err,
            type: 'error',
            position: 'bottom right'
          })
        }
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
