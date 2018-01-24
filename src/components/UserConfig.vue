<template>
  <div class="login">
    <div align="center" class="title-login">
      <h1>{{message}}</h1>
    </div>
    <div id="form-login">
      <b-form @submit="login">
        <b-form-group>
          <b-form-input id="user" type="text" v-model="username" required placeholder="Nombre de usuario o email" v-bind:class="formClass">
          </b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input id="password" type="password" v-model="password" required placeholder="Contraseña" v-bind:class="formClass">
          </b-form-input>
        </b-form-group>
        <b-alert variant="danger" :show="showErrorMsg">
          <b>{{messageError}}</b>
        </b-alert>
        <b-button type="submit" variant="primary">Ingresar</b-button>
      </b-form>
    </div>
  </div>
</template>
<!--   <div align="center">
    <img src="static/loading.gif" border="0">
  </div> -->

<script>
import auth from '../apiClients/auth'
export default {
  name: 'Login',
  data () {
    return {
      message: '¡Bienvenidos al SGPP!',
      messageError: '',
      username: '',
      password: ''
    }
  },
  computed: {
    formClass: function () {
      return {
        'is-invalid': this.messageError !== ''
        // 'form-group': true,
        // 'form-group-lg': true
      }
    },
    showErrorMsg: function () {
      return this.messageError !== ''
    }
  },
  methods: {
    update (evt) {
      evt.preventDefault()
      auth.login(this.username, this.password).then((response) => {
        this.messageError = ''
        localStorage.jwt = response.data.jwt
        this.$router.push('home')
      }).catch((error) => {
        console.log(error)
        if (error.response) {
          this.messageError = error.response.data.msg
        } else {
          this.messageError = 'Error indefinido'
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
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
  .login {
    width: 50%;
    margin-left: 25%;
  }
  .title-login {
    margin-bottom: 70px;
  }
</style>
