<template>
  <b-form-input   :id="id"
                  ref="gmapAutocomplete"
                  v-model.trim="autocompleteText"
                  :placeholder="placeholder">
  </b-form-input>
</template>

<script>
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
    // TODO: Ver el tema del país por implementación
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.id),
      {types: ['geocode'], componentRestrictions: {country: this.country}}
    )

    this.autocomplete.addListener('place_changed', this.onPlaceChanged)

    var circle = new google.maps.Circle({
      center: this.geolocationOptions,
      radius: 2
    })

    this.autocomplete.setBounds( circle.getBounds() )
  },
  methods: {
    onPlaceChanged() {
      let place = this.autocomplete.getPlace();
      if (!place.geometry) {
        this.$emit('no-results-found', place, this.id);
        return;
      }
      this.locationSelected = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address
      }
      this.$emit('placechanged', this.locationSelected);
      this.autocompleteText = document.getElementById(this.id).value
    }
  }
}
</script>

