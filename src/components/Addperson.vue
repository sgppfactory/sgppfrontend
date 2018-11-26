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
                            placeholder="Seleccionar fecha de nacimiento">
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
            <b-form-group label="Perfil de usuario:" label-for="rols">
              <b-form-select id="rols"
                            v-model="form.rol"
                            placeholder="Seleccionar un perfil de usuario"
                            :options="optionsRols">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary">{{buttonLabel}}</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import persons from '@/apiClients/persons'
import rol from '@/apiClients/rol'
import Menu from '@/components/Menu'
import _ from 'underscore'
import {formatResponse} from '../utils/tools.js'
import GmapsAutocomplete from '@/components/GmapsAutocomplete'

export default {
  name: 'Addperson',
  components: {
    'app-menu': Menu,
    'gmaps-autocomplete': GmapsAutocomplete
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
      }],
      form: {
        name: '',
        lastname: '',
        email: '',
        tel: '',
        cel: '',
        location: '',
        withuser: false,
        rol: '',
        datenac: ''
      },
      optionsRols: [],
      locationSelected: {},
      toUpdate: false,
      buttonLabel: 'Crear',
      marker: {}
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
    var loader = this.$loading.show()
    var self = this
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

          if (self.$route.query.personId) {
            persons
              .getById(self.$route.query.personId)
              .then((result) => {
                loader.hide()
                let person = result.data.message
                let withuser = !_.isNull(person.username)
                self.form = {
                  name: person.name,
                  lastname: person.lastname,
                  email: person.email,
                  tel: person.tel,
                  cel: person.cel,
                  location: person.location,
                  datenac: person.dateBirth,
                  withuser: withuser,
                  rol: person.idRol
                }

                this.title = 'Modificación de Persona'
                this.toUpdate = this.$route.query.personId
                this.buttonLabel = 'Modificar'
                this.bread.push({
                  text: 'Modificación de persona',
                  active: true
                })
              })

          } else {
            loader.hide()
            this.bread.push({
              text: 'Alta de persona',
              active: true
            })
          }
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
    submit (evt) {
      evt.preventDefault()
      var loader = this.$loading.show()
      let params = _.clone(this.form)
      if (this.$route.params.personId) {
        params.id = this.$route.params.personId
      }

      if (!_.isEmpty(this.locationSelected)) {
        params.location = this.locationSelected
      }

      if (this.toUpdate) {
        persons.update(this.toUpdate, params)
          .then((result) => {
            if (result.status === 200) {
              this.$notify({
                group: 'success',
                title: 'Ok!',
                text: result.data.message,
                type: 'success'
              })
            }
            loader.hide()
            this.$route.push('persons')
          }).catch((error) => {
            loader.hide()
            this.getErrorMessage(error)
          })
      } else {
        persons.post(params)
          .then((result) => {
            // console.log(result)
            if (result.status === 201) {
              this.$notify({
                group: 'success',
                title: 'Ok!',
                text: result.data.message,
                type: 'success'
              })
              this.onReset()
            }
            loader.hide()
          }).catch((error) => {
            loader.hide()
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
