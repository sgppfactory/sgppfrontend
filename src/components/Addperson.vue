<template>
  <div class="hello">
    <div :is="menuComponent"></div>
    <b-breadcrumb :items="bread"/>
    <b-container>
      <h1>{{title}}</h1>
      <b-form @submit="submit" @reset="onReset">
        <b-form-group label="Nombre:" label-for="exampleInput1">
          <b-form-input id="exampleInput1"
                        type="text"
                        v-model="form.name"
                        required
                        placeholder="Ingrese el nombre">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Apellido:" label-for="exampleInput2">
          <b-form-input id="exampleInput2"
                        type="text"
                        v-model="form.lastname"
                        required
                        placeholder="Ingresar apellido">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Email *:" label-for="exampleInput3">
          <b-form-input id="exampleInput3"
                        type="text"
                        required
                        v-model="form.email"
                        placeholder="Ingresar email">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Teléfono:" label-for="exampleInput4">
          <b-form-input id="exampleInput4"
                        type="text"
                        v-model="form.tel"
                        placeholder="Ingresar un teléfono particular">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Celular:" label-for="exampleInput5">
          <b-form-input id="exampleInput5"
                        type="text"
                        v-model="form.cel"
                        placeholder="Ingresar un teléfono celular">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Ubicación o domicilio:" label-for="exampleInput6">
          <b-form-input id="exampleInput6"
                        type="text"
                        v-model="form.location"
                        placeholder="Ingresar un domicilio">
          </b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox-group v-model="form.user">
            <b-form-checkbox value="true">Crear usuario</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Crear</b-button>
        <b-button type="reset" variant="danger">Limpiar</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import 'vue-awesome/icons'
import persons from '../apiClients/persons'
import Menu from '@/components/Menu'
export default {
  name: 'Persons',
  data () {
    return {
      title: 'Alta de personas',
      menuComponent: undefined,
      bread: [{
        text: 'Inicio',
        href: '#/home'
      }, {
        text: 'Personas',
        href: '#/persons'
      }, {
        text: 'Alta de persona',
        active: true
      }],
      form: {
        name: '',
        lastname: '',
        email: '',
        tel: '',
        cel: '',
        location: '',
        user: false
      }
    }
  },
  created () {
    this.menuComponent = Menu
  },
  methods: {
    logout () {
      localStorage.jwt = ''
      this.$router.push('login')
    },
    submit (id) {
      let params = {}
      if (id) {
        params.id = id
      }

      persons.post(params)
      .then((result) => {
        console.log(result)
        this.persons = (result.status === 200)
        ? result.data.result
        : []
      }).catch((error) => {
        console.log(error)
        // this.logout()
      })
    },
    onReset () {
      this.form = {
        name: '',
        lastname: '',
        email: '',
        tel: '',
        cel: '',
        location: ''
      }
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
a {
  color: #42b983;
}
</style>
