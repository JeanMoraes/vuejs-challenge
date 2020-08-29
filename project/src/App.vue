<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  components:{
    Home
  }
}
</script>

<style>

*{
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

:root{
  --primary-color: #660099
}

body{
  background-color: var(--primary-color);
  color: #FFFFFF;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
