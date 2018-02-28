<template>
  <div class="hello">
    <app-menu></app-menu>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <!-- APPLICATIONS -->
      <div v-show="step.app">
        <b-form @submit="nextApp" @reset="onReset">
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
          <b-button type="submit" variant="primary">Siguiente</b-button>
          <b-button type="reset" variant="danger">Limpiar</b-button>
        </b-form>
      </div>
      <!-- NODES -->
      <div v-show="step.nodes">
        <b-form inline @submit="addNodes" @reset="onReset" class="formnodes">
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
          <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="formNode.iscicle" value="true">
            Nodo ciclo
          </b-form-checkbox>
          <b-button type="submit" variant="primary">Agregar</b-button>
        </b-form>
        <b-table striped hover show-empty 
          :items="nodes" 
          :fields="fields" 
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc" >
          <template slot="HEAD_actions">
            Opciones
          </template>
          <template slot="actions" slot-scope="row">
            <a @click="deleteNode(row.item)" v-b-tooltip.hover title="Borrar Nodo" class="danger">
              <icon name="remove" />
            </a>
          </template>
          <template slot="empty">Sin nodos agregados</template>
        </b-table>
        <b-button @click="nextNode" variant="primary">Siguiente</b-button>
        <b-button type="button" variant="danger">Atrás</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </div>
      <!-- STAGES -->
      <div v-show="step.stage">
        <b-form inline @submit="addStage" @reset="onReset">
          <b-form-group label="Nombre:" label-for="name">
            <b-form-input id="name"
                          type="text"
                          v-model.trim="formStage.name"
                          required
                          placeholder="Ingrese el nombre"
                          v-b-tooltip.click.blur.rightbottom 
                          title="Campo requerido">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Descripción:" label-for="description">
            <b-form-input id="description"
                          type="text"
                          v-model.trim="formStage.description"
                          placeholder="Ingresar descripción">
            </b-form-input>
          </b-form-group>
          <b-button @click="nextStages" variant="primary">Siguiente</b-button>
          <b-button type="button" variant="danger">Atrás</b-button>
          <b-button type="reset" variant="danger">Limpiar</b-button>
        </b-form>
      </div>
      <!-- CONFIRMATIONS -->
       <!-- <b-form @submit="next" @reset="onReset" v-show="stepStage"> -->
       <div v-show="step.confirm">
        <b-row>
          <b-col>

          </b-col>
        </b-row>
        <b-button @click="submit" variant="primary">Confirmar</b-button>
        <b-button type="reset" variant="danger">Cancelar</b-button>
        <b-button type="button" variant="danger">Atrás</b-button>
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

export default {
  name: 'AddStructure',
  components: {
    'app-menu': Menu
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
        {label: 'Opciones', key: 'actions', 'class': 'text-center'}
      ],
      formApp: {
        name: '',
        description: ''
      },
      formNode: {
        name: '',
        description: '',
        iscicle: false
      },
      nodes: [],
      formStage: {
        name: '',
        description: ''
      },
      stages: [],
      step: {
        app: true,
        nodes: false,
        stage: false,
        confirm: false
      },
      sortBy: 'name',
      sortDesc: false
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
    }
  },
  created () {
    localStorage.dataConfig = '{"complete":false}'
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    nextApp (ev) {
      // console.log(ev.srcElement)
      localStorage.dataConfig = _.extend(localStorage.dataConfig, this.formApp)
      this.step.app = false
      this.step.nodes = true
    },
    nextNode (ev) {
      // console.log(ev.srcElement)
      localStorage.dataConfig = _.extend(localStorage.dataConfig, this.formApp)
      this.step.nodes = false
      this.step.stage = true
    },
    addNodes (ev) {
      console.log(ev.srcElement)
      this.nodes.push(this.formNode)
      this.formNode = {
        name: '',
        description: '',
        iscicle: false
      }

    },
    deleteNode (ev, ev2) {
      console.log(ev, ev2)
      // _.search(this.nodes, () => {})
    },
    nextStages (ev) {
      // console.log(ev.srcElement)
      localStorage.dataConfig = _.extend(localStorage.dataConfig, this.formApp)
      
      this.step.stage = false
      this.step.confirm = true
    },
    addStage () {
      console.log(ev.srcElement)
      this.stages.push(this.formStage)
      this.formStage = {
        name: '',
        description: ''
      }
    },
    submit (step) {
      configuration.post(this.form)
    },
    onReset () {
      console.log(ev.srcElement)
      this.formApp = {
        name: '',
        description: ''
      }
    },
    setError (input) {

    },
    extendData () {

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
</style>
