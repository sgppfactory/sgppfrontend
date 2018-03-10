<template>
  <div class="hello">
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
          <span class="wizard_step_label">Nodos</span>
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
            <b-button type="submit" variant="primary">Siguiente</b-button>
            <b-button type="reset" variant="danger">Limpiar</b-button>
              <!-- </b-col>
            </b-row> -->
          </b-form>
        </div>
        <!-- NODES -->
        <div v-show="step.nodes">
          <b-form inline @submit="addNodes" @reset="onResetNode" class="formnodes">
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
            <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formNode.iscicle" value="true">
              Nodo ciclo
            </b-form-checkbox>
            <b-input id="amount"
                    type="text"
                    v-show="formNode.iscicle"
                    v-model.trim="formNode.amount"
                    placeholder="Ingresar monto"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-input>
            <b-button type="submit" variant="primary">Agregar</b-button>
          </b-form>
          <b-table striped hover show-empty 
            :items="nodesNew" 
            :fields="fields" 
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc" >
            <template slot="HEAD_actions">
              Opciones
            </template>
            <template slot="iscicle" slot-scope="row">
              {{filterBooleanTable(row.item.iscicle)}}
            </template>
            <template slot="actions" slot-scope="row">
              <a @click="deleteNode(row.item.id)" v-b-tooltip.hover title="Borrar Nodo" class="danger">
                <icon name="remove" />
              </a>
            </template>
            <template slot="empty">Sin nodos agregados</template>
          </b-table>
          <b-button @click="nextNode" variant="primary">Siguiente</b-button>
          <b-button @click="previousNode" type="button" variant="danger">Atrás</b-button>
          <b-button type="reset" variant="danger">Limpiar</b-button>
        </div>
        <!-- STAGES -->
        <div v-show="step.stage">
          <b-form inline @submit="addStage" @reset="onResetStage" class="formnodes" style="position: relative">
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
            <!-- <b-input id="dateInit"
                    type="text"
                    v-model.trim="formStage.dateInit"
                    placeholder="Ingresar fecha de comienzo"
                    class="mb-2 mr-sm-2 mb-sm-0 form-control">
            </b-input> -->
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
          <b-button @click="nextStages" variant="primary">Siguiente</b-button>
          <b-button @click="previousStage" type="button" variant="danger">Atrás</b-button>
          <b-button type="reset" variant="danger">Limpiar</b-button>
        </div>
        <!-- CONFIRMATIONS -->
         <!-- <b-form @submit="next" @reset="onReset" v-show="stepStage"> -->
         <div v-show="step.confirm">
          <b-row>
            <b-col>
              <ul>
                <li class="item" v-for="node in nodes">
                  <div :class="{bold: isFolder(node.children)}">
                    <a @click="toggle" @dblclick="changeType">
                      {{node.name}} <span v-if="node.description"><i>({{node.description}})</i></span>
                      <span v-if="isFolder(node.children)">
                        [<icon name="minus" v-show="open" height="10"/><icon name="plus" v-show="close" height="10"/>]
                      </span>
                    </a>
                  </div>
                  <ul v-show="open" v-if="isFolder(node.children)">
                    <li class="item"
                      v-for="child in node.children"
                      :model="child">
                      {{child.name}}
                    </li>
                  </ul>
                </li>
              </ul>
            </b-col>
          </b-row>
          <b-button @click="submit" variant="primary">Confirmar</b-button>
          <b-button type="reset" variant="danger">Cancelar</b-button>
          <b-button @click="previousConfirm" type="button" variant="danger">Atrás</b-button>
        </div>
      </div>
      <!-- </b-form> -->
    </b-container>
    <notifications group="success" />
    <notifications group="error" />
  </div>
</template>

<script>
import 'vue-awesome/icons'
import configuration from '../apiClients/configuration'
import Menu from '@/components/Menu'
import _ from 'underscore'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'

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
        {label: 'Es ciclo', key: 'iscicle', sortable: true},
        {label: 'Descripción', key: 'description'},
        {label: 'Monto', key: 'amount'},
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      fieldsStage: [
        {label: 'Orden', key: 'order', sortable: true},
        {label: 'Nombre', key: 'name'},
        {label: 'Fecha de inicio', key: 'dateInit'},
        {label: 'Es proyecto', key: 'isproject'},
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      formApp: {
        name: '',
        description: ''
      },
      formNode: {
        id: null,
        name: '',
        description: '',
        iscicle: false,
        amount: '',
        level: 0
      },
      nodes: [],
      nodesNew: [],
      formStage: {
        name: '',
        dateInit: '',
        isproject: '',
        order: 0
      },
      stages: [],
      step: {
        app: true,
        nodes: false,
        stage: false,
        confirm: false
      },
      sortBy: 'name',
      sortDesc: false,
      nodesFathers: []
    }
  },
  computed: {
    formClass: function () {
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
    ubicationArrow () {
      let num = 17
      let page = 0
      let offset = 12
      if(this.isActiveNodes) {
        page++
      }
      if(this.isActiveStages) {
        page++
      }
      if(this.step.confirm) {
        page++
      }

      num += (22 * page)
      offset += page
      return 'calc('+num+'% - '+offset+'px)'
    }
  },
  created () {
    // localStorage.dataConfig = '{"complete":false}'
  },
  methods: {
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
      if(this.nodes.length > 0) {
        this.nodesNew = _.filter(this.nodes, (item) => {
          return item.level === 0
        })
      }
    },
    nextNode (ev) {
      this.nodesFathers = _.map(
        _.filter(this.nodesNew, (item) => {
          return !item.iscicle
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

      this.nodes.concat(this.nodesNew)
      this.onResetNode()

      if (!this.haveNodesFathers) {
        this.step.nodes = false
        this.step.stage = true
      } else {
        this.formNode.level++
        this.getNodesByStep()
      }
    },
    addNodes (ev) {
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
        iscicle: false
      }
    },
    deleteNode (hashNode) {
      this.nodesNew = _.filter(this.nodesNew, (item) => {
        return hashNode !== item.id
      })
    },
    nextStages (ev) {
      this.step.stage = false
      this.step.confirm = true
    },
    addStage () {
      this.formStage.order = this.stages.length + 1

      this.stages.push(_.clone(this.formStage))
      
      this.formStage = {
        name: '',
        dateInit: '',
        isproject: false,
        order: 0
      }
    },
    submit (step) {
      configuration.post(this.form)
    },
    previousNode () {
      if(this.formNode.level < 1) {
        this.step.app = true
        this.step.nodes = false
        // this.nodes = []
      } else {
        this.formNode.level++
        this.getNodesByStep()
      }
    },
    getNodesByStep () {
      if(this.nodes.length > 0) {
        this.nodesNew = _.filter(this.nodes, (item) => {
          return item.level === this.formNode.level
        })
      }
    },
    previousStage () {
      this.step.nodes = true
      this.step.stage = false
      this.nodes = []
    },
    previousConfirm () {
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
        iscicle: false,
        amount: ''
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
      return childrens &&
        childrens.length
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
</style>
