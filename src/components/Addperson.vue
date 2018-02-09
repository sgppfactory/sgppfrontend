<template>
  <div class="hello">
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

      <b-form @submit="submit" @reset="onReset">
        <b-row>
          <b-col>
            <b-form-group label="Nombres:" label-for="exampleInput1">
              <b-form-input id="exampleInput1"
                            type="text"
                            v-model.trim="form.name"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Apellidos:" label-for="exampleInput2">
              <b-form-input id="exampleInput2"
                            type="text"
                            v-model.trim="form.lastname"
                            required
                            placeholder="Ingresar apellido"
                            v-b-tooltip.click.focus.rightbottom
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Email:" label-for="exampleInput3">
              <b-form-input id="exampleInput3"
                            type="text"
                            required
                            v-model.trim="form.email"
                            placeholder="Ingresar email"
                            v-b-tooltip.click.blur.rightbottom
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Fecha de nacimiento:" label-for="exampleInput3">
              <b-form-input id="exampleInput3"
                            type="date"
                            v-model.trim="form.datenac"
                            placeholder="Seleccionar fecha de nacimiento"
                            >
              </b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono:" label-for="exampleInput4">
              <b-form-input id="exampleInput4"
                            type="text"
                            v-model.trim="form.tel"
                            placeholder="Ingresar un teléfono particular">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Celular:" label-for="exampleInput5">
              <b-form-input id="exampleInput5"
                            type="text"
                            v-model.trim="form.cel"
                            placeholder="Ingresar un teléfono celular">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación o domicilio:" label-for="exampleInput6">
              <b-form-input id="exampleInput6"
                            type="text"
                            v-model.trim="form.location"
                            placeholder="Ingresar un domicilio">
              </b-form-input>
            </b-form-group>

            <gmap-map
              :center="{lat:-34.097695, lng:-59.030265}"
              :zoom="14"
              map-type-id="terrain"
              style="width: 100%; height: 300px"
            ></gmap-map>

          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group>
              <!-- <b-form-checkbox-group> -->
                <b-form-checkbox v-model="form.withuser" value="true">Crear usuario</b-form-checkbox>
              <!-- </b-form-checkbox-group> -->
            </b-form-group>
          </b-col>
          <b-col v-if="form.withuser">
            <b-form-group label="Perfil de usuario:" label-for="exampleInput7">
              <b-form-input id="exampleInput7"
                            type="text"
                            v-model.trim="form.username"
                            placeholder="Ingresar un nombre de uusario">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Crear</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import 'vue-awesome/icons'
import persons from '../apiClients/persons'
import Menu from '@/components/Menu'
import _ from 'underscore'

export default {
  name: 'Persons',
  data () {
    return {
      title: 'Alta de personas',
      dismissSecs: 3,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      showTooltip: false,
      errorMessage: '',
      targetTooltip: '',
      menuComponent: undefined,
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Personas',
        href: '#/persons'
      }, {
        text: 'Alta de persona',
        active: true
      }],
      form: {
        name: '',
        lastname: '',
        email: '',
        tel: '',
        cel: '',
        location: '',
        withuser: false,
        username: ''
      }
    }
  },
  created () {
    this.menuComponent = Menu
    // person.findById(id)
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

      persons.post(_.extend(this.form, params))
      .then((result) => {
        console.log(result)
        if (result.status === 201) {
          this.showAlertSuccess()
        }
      }).catch((error) => {
        this.errorMessage = error
        console.log(error)
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
        withuser: false
      }
    },
    showAlertSuccess () {
      this.dismissCountDown = this.dismissSecs
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
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
