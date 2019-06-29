<template lang="pug">
  main 
    h2 IoT
    h3 System info
    .system-info.block-info
      PieChart
      PieChart(option='memory')
    h3 External info
    .external-info.block-info
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import PieChart from '~/components/PieChart.vue';

export default {
  components: {
    PieChart,
  },
}
</script>

<style lang='stylus'>
h3
  font-size 1.7rem  
  margin 10px
  text-align center

.block-info
  display flex
  flex-wrap wrap
  width calc(100vmin + 10px)
  //justify-content space-around
  margin 10px auto
  & *:nth-child(2n)
    margin-right 0
  & *
    margin-right 10px
</style>
