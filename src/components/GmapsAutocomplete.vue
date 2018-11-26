<template>
  <b-form-input   :id="id"
                  ref="gmapAutocomplete"
                  v-model.trim="autocompleteText"
                  :placeholder="placeholder">
  </b-form-input>
</template>

<script>
import GoogleMapsLoader from 'google-maps'

export default {
  name: 'GmapsAutocomplete',
  props: {
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Inserte una ubicación'
    },
    country: {
      type: [String, Array],
      default: null
    },
    geolocationOptions: {
      type: Object,
      default: null
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      locationSelected: {},
      autocomplete: {},
      autocompleteText: ''
    }
  },
  mounted () {
    if (this.defaultValue) {
      this.autocompleteText = this.defaultValue
    }
    var self = this
    GoogleMapsLoader.load(function(google) {
      console.log(google)
      // new google.maps.Map(el, options);
      // TODO: Ver el tema del país por implementación
      if (google.maps) {
        self.autocomplete = new google.maps.places.Autocomplete(
          document.getElementById(self.id),
          {types: ['geocode'], componentRestrictions: {country: self.country}}
        )

        self.autocomplete.addListener('place_changed', self.onPlaceChanged)

        var circle = new google.maps.Circle({
          center: self.geolocationOptions,
          radius: 2
        })
        console.log(circle)
        self.autocomplete.setBounds(circle.getBounds())
      }
    });
  },
  methods: {
    onPlaceChanged() {
      let place = this.autocomplete.getPlace()
      if (!place.geometry) {
        this.$emit('no-results-found', place, this.id)
        return
      }
      this.autocompleteText = document.getElementById(this.id).value
      this.locationSelected = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: this.autocompleteText
      }
      
      this.$emit('placechanged', this.locationSelected)
    }
  }
}
</script>

