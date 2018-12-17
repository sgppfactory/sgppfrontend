<template>
  <div class="login">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="openModal" @reset="resetForm">
        <b-row>
          <b-col>
            <b-card>
              <h4>Cambiar contraseña</h4>
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
            </b-card>
            <b-card class="personal-data">
              <h4>Datos personales</h4>
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
              <b-form-group label="Teléfono:" label-for="tel">
                <b-form-input id="tel" 
                              type="text" 
                              v-model.trim="form.tel" 
                              placeholder="Agregar teléfono fijo" 
                              v-bind:class="formClass">
                </b-form-input>
              </b-form-group>
              <b-form-group label="Fecha de nacimiento:" label-for="dateBirth">
                <b-form-input id="dateBirth" 
                              type="date" 
                              v-model.trim="form.dateBirth" 
                              placeholder="Agregar fecha nacimiento" 
                              v-bind:class="formClass">
                </b-form-input>
              </b-form-group>
            </b-card>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación o domicilio:" label-for="location">
              <gmaps-autocomplete   id="location"
                                    ref="gmapAutocomplete"
                                    placeholder="Ingresar una ubicación"
                                    country="ar"
                                    :defaultValue="form.location"
                                    :geolocationOptions="{lat:-34.097695, lng:-59.030265}"
                                    @placechanged="setPlace">
              </gmaps-autocomplete>
            </b-form-group>
            <gmap-map ref="mapRef"
                      :center="{lat:-34.097695, lng:-59.030265}"
                      :zoom="14"
                      map-type-id="terrain"
                      style="width: 100%; height: 200px">
            </gmap-map>
            <b-card class="last-login">
              <h4>Últimos Ingresos</h4>
              <b-table striped hover :items="logins" :fields="fields">
              </b-table>
            </b-card>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">Modificar</b-button>
        <b-button type="reset" variant="danger">Cancelar</b-button>
      </b-form>
    </b-container>
    <b-modal id="confirmPassModal" v-model="showConfirmPass" title="Cambios en datos personales">
      <p class="my-2">Confirme los cambios en sus datos personales</p>
      <b-form-input id="passConfirmation" 
                    type="password" 
                    v-model.trim="form.passConfirmation" 
                    placeholder="Confirmar Contraseña">
      </b-form-input>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="update">
         Confirmar
       </b-btn>
       <b-btn size="sm" variant="primary" @click="showConfirmPass=false">
         Cancelar
       </b-btn>
     </div>
    </b-modal>
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
        tel: '',
        dateBirth: '',
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
      showConfirmPass: false,
      fields: [
        {label: 'IP', key: 'ip'},
        {label: 'Fecha', key: 'dateHour'}
      ]
    }
  },
  created () {
    var loader = this.$loading.show()

    user.getUserPerson()
      .then(responsePerson => {
        loader.hide()
        // console.log(responsePerson.data)
        if (responsePerson.status === 200) {
          let person = responsePerson.data.message
          this.form.email = person.email
          this.form.tel = person.tel
          this.form.cel = person.cel
          this.form.location = person.location
          this.form.dateBirth = person.dateBirth
        }
      }).catch(error => {
        console.log(error)
        loader.hide()
        this.getErrorMessage(error)
      })

    user.getLogUser()
      .then(response => {
        loader.hide()
        if (response.status === 200) {
          this.logins = _.map(response.data.message, item => {
            let date = new Date(item.dateHour)
            return {
              ip: item.ip,
              dateHour: date.toLocaleString('es-AR')
            }
          })
        }
      }).catch(error => {
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
      evt.preventDefault()
      if (!_.isEmpty(this.form.passConfirmation)) {
        var loader = this.$loading.show()
        user.update(this.form)
          .then((response) => {
            if (response.status === 200) {
              this.$notify({
                group: 'success',
                title: 'Ok!',
                text: response.data.message,
                type: 'success'
              })
              this.showConfirmPass = false
              this.form.passConfirmation = ''
              this.form.password = ''
              this.form.rePassword = ''
            }
            loader.hide()
          }).catch((error) => {
            loader.hide()
            this.getErrorMessage(error)
          })
      } else {
        this.$notify({
          group: 'error',
          title: 'Ops!',
          text: 'Ingrese una contraseña para confirmar!',
          type: 'error',
          position: 'bottom right'
        })
      }
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
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    openModal () {
      this.showConfirmPass = true
      this.form.passConfirmation = ''
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
  .personal-data {
    margin-top: 10px;
  }
  .last-login {
    margin-top: 5px;
  }
</style>
