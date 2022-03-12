<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Resin</router-link>
      <router-link to="/materials">Materials</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import './assets/scss/style.scss';
  #nav {
    display: flex;
    justify-content: space-between;
    padding: 4px;
  }
</style>
