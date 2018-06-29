<template>
  <b-modal :id="idModal" v-model="showDetailsComp" :title="titleHeader">
    <!-- <p class="my-2"> -->
    <ul>
      <li v-for="(value, key) in dataToDisplay" :key="key"><b>{{ key }}</b>: {{ value}}</li>
    </ul>
    <!-- </p> -->
    <div slot="modal-footer" class="w-100 text-right">
     <b-btn size="sm" variant="primary" @click="dataToDisplay={}">
       Aceptar
     </b-btn>
   </div>
  </b-modal>
</template>

<script>
import _ from 'underscore'

export default {
  name: 'Details',
  props: {
    titleHeader: String,
    dataToDisplay: Object,
    idModal: String
  },
  data () {
    return {}
  },
  computed: {
    showDetailsComp: function () {
      return !_.isEmpty(this.dataToDisplay)
    }
  }
}
</script>