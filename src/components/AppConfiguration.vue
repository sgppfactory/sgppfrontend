<template>
  <div>
    <app-menu></app-menu>
    <!-- <div :is="menuComponent"></div> -->
    <b-container fluid>
      <h1>{{ title }}</h1>
      <b-row>
        <b-col sm="10">
          <i>Estructura de árbol que representa la implementación del sistema</i>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" href="#/addstructure"><icon name="plus" height="12"/> Nueva Estructura</b-button>
        </b-col>
      </b-row>
      <b-row class="container">
        <b-col>
          <ul>
            <li class="item" v-for="node in appTree">
              <div :class="{bold: isFolder(node.children)}">
                <a @click="toggle" @dblclick="changeType">
                  {{node.name}} <span v-if="node.description"><i>({{node.description}})</i></span>
                  <span v-if="isFolder(node.children)">
                    [<icon name="minus" v-show="open" height="10"/><icon name="plus" v-show="close" height="10"/>]
                  </span>
                </a>
                <span>
                - 
                  <a @click.stop="row.toggleDetails" v-b-tooltip.hover title="Más información">
                    <icon name="info" height="13" />
                  </a>
                  <a @click="toRemove=row.item.id" v-b-tooltip.hover v-b-modal.deleteModal title="Eliminar nodo">
                    <icon name="remove" height="13" />
                  </a>
                  <a @click="" v-b-tooltip.hover title="Modificar nodo">
                    <icon name="edit" height="13" />
                  </a>
                </span>
              </div>
              <ul v-show="open" v-if="isFolder(node.children)">
                <li class="item"
                  v-for="child in node.children"
                  :model="child">
                  {{child.name}}
                </li>
                <li class="item add" @click="addChild">
                  <icon name="plus" height="10"/> Añadir Nodo
                </li>
                <li class="item add" addChild>
                  <b-form-input id="nodename"
                            type="text"
                            v-model.trim="newnode.name"
                            placeholder="Ingresar el nombre del nodo" />
                  <b-button type="primary" variant="primary">
                    <icon name="plus" height="10"/> Añadir Nodo
                  </b-button>
                </li>
              </ul>
            </li>
          </ul>
        </b-col>
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
  components: {
    'app-menu': Menu
  },
  name: 'AppConfiguration',
  data () {
    return {
      title: 'Configuración del sistema',
      appTree: [],
      toRemove: 0,
      show: false,
      open: false,
      newnode: {
        name: ''
      }
    }
  },
  computed: {
    close: () => {
      return !this.open
    }
  },
  created () {
    app.buildTree()
      .then((result) => {
        if (result.status === 200) {
          this.appTree = result.data.message
        }
      }).catch((error) => {
        // console.log(error)
        this.$notify({
          group: 'error',
          title: 'Ops!',
          text: error.response.data.msg,
          type: 'error'
        })
        // this.logout()
      })
  },
  methods: {
    isFolder: (childrens) => {
      return childrens &&
        childrens.length
    },
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        this.children = []
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      // this.children.push({
      //   name: 'new stuff'
      // })
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
    deleteNode (id) {
      app.remove(id)
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
/*ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}*/
.item {
  /*cursor: pointer;*/
  line-height: 30px;
  margin: 10px;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
