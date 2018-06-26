<template>
  <li>
    <div>
      <a @click="toggle" v-on:click="open = !open" :class="{[$style.bold]: isFolder}">
        <span><icon name="mouse-pointer" height="10"/> - {{model.name}}</span> 
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
        <a @click="detailsNode" v-b-tooltip.hover title="Más información">
          <icon name="info" height="13" />
        </a>
        <a @click="showDeleteModal=true" v-b-tooltip.hover title="Eliminar nodo">
          <icon name="remove" height="13" />
        </a>
        <a @click="update" v-b-tooltip.hover title="Modificar nodo">
          <icon name="edit" height="13" />
        </a>
      </span>
      <detail-modal :dataToDisplay="detailNode" :show="showDetailVar"></detail-modal>
      <b-modal v-model="showDeleteModal" title="Eliminar Nodo">
        <p class="my-2">¿Está seguro/a que desea realizar la siguiente acción?</p>
        <div slot="modal-footer" class="w-100 text-right">
         <b-btn size="sm" variant="danger" @click="removeNode">
           Eliminar
         </b-btn>
         <b-btn size="sm" variant="primary" @click="showDeleteModal=false">
           Cancelar
         </b-btn>
       </div>
      </b-modal>
    </div>
    <ul v-if="isFolder" v-show="open">
      <item class="item"
        v-for="(child, index) in model.childrens"
        :index="index"
        :key="child.id"
        :model="child">
      </item>
      <li class="item add" @click="toggleAddChild">
        <icon name="minus" v-show="openAddChild" height="10"/><icon name="plus" v-show="!openAddChild" height="10"/> Añadir Nodo
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
        :key="step.id"
        :model="step">
        {{step.name}}
      </li>
      <li class="item add" @click="toggleAddStage">
        <icon name="minus" v-show="openAddStage" height="10"/><icon name="plus" v-show="!openAddStage" height="10"/> Añadir Etapa
      </li>
      <li class="item addStage" v-show="openAddStage">
        <b-form inline>
          <b-input id="stepname"
                    type="text"
                    v-model.trim="newStep.name"
                    required
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Ingrese el nombre"
                    v-b-tooltip.click.blur.rightbottom 
                    title="Nombre Etapa">
          </b-input>
          <date-picker v-model="newStep.dateInit" 
                    required
                    placeholder="Ingresar fecha de comienzo"
                    title="Campo requerido"
                    v-b-tooltip.click.blur.rightbottom 
                    :config="{format: 'DD/MM',useCurrent: false, locale: 'es'}"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
          </date-picker>
          <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="newStep.isproject" value="true">
            Tipo proyecto
          </b-form-checkbox>
          <b-button type="primary" variant="primary" @click="addStep">
            <icon name="plus" height="10"/> Añadir Etapa
          </b-button>
        </b-form>
      </li>
    </ul>
  </li>
</template>

<style module>
.bold {
  font-weight: bold;
}
</style>

<script>
import app from '../apiClients/configuration'
import node from '../apiClients/node'
import DetailModal from '@/components/Details'
import Vue from 'vue'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'

export default {
  name: 'Item',
  props: {
    model: Object
  },
  components: {
    'detail-modal': DetailModal,
    datePicker
  },
  data () {
    return {
      open: false,
      toRemove: 0,
      newnode: {
        name: ''
      },
      newStep: {
        name: '',
        isproject: false,
        dateInit: ''
      },
      steps: [],
      openAddChild: false,
      openAddStage: false,
      showDetailVar: false,
      detailNode: 'Algo',
      showDeleteModal: false
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
      console.log(idNode)
      node.getStages(idNode)
        .then((result) => {
          if (result.status === 200) {
            this.steps = result.data.message
          }
          console.log(this.steps)
        }).catch(this.getErrorMessage)
    },
    addStep: function () {
      // this.model.stages.push({
      //   name: newnode.name
      // })
    },
    update: function () {

    },
    detailsNode: function () {
      // console.log(this.model.id)
      this.showDetailVar = true
      node.get(this.model.id)
        .then((result) => {
          if (result.status === 200) {
            console.log(result)
          } else {

          }
        }).catch(this.getErrorMessage)
    },
    removeNode: function () {
      node.remove(this.model.id)
        .then((result) => {
          if (result.status === 200) {
            this.modal = {}
            this.showDeleteModal = false
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
  list-style-type: none;
  padding: 0;
}
li {
  /*display: inline-block;*/
  margin: 0 15px;
}
a {
  color: #42b983;
}
/*.addForm {
  width: 400px;
}
.addStage {
  width: 400px; 
}*/
</style>
