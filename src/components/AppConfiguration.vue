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
<!--           <div class="structure">
            <div style="font-weight: bold" class="itemApp">
              <a @click="toggle">
                {{formApp.name}} 
                <span v-if="formApp.description"><i>
                  ({{formApp.description.substring(0,50)}})
                </i></span>
                <span v-if="isFolder(nodes)">
                  [<icon name="plus" height="10"/>]
                </span>
              </a>
            </div>
            <ul>
              <li class="item"
                v-for="node in nodes"
                :model="node">
                <div v-bind:style="{'margin-left': ubicationTree(node.level)}">
                  <icon name="angle-right" height="15"/>
                  <span :class="{bold: node.iscicle}">
                    {{node.name}}
                  </span> 
                  <span v-if="node.description"><i>
                    ({{node.description.substring(0,50)}})
                  </i></span>
                </div>
              </li>
            </ul>
          </div> -->
          <ul id="tree">
            <item
              v-if="appTree.length > 0"
              v-for="(app, index) in appTree"
              class="item"
              :model="app">
            </item>
          </ul>

        </b-col>
      </b-row>
      <notifications group="success" />
      <notifications group="error" />
    </b-container>
    <b-modal id="deleteModal" v-model="show" title="Eliminar Nodo">
      <p class="my-2">¿Está seguro/a que desea realizar la siguiente acción?</p>
      <div slot="modal-footer" class="w-100 text-right">
       <b-btn size="sm" variant="danger" @click="deleteNode">
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
import Item from '@/components/Item'

// Vue.component('item', {
//   template: '#item-template',
//   props: {
//     model: Object
//   },
//   data: function () {
//     return {
//       open: false
//     }
//   },
//   computed: {
//     isFolder: function () {
//       return this.model.childrens &&
//         this.model.childrens.length
//     }
//   },
//   methods: {
//     toggle: function () {
//       if (this.isFolder) {
//         this.open = !this.open
//       }
//     },
//     changeType: function () {
//       if (!this.isFolder) {
//         Vue.set(this.model, 'childrens', [])
//         this.addChild()
//         this.open = true
//       }
//     },
//     addChild: function () {

//     }
//   }
// })

export default {
  components: {
    'app-menu': Menu,
    'item': Item
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
  created () {
    app.buildTree()
      .then((result) => {
        if (result.status === 200) {
          this.appTree = result.data.message
          console.log(this.appTree)
        }
      }).catch(this.getErrorMessage)
  },
  methods: {
    // isFolder: (childrens) => {
    //   return childrens &&
    //     childrens.length
    // },
    // toggle (ev) {
    //   if (this.isFolder) {
    //     // this.open = this.close
    //     $(ev.toElement).parents('div.structure').children('ul').toggle()
    //   }
    // },
    // changeType: function () {
    //   if (!this.isFolder) {
    //     this.children = []
    //     this.addChild()
    //     this.open = true
    //   }
    // },
    // addChild: function () {
    //   // this.children.push({
    //   //   name: 'new stuff'
    //   // })
    // },
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
        }).catch(this.getErrorMessage)
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
        }).catch(this.getErrorMessage)
    },
    showDetails (id) {
      app.get(id)
        .then((result) => {
          if (result.status === 200) {
            this.toRemove = 0
          } else {

          }
        }).catch(this.getErrorMessage)
    },
    getErrorMessage (result) {
      let message = ''
      if (result.status === 404 || result.status === 500) {
        message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
      } else if (result.status === 401) {
        this.logout()
      } else {
        message = result.data.message
      }

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
