<template>
  <v-app>
    <v-toolbar app>
      <router-link to="/">
        <v-icon>
          home
        </v-icon>
      </router-link>

      <v-toolbar-title class="headline hidden-sm-and-down">
        <span>UI-Playground</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat :to="{name: 'master-detail'}">
          master-detail
        </v-btn>
        <v-btn flat :to="{name: 'tree-view'}">
          TreeView
        </v-btn>
        <v-btn flat :to="{name: 'split'}">
          Split
        </v-btn>
        <v-btn flat :to="{name: 'split-responsive'}">
          Split-responsive
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
