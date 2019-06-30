<template lang="pug">
  .block-info.block-info__title(:class='{"block-info--no-active": option === "cooler"}'
                                @click='checkClick')
    SystemIcons.block-info__icon(:name='option')
    h4 {{title}} #[span.text--dark {{subTitle}}]
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import SystemIcons from '~/components/SystemIcons.vue';

export default {
  data() {
    return {
      value: 10,
      subTitle: this.option,
      data: {},
    }
  },
  components: {
    SystemIcons,
  },
  props: {
    option: {
      type: String,
    }
  },
  mounted() {
    let vm = this;

    if (this.option === 'thermometer') {
      setInterval(async () => await vm.updateTemperature(), 1000)
    }
  },
  methods: {
    async updateTemperature() {
      let request = await axios.get('api/external_temperature'),
          temperature = request.data.temperature;

      this.subTitle = `${(temperature > 0) ? '+' : '-'}${temperature}C°`;
    },
    checkClick() {
      if (this.option === 'cooler') {
        //title = 'Active';
      } else if (this.option === 'thermometer') {
        console.log('Temp')
      } else {
        axios.get('/api/cpu-up');
      }
    },
  },
  computed: {
    title() {
      let title;

      if (this.option === 'cooler') {
        title = 'Active';
      } else if (this.option === 'thermometer') {
        title = 'Temperature';
      } else {
        title = 'Boot';
      }

      return title;
    },
    //subTitle: {
      //get() {
        //return this.option;
      //},
      //set(value) {
        //console.log('value', value)
        //return value;
      //}
    //}
  },
}
</script>

<style lang="stylus">
.block-info__title
  display flex
  width calc(25vmin - 5px)
  align-items center
  height 12.5vmin
  padding 0 10px
  h4
    margin-left 10px

.block-info--no-active
  * 
    opacity .7

.text--dark
  opacity .7
  font-size 1rem
  display block

.block-info__icon
  width 8vmin
  height 8vmin
</style>
