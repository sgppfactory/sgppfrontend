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
                <b-badge v-for="value in personsSelected" :id="value.id" pill variant="primary">
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
                                        :serializer="s => s.name"
                                        placeholder="Ingrese una etiqueta"
                                        @hit="selectTag"
                                        @input="searchTag" />
              <!-- </b-input-group> -->
              <div id="tagsSelectedId">
                <b-badge v-for="value in tagsSelected" :id="value.id" pill variant="dark">
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
              <gmap-autocomplete  id="location"
                                  class="form-control"
                                  :value="form.location"
                                  placeholder="Ingresar una ubicación"
                                  @place_changed="setPlace">
                                  <!-- :options="{
                                    bounds: {lat:-34.097695, lng:-59.030265},
                                    strictBounds: true
                                  }" -->
              </gmap-autocomplete>
            </b-form-group>

            <gmap-map
                  :center="{lat:-34.097695, lng:-59.030265}"
                  :zoom="14"
                  map-type-id="terrain"
                  style="width: 100%; height: 300px"
                  ref="mapRef"
            ></gmap-map>
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
import porpose from '@/apiClients/porpose'
import node from '@/apiClients/node'
import tags from '@/apiClients/labels'
import persons from '@/apiClients/persons'
import Menu from '@/components/Menu'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'underscore'
import {formatResponse} from '@/utils/tools.js'

export default {
  name: 'AddPorpose',
  components: {
    'app-menu': Menu,
    'vue-bootstrap-typeahead': VueBootstrapTypeahead
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
      optionsNodes: [],
      personsSelected: [],
      personsSearched: [],
      locationSearched: [],
      searchPerson: '',
      tagsSelected: [],
      searchTags: '',
      tagsSearched: [],
      locationSelected: {}
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
      .then((results) => {
        if (results) {
          this.optionsNodes.push({value: "", text: "Seleccione un Nodo o Estructura"})
          this.optionsNodes = this.optionsNodes.concat(_.map(results.data.message, (item) => {
            return {
              value: item.id,
              text: item.name + (item.description !== '' ? ' - ' + item.description.substr(0, 25) : '')
            }
          }))
        }
        loader.hide()
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
      if (this.$router.params.porposeId) {
        params.id = this.$router.params.porposeId
      }
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
      porpose.post(params)
        .then((result) => {
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
    setPlace (place) {
      if (place) {
        var lat = place.geometry.location.lat()
        var lng = place.geometry.location.lng()

        this.locationSelected = {
          lat: lat,
          lng: lng,
          address: place.formatted_address
        }

        if (lat && lng) {
          this.$refs.mapRef.$mapCreated.then((map) => {
            const position = new google.maps.LatLng(lat, lng);
            const marker = new google.maps.Marker({ 
              position,
              map
            });
            map.panTo({lat: lat, lng: lng})
          })
        }
      }
    },
    selectTag (value) {
      console.log(value)
      if (value) {
        // {id,name}
        this.tagsSelected.push(value)
        this.searchTags = ''
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
          this.tagsSearched = (result.status === 200)
            ? result.data.result
            : [{name: 'Agregar etiqueta: ' + this.searchTags}]
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
</style>
