<template>
  <li class="item" v-show="totalRemove">
    <icon name="asterisk" height="10" v-b-tooltip.hover title="Etapas"/> {{model.order}} {{model.name}}
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
                        v-model.trim="model.name"
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
       <b-btn size="sm" variant="danger" @click="removeStage">
         Eliminar
       </b-btn>
       <b-btn addFormsize="sm" variant="secondary" @click="showDeleteModalStage=false">
         Cancelar
       </b-btn>
     </div>
    </b-modal>
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
import _ from 'underscore'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'

export default {
  name: 'Item',
  props: {
    model: Object
  },
  components: {
    datePicker
  },
  data () {
    return {
      updateStepData: {
        name: '',
        isproject: false,
        dateInit: ''
      },
      showUpdateStage: false,
      showDeleteModalStage: false,
      totalRemove: true
    }
  },
  methods: {
    toggleSteps: function () {
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
    },
    removeStage: function () {
      var loader = this.$loading.show()
      this.showDeleteModal = false
      node.removeStage(this.model.id)
        .then((result) => {
          loader.hide()
          if (result.status === 200) {
            this.showSuccessMsg(result)
            this.totalRemove = false
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
          }
        }).catch((error) => {
          loader.hide()
          this.getErrorMessage(error)
        })
    },
    updateStage: function () {
      this.showDeleteModal = false

      node.updateStage(this.model.id)
        .then((result) => {
          if (result.status === 200) {
            this.showSuccessMsg(result)
          } else {
            this.getErrorMessage('Error al procesar el pedido, intente nuevamente')
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
            }, '')
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
.item {
  line-height: 35px;
}
</style>
