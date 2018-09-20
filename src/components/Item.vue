<template>
  <li v-show="totalRemove">
    <div>
      <a @click="toggle" v-on:click="open = !open" :class="{[$style.bold]: isFolder}">
        <span><icon name="mouse-pointer" height="10"/> - {{model.name}}</span> 
        <span v-if="model.description"><i>({{model.description}})</i></span>
        <span v-if="isFolder" @click="toggle">
          [<icon name="minus" v-show="open" v-b-tooltip.hover height="10" title="Ocultar nodos"/><icon name="plus" v-show="!open" height="10" v-b-tooltip.hover title="Mostrar nodos hijos"/>]
        </span>
        <span v-else @click="toggleSteps(model.id)">
          [<icon name="minus" v-show="open" height="10" v-b-tooltip.hover title="Ocultar etapas"/><icon name="plus" v-show="!open" height="10" v-b-tooltip.hover title="Mostrar etapas"/>]
        </span>
      </a>
      <span> | 
        <a @click="detailsNode" v-b-tooltip.hover title="Más información" v-b-modal="detailName">
          <icon name="info" height="13" />
        </a>
        <a @click="showDeleteModal=true" v-b-tooltip.hover title="Eliminar nodo">
          <icon name="remove" height="13" />
        </a>
        <a @click="showUpdate" v-b-tooltip.hover title="Modificar nodo">
          <icon name="edit" height="13" />
        </a>
      </span>
      <detail-modal :dataToDisplay="detailNode" 
                    :titleHeader='"Detalle Nodo"' 
                    :idModal="detailName"></detail-modal>
      <!-- BAJA DE NODO -->
      <b-modal v-model="showDeleteModal" title="Eliminar Nodo">
        <p class="my-1">Va a eliminar el nodo "{{model.name}}".</p>
        <p class="my-1">¿Está seguro/a que desea realizar la siguiente acción?</p>
        <div slot="modal-footer" class="w-100 text-right">
         <b-btn size="sm" variant="danger" @click="removeNode">
           Eliminar
         </b-btn>
         <b-btn size="sm" variant="secondary" @click="showDeleteModal=false">
           Cancelar
         </b-btn>
       </div>
      </b-modal>
      <!-- Modificar NODO -->
      <b-modal v-model="showUpdateNode" title="Modificar Nodo">
        <b-form>
          <b-form-group label="Nombre:" label-for="name">
            <b-form-input id="name"
                          type="text"
                          v-model.trim="updateNodeData.name"
                          required
                          placeholder="Ingrese el nombre"
                          v-b-tooltip.click.blur.rightbottom 
                          title="Campo requerido">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Descripción:" label-for="name">
            <b-form-input id="description"
                          type="text"
                          v-model.trim="updateNodeData.description"
                          placeholder="Ingrese la Descripción">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Monto:" label-for="name">
            <b-form-input id="amount"
                          type="text"
                          v-model.trim="updateNodeData.amount"
                          placeholder="Ingrese el monto">
            </b-form-input>
          </b-form-group>
        </b-form>
        <div slot="modal-footer" class="w-100 text-right">
         <b-btn size="sm" variant="primary" @click="updateNode">
           Modificar
         </b-btn>
         <b-btn size="sm" variant="secondary" @click="showUpdateNode=false">
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
      <!-- AGREGAR NODO - FORMULARIO -->
      <li class="item add">
        <b-row>
          <b-col cols="1">
            <b-button type="primary" size="sm" variant="outline-success" @click="toggleAddChild">
              <icon name="minus" v-show="openAddChild" height="10"/><icon name="plus" v-show="!openAddChild" height="10"/> <span v-show="!openAddChild">Añadir Nodo</span><span v-show="openAddChild"> >> </span>
            </b-button>
          </b-col>
          <b-col cols="11">
            <b-form inline v-show="openAddChild">
              <b-form-input id="nodename"
                        type="text"
                        size="sm" 
                        class="mb-2 mr-sm-2 mb-sm-0"
                        v-model.trim="newnode.name"
                        required
                        placeholder="Nombre del nodo" />
              <b-form-checkbox size="sm" class="mb-2 mr-sm-2 mb-sm-0" v-model="newnode.cicle" value="true">
                Tipo Ciclo
              </b-form-checkbox>
              <b-form-input id="amountnode"
                        type="text"
                        size="sm" 
                        class="mb-2 mr-sm-2 mb-sm-0"
                        v-model.trim="newnode.amount"
                        v-show="newnode.cicle"
                        placeholder="Monto" />
              <b-button type="primary" size="sm" variant="primary" @click="addChild">
                <icon name="plus" height="10"/> Añadir Nodo
              </b-button>
            </b-form>
          </b-col>
        </b-row>
      </li>
    </ul>
    <ul v-else v-show="open">
      <item-stage v-for="(step, index) in steps"
        :index="index"
        :key="step.id"
        :model="step"></item-stage>
        <!-- ALTA ETAPA -->
      <li class="item add">
        <b-row>
          <b-col cols="1">
            <b-button type="primary" 
                      size="sm" 
                      variant="outline-success" 
                      @click="toggleAddStage">
              <icon name="minus" v-show="openAddStage" height="10"/><icon name="plus" v-show="!openAddStage" height="10"/> <span v-show="!openAddStage">Añadir Etapa</span><span v-show="openAddStage"> >> </span>
            </b-button>
          </b-col>
          <b-col cols="11">
            <b-form inline v-show="openAddStage">
              <b-input id="stepname"
                        type="text"
                        size="sm"
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
                        class="mb-2 mr-sm-2 mb-sm-0 form-control form-control-sm">
              </date-picker>
              <b-form-checkbox size="sm" 
                              class="mb-2 mr-sm-2 mb-sm-0" 
                              v-model="newStep.isproject" 
                              value="true">
                Tipo proyecto
              </b-form-checkbox>
              <b-button type="primary" size="sm" variant="primary" @click="addStep">
                <icon name="plus" height="10"/> Añadir Etapa
              </b-button>
            </b-form>
          </b-col>
        </b-row>
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
import node from '../apiClients/node'
import DetailModal from '@/components/Details'
import ItemStage from '@/components/ItemStage'
import Vue from 'vue'
import _ from 'underscore'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import {formatResponse} from '../utils/tools.js'

export default {
  name: 'Item',
  props: {
    model: Object
  },
  components: {
    'detail-modal': DetailModal,
    'item-stage': ItemStage,
    datePicker
  },
  data () {
    return {
      open: false,
      newnode: {
        name: '',
        cicle: false,
        amount: ''
      },
      newStep: {
        name: '',
        isproject: false,
        dateInit: ''
      },
      updateNodeData: {
        name: '',
        description: '',
        cicle: false,
        amount: ''
      },
      steps: [],
      openAddChild: false,
      openAddStage: false,
      detailNode: {},
      showDeleteModal: false,
      showUpdateNode: false,
      totalRemove: true
    }
  },
  computed: {
    isFolder: function () {
      return this.model &&
        this.model.childrens &&
        this.model.childrens.length
    },
    detailName: function () {
      return this.model ? this.model.name.toLowerCase().replace(' ', '-') : ''
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
      var loader = this.$loading.show()
      var newnode = _.extend(_.clone(this.newnode), {idParentNode: this.model.id})
      newnode.amount = parseFloat(newnode.amount)
      node.create(newnode)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.model.childrens.push(newnode)

            this.showSuccessMsg(result)
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    toggleSteps: function () {
      if (!this.open) {
        var loader = this.$loading.show()
        node.getStages(this.model.id)
          .then((result) => {
            loader.hide()
            if (result.status === 200) {
              this.steps = result.data.message
            }
          }).catch((error) => {
            loader.hide()
            this.getErrorMessage(error)
          })
      }
    },
    addStep: function () {
      var loader = this.$loading.show()
      var params = _.clone(this.newStep)
      params.idNode = this.model.id
      node.createStages(params)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.steps.push({
              name: params.name,
              dateInit: params.dateInit,
              isProject: params.isproject,
              id: result.data.id
            })
            this.showSuccessMsg(result)
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    updateNode: function () {
      var loader = this.$loading.show()
      // this.showDeleteModal = false
      let params = _.clone(this.updateNodeData)
      params.amount = params.amount === '' ? 0 : parseFloat(params.amount)
      node.update(this.model.id, params)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.model = {
              name: this.updateNodeData.name,
              description: this.updateNodeData.description,
              cicle: this.updateNodeData.cicle,
              amount: this.updateNodeData.amount
            }
            // this.modal = {}
            this.showSuccessMsg(result)
            this.showUpdateNode = false
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    detailsNode: function () {
      var loader = this.$loading.show()

      node.get(this.model.id)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.detailNode = result.data.message
            // this.showDetailVar = true
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    removeNode: function () {
      this.showDeleteModal = false
      node.remove(this.model.id)
        .then((result) => {
          if (result.status === 200) {
            this.showSuccessMsg(result)
            this.totalRemove = false
          }
        }).catch(this.getErrorMessage)
    },
    getErrorMessage (result) {
      formatResponse(result, (err) => {
        if (err === 'logout') {
          this.logout()
        } else {
          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: err,
            type: 'error',
            position: 'bottom right'
          })
        }
      })
    },
    showSuccessMsg (result) {
      this.$notify({
        group: 'success',
        title: 'Éxito!',
        text: result.data.message,
        type: 'success'
      })
    },
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    showUpdate () {
      this.updateNodeData = {
        name: this.model.name,
        description: this.model.description,
        cicle: this.model.cicle,
        amount: this.model.amount
      }

      this.showUpdateNode = true
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
  cursor: pointer;
}
.addForm {
  margin: 5px;
  /*width: 400px;*/
}
.addStage {
  margin: 5px;
  /*width: 400px; */
}
.item {
  line-height: 35px;
}
</style>
