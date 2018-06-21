<template>
  <li>
    <div :class="{bold: isFolder}">
      <a @click="toggle" @dblclick="changeType" v-on:click="open = !open">
        {{model.name}} 
        <span v-if="model.description"><i>({{model.description}})</i></span>
        <span v-if="isFolder" @click="toggle">
          [<icon name="minus" v-show="open" height="10" title="Mostrar menos"/><icon name="plus" v-show="!open" height="10" title="Mostrar más"/>]
        </span>
        <span v-else @click="toggleSteps(model.id)">
          [<icon name="minus" v-show="open" height="10" title="Ocultar etapas"/><icon name="plus" v-show="!open" height="10" title="Mostrar etapas"/>]
        </span>
      </a>
      <span>
      - 
        <a @click.stop="details" v-b-tooltip.hover title="Más información">
          <icon name="info" height="13" />
        </a>
        <a @click="remove" v-b-tooltip.hover v-b-modal.deleteModal title="Eliminar nodo">
          <icon name="remove" height="13" />
        </a>
        <a @click="update" v-b-tooltip.hover title="Modificar nodo">
          <icon name="edit" height="13" />
        </a>
      </span>
    </div>
    <ul v-if="isFolder" v-show="open">
      <item class="item"
        v-for="(child, index) in model.childrens"
        :index="index"
        :key="child.id"
        :model="child">
      </item>
      <li class="item add" @click="toggleAddChild">
        [<icon name="minus" v-show="openAddChild" height="10"/><icon name="plus" v-show="!openAddChild" height="10"/>] Añadir Nodo
      </li>
      <li class="item addForm" v-show="openAddChild">
        <b-form inline>
          <b-form-input id="nodename"
                    type="text"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    v-model.trim="newnode.name"
                    placeholder="Ingresar el nombre del nodo" />
          <b-button type="primary" variant="primary" @click="addChild">
            <icon name="plus" height="10"/> Añadir Nodo
          </b-button>
        </b-form>
      </li>
    </ul>
    <ul v-else v-show="open">
      <li class="item"
        v-for="(step, index) in steps"
        :index="index"
        :key="child.id"
        :model="step">
      </li>
      <li class="item add" @click="toggleAddStage">
        [<icon name="minus" v-show="openAddStage" height="10"/><icon name="plus" v-show="!openAddStage" height="10"/>] Añadir Etapa
      </li>
      <li class="item addStage" v-show="openAddStage">
        <b-form inline>
          <b-form-input id="stepname"
                    type="text"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    v-model.trim="newStep.name"
                    placeholder="Ingresar el nombre de la etapa" />
          <b-button type="primary" variant="primary" @click="addStep">
            <icon name="plus" height="10"/> Añadir Etapa
          </b-button>
        </b-form>
      </li>
    </ul>
  </li>
</template>
<script>
import app from '../apiClients/configuration'
import node from '../apiClients/node'
import Vue from 'vue'

export default {
  name: 'Item',
  props: {
    model: Object
  },
  data () {
    return {
      open: true,
      toRemove: 0,
      newnode: {
        name: ''
      },
      newStep: {
        name: ''
      },
      steps: [],
      openAddChild: false,
      openAddStage: false
    }
  },
  computed: {
    isFolder: function () {
      return this.model &&
        this.model.childrens &&
        this.model.childrens.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    toggleAddChild: function () {
      this.openAddChild = !this.openAddChild
    },
    toggleAddStage: function () {
      this.openAddStage = !this.openAddStage
    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'childrens', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      this.model.childrens.push({
        name: newnode.name
      })
      // node.create(newnode)
      //   .then((result) => {
      //     if (result.status === 200) {
      //       this.model.childrens.push({
      //         name: newnode.name
      //       })
      //     }
      //   }).catch(this.getErrorMessage)
    },
    toggleSteps: function (idNode) {
      node.getStages(idNode)
        .then((result) => {
          if (result.status === 200) {
            this.steps = result.data.message
          }
          // else {

          // }
        }).catch(this.getErrorMessage)
    },
    addStep: function () {

    },
    update: function () {

    },
    details: function (id) {
      app.get(id)
        .then((result) => {
          if (result.status === 200) {
            this.toRemove = 0
          } else {

          }
        }).catch(this.getErrorMessage)
    },
    remove: function (id) {
      app.remove(id)
        .then((result) => {
          // console.log(result)
          if (result.status === 200) {
            this.toRemove = 0
            this.search()
            this.show = false
          }
        }).catch(this.getErrorMessage)
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
  margin: 15px 0;
}
ul {
  /*list-style-type: none;*/
  padding: 0;
}
li {
  /*display: inline-block;*/
  margin: 0 10px;
}
a {
  color: #42b983;
}
.addForm {
  width: 400px;
}
.addStage {
  width: 400px; 
}
</style>
