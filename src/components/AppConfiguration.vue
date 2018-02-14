<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-form inline @submit="search">
        <b-col sm="10">
          <b-input class="mb-2 mr-sm-2 mb-sm-0" id="searchPerson" placeholder="Buscar dentro de la estructura" v-model="searchParam" />
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addperson"><icon name="plus" /> Nueva Estructura</b-button>
        </b-col>
      </b-form>
    </b-container>
    <b-modal id="deleteModal" v-model="show" title="Eliminar Nodo">
      <p class="my-2">¿Está seguro/a que desea realizar la siguiente acción?</p>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deleteNode()">
         Eliminar
       </b-btn>
       <b-btn size="sm" variant="primary" @click="show=false">
         Cancelar
       </b-btn>
     </div>
    </b-modal>
  </div>
  <!-- </div> -->
</template>

<script>
import 'vue-awesome/icons'
import app from '../apiClients/configuration'
import Menu from '@/components/Menu'

export default {
  name: 'AppConfiguration',
  data () {
    return {
      title: 'Configuración del sistema',
      appTree: [],
      menuComponent: undefined,
      toRemove: 0,
      show: false
      // currentPage: 1,
      // searchParam: '',
      // cantPages: 1,
      // cantResults: 1,
      // show: false,
      // isBusy: false,
      // sortBy: 'name',
      // sortDesc: false
    }
  },
  created () {
    this.menuComponent = Menu
    // this.search()
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    buildTree (page) {
      app.getConfig(params)
        .then((result) => {
          this.persons = (result.status === 200)
          ? result.data.result
          : []

          this.cantPages = result.data.pages
          this.cantResults = result.data.total
        }).catch((error) => {
          console.log(error)
          // this.logout()
        })
    },
    deleteNode () {
      app.remove(this.toRemove)
        .then((result) => {
          // console.log(result)
          if (result.status === 200) {
            this.toRemove = 0
            this.search()
            this.show = false
          }
        }).catch((error) => {
          console.log(error)
          // this.logout()
        })
    },
    showDetails (id) {
      app.get(id)
        .then((result) => {
          if (result.status === 200) {
            this.toRemove = 0
            // console.log(result)
          } else {

          }
        }).catch((error) => {
          console.log(error)
          // this.logout()
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
</style>
