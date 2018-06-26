<template>
  <b-modal id="detailsModal" v-model="show" title="Detalle Nodo">
    <p class="my-2">{{message}}</p>
    <div slot="modal-footer" class="w-100 text-right">
     <b-btn size="sm" variant="primary" @click="show=false">
       Aceptar
     </b-btn>
   </div>
  </b-modal>
</template>

<script>
export default {
  name: 'Details',
  props: {
    message: String,
    show: Boolean
  },
  data () {
    return {}
  },
  computed: {
    isFolder: function () {
      return this.model &&
        this.model.childrens &&
        this.model.childrens.length
    }
  },
  methods: {}
}
</script>