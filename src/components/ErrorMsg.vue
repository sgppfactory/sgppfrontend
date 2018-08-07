<template>
  <notifications group="success" />
  <notifications group="error" />
</template>

<script>
import _ from 'underscore'

export default {
  name: 'Details',
  props: {
    type: String,
    dataToDisplay: Object
  },
  data () {
    return {}
  },
  computed: {
    message: function () {
      result = this.dataToDisplay.response
      let message = ''
      if (result.status === 404 || result.status === 500) {
        message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
      } else if (result.status === 401) {
        this.logout()
      } else {
        message = result.data.message
        if (_.isArray(message)) {
          message = _.reduce(
            message,
            (memo, msg) => {
              return memo + msg.message + '<br>'
            },'')
        }
      }

      return message
    }
  },
  methods: {
    getErrorMessage (result) {
      this.$notify({
        group: 'error',
        title: 'Ops!',
        text: message,
        type: 'error',
        position: 'bottom right'
      })
    }
  }
}
</script>