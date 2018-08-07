<template>
  <li>
    <div>
      <notifications group="success" />
      <notifications group="error" />
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
        <a @click="showUpdateNode=true" v-b-tooltip.hover title="Modificar nodo">
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
                          v-model.trim="model.name"
                          required
                          placeholder="Ingrese el nombre"
                          v-b-tooltip.click.blur.rightbottom 
                          title="Campo requerido">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Descripción:" label-for="name">
            <b-form-input id="description"
                          type="text"
                          v-model.trim="model.description"
                          placeholder="Ingrese la Descripción">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Monto:" label-for="name">
            <b-form-input id="amount"
                          type="text"
                          v-model.trim="model.amount"
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
      <li class="item"
        v-for="(step, index) in steps"
        :index="index"
        :key="step.id"
        :model="step">
        <icon name="asterisk" height="10" v-b-tooltip.hover title="Etapas"/> {{step.order}} {{step.name}}
        <span> | 
          <a @click="showDeleteModalStage=true" v-b-tooltip.hover title="Eliminar etapa">
            <icon name="remove" height="13" />
          </a>
          <a @click="showUpdateStage=true" v-b-tooltip.hover title="Modificar etapa">
            <icon name="edit" height="13" />
          </a>
        </span>
        <!-- MODIFICACION DE ETAPA -->
        <b-modal v-model="showUpdateStage" title="Modificar Etapa">
          <b-form>
            <b-form-group label="Nombre:" label-for="name">
              <b-form-input id="name"
                            type="text"
                            v-model.trim="step.name"
                            required
                            placeholder="Ingrese el nombre"
                            v-b-tooltip.click.blur.rightbottom 
                            title="Campo requerido">
              </b-form-input>
            </b-form-group>
          </b-form>
          <div slot="modal-footer" class="w-100 text-right">
           <b-btn size="sm" variant="primary" @click="updateStage">
             Modificar
           </b-btn>
           <b-btn size="sm" variant="secondary" @click="showUpdateStage=false">
             Cancelar
           </b-btn>
         </div>
        </b-modal>
        <!-- BAJA DE ETAPA -->
        <b-modal v-model="showDeleteModalStage" title="Eliminar Nodo">
          <p class="my-1">Va a eliminar la etapa "{{model.name}}".</p>
          <p class="my-1">¿Está seguro/a que desea realizar la siguiente acción?</p>
          <div slot="modal-footer" class="w-100 text-right">
           <b-btn size="sm" variant="danger" @click="removeNode">
             Eliminar
           </b-btn>
           <b-btn addFormsize="sm" variant="secondary" @click="showDeleteModal=false">
             Cancelar
           </b-btn>
         </div>
        </b-modal>
      </li>
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
// import app from '../apiClients/configuration'
import node from '../apiClients/node'
import DetailModal from '@/components/Details'
import Vue from 'vue'
import _ from 'underscore'
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
        name: '',
        cicle: false,
        amount: 0
      },
      newStep: {
        name: '',
        isproject: false,
        dateInit: ''
      },
      updateStepData: {
        name: '',
        isproject: false,
        dateInit: ''
      },
      updateNodeData: {
        name: '',
        cicle: false,
        amount: 0
      },
      steps: [],
      openAddChild: false,
      openAddStage: false,
      // showDetailVar: false,
      detailNode: {},
      showDeleteModal: false,
      showUpdateNode: false,
      showUpdateStage: false,
      showDeleteModalStage: false
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
      // console.log(this.showDetailVar)
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
      var loader = this.$loading.show();
      var newnode = _.extend(this.newnode, {idParentNode: this.model.id})
      node.create(newnode)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.model.childrens.push(newnode)
            this.$notify({
              group: 'success',
              title: 'Éxito!',
              text: result.data.message,
              type: 'success'
            })
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    toggleSteps: function () {
      var loader = this.$loading.show();
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
    },
    addStep: function () {
      var loader = this.$loading.show();
      this.newStep.idNode = this.model.id
      node.createStages(this.newStep)
        .then((result) => {
          loader.hide()
          if (result.status === 201) {
            this.model.stages.push({
              name: newnode.name
            , dateInit: newnode.dateInit
            , id: result.data.id
            })
            this.$notify({
              group: 'success',
              title: 'Éxito!',
              text: result.data.message,
              type: 'success'
            })
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    updateNode: function () {
      // this.showDeleteModal = false
      node.update(this.model.id, this.updateNodeData)
        .then((result) => {
          if (result.status === 200) {
            this.modal = {}
            this.$notify({
              group: 'error',
              title: 'Ops!',
              text: 'Debe cargar, al menos, un nodo.',
              type: 'error'
            })
          }
        }).catch(this.getErrorMessage)
    },
    detailsNode: function () {
      var loader = this.$loading.show();

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
            this.modal = {}
            this.$notify({
              group: 'error',
              title: 'Ops!',
              text: 'Debe cargar, al menos, un nodo.',
              type: 'error'
            })
          }
        }).catch(this.getErrorMessage)
    },
    updateStage: function () {
      this.showDeleteModal = false
      node.updateStage(this.model.id)
        .then((result) => {
          if (result.status === 200) {
            this.modal = {}
            this.$notify({
              group: 'error',
              title: 'Ops!',
              text: 'Debe cargar, al menos, un nodo.',
              type: 'error'
            })
          }
        }).catch(this.getErrorMessage)
    },
    getErrorMessage (result) {
      result = result.response
      let message = ''
      if (result.status === 404 || result.status === 500) {
        message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
      } else if (result.status === 401) {
        this.logout()
      } else {
        message = result.data.message
        if (_.isArray(message)) {
          message = _.reduce(
            message,
            (memo, msg) => {
              return memo + msg.message + '<br>'
            },'')
        }
      }

      this.$notify({
        group: 'error',
        title: 'Ops!',
        text: message,
        type: 'error',
        position: 'bottom right'
      })
    },
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
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
