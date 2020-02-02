<template lang="pug">
  main 
    h2 IoT
    h3 System info
    .system-info.blocks-info
      PieChart
      PieChart(option='memory')
      BlockInfo(option='cooler')
      BlockInfo(option='cpu-up')
    h3 External info
    .external-info.blocks-info
      BlockInfo(option='thermometer')
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import PieChart from '~/components/PieChart.vue';
import BlockInfo from '~/components/BlockInfo.vue';

export default {
  components: {
    PieChart,
    BlockInfo,
  },
}
</script>

<style lang='stylus'>

.block-info
  background rgba(0,0,0,.7)
  border-radius 20px
</style>
