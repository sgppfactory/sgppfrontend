<template>
  <div class="login">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="update" @reset="resetForm">
        <b-row>
          <b-col>
            <h3>Cambiar contraseña</h3>
            <b-form-group label="Modifique su contraseña:" label-for="password">
              <b-form-input id="password" 
                            type="password" 
                            v-model.trim="form.password" 
                            placeholder="Modificar Contraseña" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Confirme su nueva contraseña:" label-for="repassword">
              <b-form-input id="repassword" 
                            type="password" 
                            v-model.trim="form.rePassword" 
                            placeholder="Confirmar nueva contraseña" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <h3>Datos personales</h3>
            <b-form-group label="E-mail:" label-for="email">
              <b-form-input id="email" 
                            type="email" 
                            v-model.trim="form.email" 
                            placeholder="Modificar email" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Celular:" label-for="cel">
              <b-form-input id="cel" 
                            type="text" 
                            v-model.trim="form.cel" 
                            placeholder="Agregar teléfono móvil" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Teléfono:" label-for="phone">
              <b-form-input id="phone" 
                            type="text" 
                            v-model.trim="form.phone" 
                            placeholder="Agregar teléfono fijo" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Fecha de nacimiento:" label-for="location">
              <b-form-input id="date_birth" 
                            type="date" 
                            v-model.trim="form.date_birth" 
                            placeholder="Agregar fecha nacimiento" 
                            v-bind:class="formClass">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación o domicilio:" label-for="location">
              <gmaps-autocomplete   id="location"
                                    ref="gmapAutocomplete"
                                    v-model="form.location"
                                    placeholder="Ingresar un domicilio o ubicación"
                                    country="ar"
                                    :geolocationOptions="{lat:-34.097695, lng:-59.030265}"
                                    @placechanged="setPlace">
              </gmaps-autocomplete>
            </b-form-group>

            <gmap-map ref="mapRef"
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
        <b-button type="reset" variant="danger">Cancelar</b-button>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import user from '@/apiClients/auth'
import Menu from '@/components/Menu'
import {formatResponse} from '@/utils/tools.js'
import GmapsAutocomplete from '@/components/GmapsAutocomplete'
import _ from 'underscore'

export default {
  name: 'Login',
  components: {
    'app-menu': Menu,
    'gmaps-autocomplete': GmapsAutocomplete
  },
  data () {
    return {
      title: 'Configuración de usuario',
      errorMessage: '',
      locationSelected: {},
      marker: {},
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
        {label: 'Fecha', key: 'dateHour'}
      ]
    }
  },
  created () {
    var loader = this.$loading.show()
    user.getLogUser()
      .then((response) => {
        loader.hide()
        if (response.data) {
          this.logins = response.data.message
        }
      }).catch((error) => {
        loader.hide()
        this.getErrorMessage(error)
      })
  },
  computed: {
    formClass: function () {
      return {
        'is-invalid': this.errorMessage !== ''
      }
    }
  },
  methods: {
    update (evt) {
      var loader = this.$loading.show()
      evt.preventDefault()
      user.update(this.form)
        .then((response) => {
          loader.hide()
          if (response) {

          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
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
    },
    resetForm () {
      this.$router.push('/home')
    },
    setPlace (place) {
      if (place) {
        var lat = place.lat
        var lng = place.lng

        this.locationSelected = place

        if (lat && lng) {
          this.$refs.mapRef.$mapCreated.then((map) => {
            const position = new google.maps.LatLng(lat, lng)
            // si tiene marcador en el mapa, se lo saco y hago uno nuevo
            if (!_.isEmpty(this.marker)) {
              this.marker.setMap(null)
            }
            this.marker = new google.maps.Marker({ 
              position,
              map
            })
            map.panTo({lat: lat, lng: lng})
          })
        }
      }
    },
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
