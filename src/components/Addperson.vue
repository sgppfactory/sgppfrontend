<template>
  <div class="hello">
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
            <b-form-group label="Apellidos:" label-for="lastname">
              <b-form-input id="lastname"
                            type="text"
                            v-model.trim="form.lastname"
                            required
                            placeholder="Ingresar apellido"
                            v-b-tooltip.click.focus.rightbottom
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Email:" label-for="email">
              <b-form-input id="email"
                            type="text"
                            required
                            v-model.trim="form.email"
                            placeholder="Ingresar email"
                            v-b-tooltip.click.blur.rightbottom
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Fecha de nacimiento:" label-for="date_birth">
              <b-form-input id="date_birth"
                            type="date"
                            v-model.trim="form.datenac"
                            placeholder="Seleccionar fecha de nacimiento"
                            >
              </b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono:" label-for="tel">
              <b-form-input id="tel"
                            type="text"
                            v-model.trim="form.tel"
                            placeholder="Ingresar un teléfono particular">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Celular:" label-for="cel">
              <b-form-input id="cel"
                            type="text"
                            v-model.trim="form.cel"
                            placeholder="Ingresar un teléfono celular">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación o domicilio:" label-for="location">
              <b-form-input id="location"
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
              <b-form-select id="exampleInput7"
                            v-model="form.rol"
                            placeholder="Seleccionar un perfil de usuario"
                            :options="optionsRols">
              </b-form-select>
            </b-form-group>
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
import persons from '../apiClients/persons'
import rol from '../apiClients/rol'
import Menu from '@/components/Menu'
import _ from 'underscore'

export default {
  name: 'Addperson',
  components: {
    'app-menu': Menu
  },
  data () {
    return {
      title: 'Alta de personas',
      showTooltip: false,
      errorMessage: '',
      targetTooltip: '',
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
        rol: ''
      },
      optionsRols: []
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
    rol.get()
      .then((rolData) => {
        rolData = rolData.data.message
        if (rolData) {
          this.optionsRols = _.map(rolData, (item) => {
            return {
              value: item.id,
              text: item.name
            }
          })
        }
      }).catch(() => {
        this.logout()
      })
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
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
              // position: 'bottom right'
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
