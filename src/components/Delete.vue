<template>
  <b-modal id="deleteModal" v-model="show" title="Eliminar Nodo">
    <p class="my-2">¿Está seguro/a que desea realizar la siguiente acción?</p>
    <div slot="modal-footer" class="w-100 text-right">
     <b-btn size="sm" variant="danger" @click="remove">
       Eliminar
     </b-btn>
     <b-btn size="sm" variant="primary" @click="show=false">
       Cancelar
     </b-btn>
   </div>
  </b-modal>
</template>