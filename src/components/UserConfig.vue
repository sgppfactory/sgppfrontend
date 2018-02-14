<template>
  <div class="login">
    <div :is="menuComponent"></div>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>

      <b-alert variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
        {{errorMessage}}
      </b-alert>

      <b-alert :show="dismissCountDown"
               dismissible
               variant="success"
               @dismissed="dismissCountDown=0"
               @dismiss-count-down="countDownChanged">
        <p>Persona creada satisfactoriamente!</p>
        <b-progress variant="success"
                    :max="dismissSecs"
                    :value="dismissCountDown"
                    height="4px">
        </b-progress>
      </b-alert>
      <b-form @submit="update">
        <b-row>
          <b-col>
            <h3>Cambiar contraseña</h3>
            <b-form-group label="Modifique su contraseña:" label-for="password">
              <b-form-input id="password" type="password" v-model="password" placeholder="Modificar Contraseña" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Confirme su nueva contraseña:" label-for="repassword">
              <b-form-input id="repassword" type="password" v-model="rePassword" placeholder="Confirmar nueva contraseña" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <h3>Datos personales</h3>
            <b-form-group label="Email:" label-for="email">
              <b-form-input id="email" type="email" v-model="email" placeholder="Modificar email" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Celular:" label-for="cel">
              <b-form-input id="cel" type="text" v-model="cel" placeholder="Agregar teléfono móvil" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono:" label-for="phone">
              <b-form-input id="phone" type="text" v-model="phone" placeholder="Agregar teléfono fijo" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Fecha nacimiento:" label-for="location">
              <b-form-input id="date_birth" type="date" v-model="date_birth" placeholder="Agregar fecha nacimiento" v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación o domicilio:" label-for="location">
              <b-form-input id="location"
                            type="text"
                            v-model.trim="form.location"
                            placeholder="Ingresar un domicilio o ubicación">
              </b-form-input>
            </b-form-group>

            <gmap-map
              :center="{lat:-34.097695, lng:-59.030265}"
              :zoom="14"
              map-type-id="terrain"
              style="width: 100%; height: 300px"
            ></gmap-map>

            <b-table striped hover :items="logins" :fields="fields">
            </b-table>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Modificar</b-button>
      </b-form>
    </b-container>
  </div>
</template>
<!--   <div align="center">
    <img src="static/loading.gif" border="0">
  </div> -->

<script>
import user from '../apiClients/auth'
import Menu from '@/components/Menu'

export default {
  name: 'Login',
  data () {
    return {
      title: 'Configuración de usuario',
      errorMessage: '',
      menuComponent: undefined,
      form: {
        password: '',
        rePassword: '',
        location: '',
        email: '',
        cel: '',
        phone: '',
        date_birth: '',
        passConfirmation: ''
      },
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Configuración Usuario',
        active: true
      }],
      logins: [],
      fields: [
        {label: 'IP', key: 'ip'},
        {label: 'Fecha', key: 'date_hour'}
      ]
    }
  },
  created () {
    this.menuComponent = Menu
    user.getLogAuth((response) => {
        if (response.data) {
          this.logins = response.data.results
        }
      }).catch((error) => {
        if (error.response) {
          this.messageError = error.response.data.msg
        } else {
          this.messageError = 'Error indefinido'
        }
      })
  },
  computed: {
    formClass: function () {
      return {
        'is-invalid': this.errorMessage !== ''
      }
    },
    showErrorMsg: function () {
      return this.errorMessage !== ''
    }
  },
  methods: {
    update (evt) {
      evt.preventDefault()
      user.update(this.form)
        .then((response) => {
          if (response) {

          }
          this.messageError = ''
          // this.$router.push('home')
        }).catch((error) => {
          console.log(error)
          if (error.response) {
            this.messageError = error.response.data.msg
          } else {
            this.messageError = 'Error indefinido'
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
