<template>
  <div>
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h2>{{title}}</h2>
      <b-row class="wizard text-center">
        <b-col sm="3" class="active wizard_step">
          <span class="wizard_step_line"></span>
          <span class="wizard_step_label">Estructura</span>
          <span class="wizard_step_indicator"></span>
        </b-col>
        <b-col sm="3" class="wizard_step" 
          v-bind:class="{active: isActiveNodes}">
          <span class="wizard_step_line"></span>
          <span class="wizard_step_label">Nodos {{levelNode}}</span>
          <span class="wizard_step_indicator"></span>
        </b-col>
        <b-col sm="3" class="wizard_step"
          v-bind:class="{active: isActiveStages}">
          <span class="wizard_step_line"></span>
          <span class="wizard_step_label">Etapas</span>
          <span class="wizard_step_indicator"></span>
        </b-col>
        <b-col sm="3" class="wizard_step"
          v-bind:class="{active: step.confirm}">
          <span class="wizard_step_line"></span>
          <span class="wizard_step_label">Confirmación</span>
          <span class="wizard_step_indicator"></span>
        </b-col>
      </b-row>
      <span class="wizard_arrow" v-bind:style="{left: ubicationArrow}"></span>
      
      <!-- APPLICATIONS -->
      <div class="wizard_content">
        <div v-show="step.app">
          <b-form @submit="nextApp" @reset="onResetApp">
            <b-row>
              <b-col>
                <b-form-group label="Nombre:" label-for="name">
                  <b-form-input id="name"
                                type="text"
                                v-model.trim="formApp.name"
                                required
                                placeholder="Ingrese el nombre"
                                v-b-tooltip.click.blur.rightbottom 
                                title="Campo requerido">
                  </b-form-input>
                </b-form-group>
                <b-form-group label="Descripción:" label-for="description">
                  <b-form-input id="description"
                                type="text"
                                v-model.trim="formApp.description"
                                placeholder="Ingresar descripción">
                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
              <!-- <b-col sm="3"> -->
            <b-button type="submit" variant="primary" :disabled="formApp.name.length === 0">Siguiente</b-button>
            <b-button type="reset" variant="danger">Limpiar</b-button>
              <!-- </b-col>
            </b-row> -->
          </b-form>
        </div>
        <!-- NODES -->
        <div v-show="step.nodes">
          <b-form inline @submit="addNodes" class="formnodes">
            <label class="sr-only" for="nodeName">Nombre</label>
            <b-input id="nodeName"
                    type="text"
                    v-model.trim="formNode.name"
                    required
                    placeholder="Ingrese el nombre"
                    v-b-tooltip.click.blur.rightbottom 
                    class="mb-2 mr-sm-2 mb-sm-0 form-control"
                    title="Campo requerido">
            </b-input>
            <label class="sr-only" for="nodeDescription">Descripción</label>
            <b-input id="nodeDescription"
                    type="text"
                    v-model.trim="formNode.description"
                    placeholder="Ingresar descripción"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-input>
            <b-select id="fatherNode"
                    v-show="haveNodesFathers"
                    v-model="formNode.fatherNode"
                    placeholder="Seleccionar nodo padre"
                    :options="nodesFathers"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-select>
            <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formNode.cicle">
              Nodo ciclo
            </b-form-checkbox>
            <b-input id="amount"
                    type="text"
                    v-show="formNode.cicle"
                    v-model.trim="formNode.amount"
                    placeholder="Ingresar monto"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-input>
            <b-button type="submit" variant="primary">Agregar</b-button>
          </b-form>
          <b-table striped hover show-empty 
            :items="nodesNew" 
            :fields="fields" 
            :sort-by.sync="sortByNodes"
            :sort-desc.sync="sortDescNodes" >
            <template slot="HEAD_actions">
              Opciones
            </template>
            <template slot="cicle" slot-scope="row">
              {{filterBooleanTable(row.item.cicle)}}
            </template>
            <template slot="amount" slot-scope="row">
              {{getAmount(row.item.amount)}}
            </template>
            <template slot="actions" slot-scope="row">
              <a @click="deleteNode(row.item.id)" v-b-tooltip.hover title="Borrar Nodo" class="danger">
                <icon name="remove" />
              </a>
            </template>
            <template slot="empty">Sin nodos agregados</template>
          </b-table>
          <b-button @click="nextNode" variant="primary" :disabled="nodesNew.length === 0">Siguiente</b-button>
          <b-button @click="previousNode" type="button" variant="danger">Atrás</b-button>
          <b-button @click="onResetNode" type="reset" variant="danger">Limpiar</b-button>
        </div>
        <!-- STAGES -->
        <div v-show="step.stage">
          <b-form inline @submit="addStage" class="formnodes" style="position: relative">
            <b-input id="name"
                    type="text"
                    v-model.trim="formStage.name"
                    required
                    placeholder="Ingrese el nombre"
                    v-b-tooltip.click.blur.rightbottom 
                    title="Campo requerido"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-input>
            <date-picker v-model="formStage.dateInit" 
                    required
                    placeholder="Ingresar fecha de comienzo"
                    title="Campo requerido"
                    v-b-tooltip.click.blur.rightbottom 
                    :config="{format: 'DD/MM',useCurrent: false, locale: 'es'}"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control"></date-picker>
            <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formStage.isproject" value="true">
              Tipo proyecto
            </b-form-checkbox>
            <b-button type="submit" variant="primary">Agregar</b-button>
          </b-form>
          <b-table striped hover show-empty 
            :items="stages" 
            :fields="fieldsStage" 
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc" >
            <template slot="HEAD_actions">
              Opciones
            </template>
            <template slot="isproject" slot-scope="row">
              {{filterBooleanTable(row.item.isproject)}}
            </template>
            <template slot="actions" slot-scope="row">
              <a @click="deleteStage(row.item.id)" v-b-tooltip.hover title="Borrar Etapa" class="danger">
                <icon name="remove" />
              </a>
            </template>
            <template slot="empty">Sin etapas agregadas</template>
          </b-table>
          <b-button @click="nextStages" variant="primary" :disabled="stages.length < 2">Siguiente</b-button>
          <b-button @click="previousStage" type="button" variant="danger">Atrás</b-button>
          <b-button @click="onResetStage" variant="danger">Limpiar</b-button>
        </div>
        <!-- CONFIRMATIONS -->
         <!-- <b-form @submit="next" @reset="onReset" v-show="stepStage"> -->
         <div v-show="step.confirm">
          <b-row>
            <b-col>
              <h4>Estructura (Aplicación y Nodos)</h4>
              <!-- <ul> -->
               <div class="structure">
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
                        <span :class="{bold: node.cicle}">
                          {{node.name}}
                        </span> 
                        <span v-if="node.description"><i>
                          ({{node.description.substring(0,50)}})
                        </i></span>
                      </div>
                    </li>
                  </ul>
                </div>
              <!-- </ul> -->
            </b-col>
            <b-col>
              <h4>Etapas</h4>
              <b-table striped hover show-empty 
                :items="stages" 
                :fields="fieldsStage" 
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc" >
                <template slot="isproject" slot-scope="row">
                  {{filterBooleanTable(row.item.isproject)}}
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-button @click="submit" variant="primary">Confirmar</b-button>
          <b-button @click="previousConfirm" type="button" variant="danger">Atrás</b-button>
          <b-button type="reset" variant="danger">Cancelar</b-button>
        </div>
      </div>
      <!-- </b-form> -->
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
// import 'vue-awesome/icons'
import configuration from '../apiClients/configuration'
import Menu from '@/components/Menu'
import _ from 'underscore'
import {formatMoney} from '../utils/tools'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'

var headerStage = [
  {label: 'Orden', key: 'order', sortable: true},
  {label: 'Nombre', key: 'name'},
  {label: 'Fecha de inicio', key: 'dateInit'},
  {label: 'Es proyecto', key: 'isproject'}
]

var optionsStage = {label: 'Opciones', key: 'actions', 'class': 'text-center'}

export default {
  name: 'AddStructure',
  components: {
    'app-menu': Menu,
    datePicker
  },
  data () {
    return {
      title: 'Alta de estructura',
      showTooltip: false,
      errorMessage: '',
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Configuración',
        href: '#/config_system'
      }, {
        text: 'Alta de estructura',
        active: true
      }],
      fields: [
        {label: 'Nombre', key: 'name', sortable: true},
        {label: 'Es ciclo', key: 'cicle', sortable: true},
        {label: 'Descripción', key: 'description'},
        {label: 'Monto', key: 'amount'},
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      fieldsStage: _.clone(headerStage),
      formApp: {
        name: '',
        description: ''
      },
      formNode: {
        id: null,
        name: '',
        description: '',
        cicle: false,
        amount: '',
        level: 0,
        fatherNode: ''
      },
      nodes: [],
      nodesNew: [],
      formStage: {
        name: '',
        dateInit: '',
        isproject: false,
        order: 0
      },
      stages: [],
      step: {
        app: true,
        nodes: false,
        stage: false,
        confirm: false
      },
      sortBy: 'order',
      sortByNodes: 'name',
      sortDesc: false,
      sortDescNodes: false,
      nodesFathers: []
    }
  },
  computed: {
    formClass () {
      return {
        'is-invalid': this.messageError !== ''
      }
    },
    showErrorMsg: function () {
      return this.messageError !== ''
    },
    haveNodesFathers () {
      return this.nodesFathers.length > 0
    },
    isActiveNodes () {
      return this.step.nodes || this.step.stage || this.step.confirm
    },
    isActiveStages () {
      return this.step.stage || this.step.confirm
    },
    levels () {
      var array = []
      for (let x = 0; x <= this.formNode.level; x++) {
        array.push(x)
      }
      return array
    },
    ubicationArrow () {
      let num = 17
      let page = 0
      let offset = 12
      if (this.isActiveNodes) {
        page++
      }
      if (this.isActiveStages) {
        page++
      }
      if (this.step.confirm) {
        page++
      }

      num += (22 * page)
      offset += page
      return 'calc(' + num + '% - ' + offset + 'px)'
    },
    levelNode () {
      return this.formNode.level > 0 ? '(' + (this.formNode.level + 1) + ')' : ''
    }
  },
  created () {
    this.fieldsStage.push(optionsStage)
    // localStorage.dataConfig = '{"complete":false}'
  },
  methods: {
    ubicationTree (level) {
      return (level * 15) + 'px'
    },
    filterBooleanTable (boolean) {
      return boolean ? 'Sí' : 'No'
    },
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    nextApp (ev) {
      this.step.app = false
      this.step.nodes = true
      if (this.nodes.length > 0) {
        this.nodesNew = this.getNodesByLevel(0)
      }
    },
    nextNode (ev) {
      if (this.nodesNew.length === 0) {
        this.$notify({
          group: 'error',
          title: 'Ops!',
          text: 'Debe cargar, al menos, un nodo.',
          type: 'error'
        })
      } else {
        this.nodesFathers = _.map(
          _.filter(this.nodesNew, (item) => {
            return !item.cicle
          }), (item) => {
          return {
            value: item.id,
            text: item.name
          }
        })

        if (this.nodes.length > 0) {
          this.nodes = _.filter(this.nodes, (item) => {
            return item.level !== this.formNode.level
          })
        }

        this.nodes = this.nodes.concat(this.nodesNew)
        this.onResetNode()
        if (!this.haveNodesFathers) {
          this.step.nodes = false
          this.step.stage = true
        } else {
          this.formNode.level++
          this.getNodesByStep()
        }
      }
    },
    addNodes (ev) {
      if (this.haveNodesFathers && this.formNode.level > 0 && !this.formNode.fatherNode) {
        this.$notify({
          group: 'error',
          title: 'Ops!',
          text: 'Debe seleccionar un nodo padre.',
          type: 'error'
        })
      } else {
        let hash = 0
        let char = ''

        if (this.formNode.name.length !== 0) {
            // return hash;
          for (let i = 0; i < this.formNode.name.length; i++) {
            char = this.formNode.name.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash // Convert to 32bit integer
          }
        }
        this.formNode.id = hash
        this.nodesNew.push(_.clone(this.formNode))

        this.formNode = {
          id: null,
          name: '',
          description: '',
          cicle: false,
          amount: '',
          level: this.formNode.level
        }
      }
    },
    deleteNode (hashNode) {
      this.nodesNew = _.filter(this.nodesNew, (item) => {
        return hashNode !== item.id
      })
    },
    nextStages (ev) {
      if (this.stages.length === 0) {
        this.$notify({
          group: 'error',
          title: 'Ops!',
          text: 'Debe cargar, al menos, un nodo.',
          type: 'error'
        })
      } else {
        this.orderNodes()
        this.fieldsStage = _.clone(headerStage)
        this.step.stage = false
        this.step.confirm = true
      }
    },
    addStage () {
      this.formStage.order = this.stages.length + 1
      // this.formStage.dateInit += ('/' + (new Date()).getFullYear())
      // console.log(changeFormatDate(this.formStage.dateInit))
      // this.formStage.dateInit = changeFormatDate(this.formStage.dateInit)
      this.stages.push(_.clone(this.formStage))
      this.formStage = {
        name: '',
        dateInit: '',
        isproject: false,
        order: 0
      }
    },
    orderNodes () {
      if (this.levels.length > 1) {
        let nodesOrder = []
        let groupNodes = _.groupBy(this.nodes, 'level')

        _.each(groupNodes[0], (nodeF) => {
          nodesOrder.push(nodeF)
          if (!nodeF.cicle) {
            nodesOrder = nodesOrder.concat(this.findNodes(groupNodes, nodeF, 1))
          }
        })

        this.nodes = nodesOrder
      }
    },
    findNodes (groupNodes, nodeF, level) {
      var nodesOrder = []

      _.each(groupNodes[level], (nodeC) => {
        if (nodeF.id === nodeC.fatherNode) {
          nodesOrder.push(nodeC)
        }
        if (!nodeC.cicle && (this.levels.length - 1) > level) {
          nodesOrder.concat(this.findNodes(groupNodes, nodeC, level + 1))
        }
      })

      return nodesOrder
    },
    submit (step) {
      var loader = this.$loading.show()

      let data = {
        nodes: this.nodes,
        stages: this.stages,
        appdata: this.formApp
      }

      configuration.create(data)
        .then((result) => {
          if (result.status === 201) {
            this.$notify({
              group: 'success',
              title: 'Ok!',
              text: result.data.message,
              type: 'success'
            })
          }
          loader.hide()
        }).catch((error) => {
          console.log(error)
          loader.hide()

          this.$notify({
            group: 'error',
            title: 'Ops!',
            text: error.data.message,
            type: 'error'
          })
        })
    },
    previousNode () {
      if (this.formNode.level < 1) {
        this.step.app = true
        this.step.nodes = false
      } else {
        this.formNode.level--
        this.getNodesByStep()
      }
    },
    getNodesByStep () {
      if (this.nodes.length > 0) {
        this.nodesNew = this.getNodesByLevel(this.formNode.level)
        // this.nodesNew = _.filter(this.nodes, (item) => {
        //   return item.level === this.formNode.level
        // })
      }

      if (this.haveNodesFathers && this.formNode.level === 0) {
        this.nodesFathers = []
      }
    },
    previousStage () {
      this.step.nodes = true
      this.step.stage = false
      this.getNodesByStep()
    },
    previousConfirm () {
      this.fieldsStage.push(optionsStage)
      this.step.stage = true
      this.step.confirm = false
    },
    onResetApp () {
      this.formApp = {
        name: '',
        description: ''
      }
    },
    onResetNode () {
      this.formNode = {
        id: null,
        name: '',
        description: '',
        cicle: false,
        amount: '',
        level: this.formNode.level,
        fatherNode: ''
      }

      this.nodesNew = []
    },
    onResetStage () {
      this.formStage = {
        name: '',
        dateInit: '',
        isproject: false,
        order: 0
      }

      this.stages = []
    },
    setError (input) {

    },
    isFolder: (childrens) => {
      return childrens && childrens.length
    },
    changeType: () => {
      if (!this.isFolder) {
        this.children = []
        this.open = true
      }
    },
    toggle (ev) {
      // console.log(ev, $(ev.toElement).data())
      if (this.isFolder) {
        $(ev.toElement).parents('div.structure').children('ul').toggle()
      }
    },
    getNodesByLevel (level) {
      return _.filter(this.nodes, (item) => {
        return item.level === level
      })
    },
    getAmount (amount) {
      // console.log(amount, Number(amount))
      return amount && amount !== '' ? formatMoney(amount) : '-'
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
.formnodes {
  margin: 15px 0
}
.wizard {
  margin-bottom: 50px;
}
.wizard_step:not(:first-child) .wizard_step_line {
  position: absolute;
  width: 100%;
  left: -50%;
  bottom: -15px;
  height: 3px;
  background-color: #b9c7d2;
}
.wizard_step_indicator {
  box-sizing: content-box;
  display: block;
  width: 16px;
  height: 16px;
  background-color: #51abe4;
  border-radius: 50%;
  border: 3px solid #fff;
  position: absolute;
  left: 50%;
  margin-left: -10px;
  bottom: -24px;
  z-index: 1;
}
.wizard_step_label {
  color: #98a4af;
  font-weight: 700;
}
.wizard_step.active .wizard_step_indicator, .wizard_step.active:not(:first-child) .wizard_step_line {
  background-color: #6eb165;
}
.wizard_arrow {
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  border: 1px solid #aebac4;
  top: 232px;
  border-top-right-radius: 5px;
  background-color: #fff;
  border-left: none;
  border-bottom: none;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  z-index: 2;
  transition: left .3s;
}
.wizard_content {
  padding-top: 20px;
  /*margin-left: 50px;*/
  /*margin-right: 50px;*/
  border-top: 1px solid #aebac4;
}
icon[name=plus], icon[name=minus] {
  cursor: pointer;
}
li.item {
  display: block;
  padding: 5px;
}
div.itemApp {
  padding: 5px;
}
</style>
