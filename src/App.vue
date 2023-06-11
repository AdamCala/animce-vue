<template>  
  <div id="app">
    <router-view />
</div>
    
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
body{
    height: 100%;
    background-color: #202124;
}
#app{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>    
