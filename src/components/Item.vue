<template>
  <li>
    <div :class="{bold: isFolder}">
      <a @click="toggle" @dblclick="changeType" v-on:click="open = !open">
        {{model.name}} 
        <span v-if="model.description"><i>({{model.description}})</i></span>
        <span v-if="isFolder" @click="toggle">
          [<icon name="minus" v-show="open" height="10" title="Mostrar menos"/><icon name="plus" v-show="!open" height="10" title="Mostrar más"/>]
        </span>
      </a>
      <span>
      - 
        <a @click.stop="details" v-b-tooltip.hover title="Más información">
          <icon name="info" height="13" />
        </a>
        <a @click="remove" v-b-tooltip.hover v-b-modal.deleteModal title="Eliminar nodo">
          <icon name="remove" height="13" />
        </a>
        <a @click="update" v-b-tooltip.hover title="Modificar nodo">
          <icon name="edit" height="13" />
        </a>
      </span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item class="item"
        v-for="(child, index) in model.childrens"
        :index="index"
        :model="child">
      </item>
<!--       <li class="item add" @click="addChild">
        <icon name="plus" height="10"/> Añadir Nodo
      </li>
      <li class="item add" addChild>
        <b-form-input id="nodename"
                  type="text"
                  v-model.trim="newnode.name"
                  placeholder="Ingresar el nombre del nodo" />
        <b-button type="primary" variant="primary">
          <icon name="plus" height="10"/> Añadir Nodo
        </b-button>
      </li> -->
    </ul>
  </li>
</template>

<script>

export default {
  name: 'Item',
  // props: [
  //   'model'
  // ],
  props: {
    model: Object
  },
  // },
  data () {
    return {
      open: true
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
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'childrens', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      this.model.childrens.push({
        name: 'new stuff'
      })
    },
    update: function () {

    },
    details: function () {
      
    },
    remove: function () {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1, h2 {
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
}*/
</style>
