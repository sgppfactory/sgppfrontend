<template>
  <div class="login">
    <div align="center" class="title-login">
      <h1>{{message}}</h1>
    </div>
    <div id="form-login" @submit="login()">
      <form>
        <div v-bind:class="formClass">
          <!-- <label for="InputUser">Nombre de usuario o email</label> -->
          <input type="text" class="form-control" id="user" placeholder="Nombre de usuario o email" v-model="username">
        </div>
        <div v-bind:class="formClass">
          <!-- <label for="InputPassword">Contraseña</label> -->
          <input type="password" class="form-control" id="password" placeholder="Contraseña" v-model="password">
        </div>
        <div class="alert alert-danger" id="login-error-msg" v-show="messageError">
          <p><b>{{messageError}}</b></p>
        </div>
        <button type="submit" class="btn btn-primary">Ingresar</button>
      </form>
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
        'has-error': this.messageError !== '',
        'form-group': true,
        'form-group-lg': true
      }
    }
  },
  methods: {
    login () {
      auth.login(this.username, this.password).then((response) => {
        this.messageError = ''
        this.$router.push('home')
      }).catch((error) => {
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
