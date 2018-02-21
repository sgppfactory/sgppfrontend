<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <b-container fluid>
      <h1>{{ title }}</h1>
        <b-col sm="10">
          <b-button variant="primary" href="#/addperson"><icon name="plus" /> Nueva Estructura</b-button>
        </b-col>
        <b-col sm="2">
        </b-col>
      <b-row>
        <li>
        <div
          :class="{bold: isFolder}"
          @click="toggle"
          @dblclick="changeType">
          {{model.name}}
          <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
          <item
            class="item"
            v-for="model in model.children"
            :model="model">
          </item>
          <li class="add" @click="addChild">+</li>
        </ul>
      </li>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
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
      // appTree: [],
      children: [
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            {
              name: 'child folder',
              children: [
                { name: 'hello' },
                { name: 'wat' }
              ]
            },
            { name: 'hello' },
            { name: 'wat' },
            {
              name: 'child folder',
              children: [
                { name: 'hello' },
                { name: 'wat' }
              ]
            }
          ]
        }
      ],
      menuComponent: undefined,
      toRemove: 0,
      show: false ,
      open: false
    }
  },
  computed: {
    isFolder: function () {
      return this.children &&
        this.children.length
    }
  },
  created () {
    this.menuComponent = Menu
    // this.search()
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      this.children.push({
        name: 'new stuff'
      })
    },
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    buildTree (params) {
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
