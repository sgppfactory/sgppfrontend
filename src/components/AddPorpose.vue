<template>
  <div>
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="submit" @reset="onReset">
        <b-row>
          <b-col>
            <b-form-group label="Título:" label-for="name">
              <b-form-input id="name"
                            type="text"
                            v-model.trim="form.title"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Estructura/Nodo:" label-for="idNode">
              <b-form-select id="idnode"
                            v-model="form.idNode"
                            :options="optionsNodes">
              </b-form-select>
            </b-form-group>

            <b-form-group label="Persona/s relacionada/s:" label-for="persons">
              <!-- <b-input-group prepend="search"> -->
              <vue-bootstrap-typeahead :data="personsSearched"
                                        v-model="searchPerson"
                                        :serializer="s => s.lastname + ', ' + s.name + ' - ' + s.email"
                                        placeholder="Ingrese nombre y apellido de una persona"
                                        @hit="selectPerson"
                                        @input="searchPersons" />
              <!-- </b-input-group> -->
              <div id="personsSelectedId">
                <b-badge v-for="value in personsSelected" :id="value.id" :key="value.id" pill variant="primary">
                {{value.lastname}}, {{value.name}} <a @click="deletePerson(value.id)" 
                                                      v-b-tooltip.hover 
                                                      title="No asociar a la persona">
                                                    <icon name="close" height="10"/>
                                                    </a>
                </b-badge>
              </div>
            </b-form-group>

            <b-form-group label="Etiqueta/s relacionada/s:" label-for="tags">
              <!-- <b-input-group prepend="search"> -->
              <vue-bootstrap-typeahead :data="tagsSearched"
                                        v-model.trim="searchTags"
                                        :serializer="s => (s.pretext ? s.pretext : '') + s.name"
                                        placeholder="Ingrese una etiqueta"
                                        @hit="selectTag"
                                        @input="searchTag" />
              <!-- </b-input-group> -->
              <div id="tagsSelectedId">
                <b-badge v-for="value in tagsSelected" :id="value.id" :key="value.id" pill variant="dark">
                {{value.name}} <a @click="deleteTag(value.id)" 
                                    v-b-tooltip.hover 
                                    title="No asociar la etiqueta a la propuesta">
                                    <icon name="close" height="10"/>
                                  </a>
                </b-badge>
              </div>
            </b-form-group>

            <b-form-group label="Monto:" label-for="amount" prepend="$">
              <b-input-group prepend="$">
                <b-form-input id="amount"
                              v-model.trim="form.amount"
                              placeholder="Ingrese el monto en formato XXXX.YY">
                </b-form-input>
              </b-input-group>
            </b-form-group>

            <b-form-group label="Detalles:" label-for="details">
              <b-form-textarea id="details"
                            v-model.trim="form.details"
                            placeholder="Ingrese algún detalle">
              </b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Ubicación:" label-for="location">
              <gmaps-autocomplete   id="location"
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
import porpose from '@/apiClients/porpose'
import node from '@/apiClients/node'
import tags from '@/apiClients/labels'
import persons from '@/apiClients/persons'
import Menu from '@/components/Menu'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'underscore'
import {formatResponse} from '@/utils/tools.js'
import GmapsAutocomplete from '@/components/GmapsAutocomplete'

export default {
  name: 'AddPorpose',
  components: {
    'app-menu': Menu,
    'vue-bootstrap-typeahead': VueBootstrapTypeahead,
    'gmaps-autocomplete': GmapsAutocomplete
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
        href: '#/porposes_projects'
      }],
      form: {
        title: '',
        idNode: '',
        details: '',
        location: '',
        amount: ''
      },
      optionsNodes: [],
      personsSelected: [],
      personsSearched: [],
      searchPerson: '',
      tagsSelected: [],
      searchTags: '',
      tagsSearched: [],
      locationSelected: {},
      toUpdate: false,
      buttonLabel: 'Crear'
    }
  },
  computed: {
    formClass: function () {
      return {
        'is-invalid': this.messageError !== ''
      }
    }
  },
  created () {
    var loader = this.$loading.show()

    node.getChildrens()
      .then(results => {
        if (results) {
          this.optionsNodes.push({value: "", text: "Seleccione un Nodo o Estructura"})
          this.optionsNodes = this.optionsNodes.concat(_.map(results.data.message, (item) => {
            return {
              value: item.id,
              text: item.name + (item.description !== '' ? ' - ' + item.description.substr(0, 25) : '')
            }
          }))
        }

        if (this.$route.query.porposeId) {
          porpose
            .getById(this.$route.query.porposeId)
            .then((result) => {
              loader.hide()
              let porposeR = result.data.message
              let location = JSON.parse(porposeR.location)
              if (location) {
                this.setPlace(location)
              }

              this.form = {
                title: porposeR.title,
                idNode: porposeR.idNode,
                details: porposeR.details,
                location: (location ? location.address : ''),
                amount: (porposeR.amount ? porposeR.amount : '')
              }

              this.personsSelected = porposeR.persons
              this.tagsSelected = porposeR.labels

              this.toUpdate = this.$route.query.porposeId
              this.title = 'Modificación de Propuesta'
              this.buttonLabel = 'Modificar'
              this.bread.push({
                text: 'Modificación de propuesta',
                active: true
              })
            }).catch(err => {
              loader.hide()
              this.getErrorMessage(err)
            })
        } else {
          loader.hide()
          this.bread.push({
            text: 'Alta de propuesta',
            active: true
          })
        }
      }).catch((err) => {
        loader.hide()
        this.getErrorMessage(err)
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
      params.amount = params.amount === '' ? 0 : parseFloat(params.amount)
      params.persons = _.map(this.personsSelected, (pers) => {
        return pers.id
      })
      if (this.tagsSelected.length > 0) {
        params.tags = this.tagsSelected
      }
      if (!_.isEmpty(this.locationSelected)) {
        params.location = this.locationSelected
      }
      if (this.toUpdate) {
        porpose.update(this.toUpdate, params)
          .then((result) => {
            if (result.status === 200) {
              this.getSuccessMessage(result)
            }
            loader.hide()
            this.$route.push('porposes_projects')
          }).catch((error) => {
            loader.hide()
            this.getErrorMessage(error)
          })
      } else {
        porpose.post(params)
          .then((result) => {
            if (result.status === 201) {
              this.getSuccessMessage(result)
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
        title: '',
        idNode: '',
        details: '',
        location: '',
        amount: ''
      }

      this.personsSelected = []
      this.tagsSelected = []
      this.locationSelected = {}
    },
    deletePerson (id) {
      this.personsSelected = _.reject(
        this.personsSelected,
        (obj) => {
          return obj.id === id
        }
      )
    },
    searchPersons () {
      var params = this.searchPerson ? {
        filter: [
          {key: 'name', value: this.searchPerson, operator: 'like', operator_sup: 'OR'},
          {key: 'lastname', value: this.searchPerson, operator: 'like', operator_sup: 'OR'},
          {key: 'email', value: this.searchPerson, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      params.bypage = 5

      persons.getFilter(params)
        .then((result) => {
          this.personsSearched = (result.status === 200)
            ? result.data.result
            : []
        }).catch(err => {
          loader.hide()
          this.getErrorMessage(err)
        })
    },
    selectPerson (value) {
      this.personsSelected.push(value)
      this.searchPerson = ''
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
    getSuccessMessage (msg) {
      this.$notify({
        group: 'success',
        title: 'Ok!',
        text: msg.data.message,
        type: 'success'
      })
    },
    setPlace (place) {
      if (place) {
        var lat = place.lat
        var lng = place.lng

        this.locationSelected = place

        if (lat && lng) {
          this.$refs.mapRef.$mapCreated.then((map) => {
            const position = new google.maps.LatLng(lat, lng)
            const marker = new google.maps.Marker({ 
              position,
              map
            })
            map.panTo({lat: lat, lng: lng})
          })
        }
      }
    },
    selectTag (value) {
      // console.log(value)
      if (value) {
        // {id,name}
        if (value.id > 0) {
          this.tagsSelected.push(value)
          this.searchTags = ''
        } else {
          var loader = this.$loading.show()
          // #343a40 - negro
          // #0056b3 - azul
          tags.create({name: value.name, colour: '#343a40'})
            .then(result => {
              this.tagsSelected.push(value)
              this.searchTags = ''
              this.getSuccessMessage(result)
              loader.hide()
            }).catch(err => {
              loader.hide()
              this.getErrorMessage(err)
            })
        }
      }
    },
    searchTag () {
      var params = this.searchTags ? {
        filter: [
          {key: 'name', value: this.searchTags, operator: 'like', operator_sup: 'OR'}
        ]
      } : {}

      params.bypage = 5

      tags.search(params)
        .then((result) => {
          this.tagsSearched = (result.status === 200) && !_.isEmpty(result.data.result)
            ? result.data.result
            : []

          let isEqual = _.contains(_.map(this.tagsSearched, value => {
            return value.name.toLowerCase()
          }), this.searchTags.toLowerCase())

          if (!isEqual) {
            this.tagsSearched.push({pretext: 'Agregar etiqueta: ', name: this.searchTags, id: 0})
          }
        }).catch(err => {
          loader.hide()
          this.getErrorMessage(err)
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
#personsSelectedId {
  margin-top: 10px;
}
span.badge {
  margin: 5px;
}
</style>
