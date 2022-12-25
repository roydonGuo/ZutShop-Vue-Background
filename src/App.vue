<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

a {
  text-decoration: none;
  color: blue;
}

a:hover {
  color: gold;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

.el-table .warning-row {
  background: rgb(238, 196, 193,.5);
}

.el-table .success-row {
  background: #f0f9eb;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 10px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3); */
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(45, 164, 250, 0.5);
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */

}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.5);
}

.el-table {
  border-radius: 10px;
}
</style>
