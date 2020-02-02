<template lang="pug">
  .block-info.block-info__title(
    :class='{"block-info--no-active": option === "cooler"}'
    @click='handleClick'
  )
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
    handleClick() {
      if (this.option === 'cooler') {
        //Add cooler function
        //axios.get('/api/cooler-up');
      } else if (this.option === 'memory') {
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
      } else if (this.option === 'cpu-up') {
        title = 'Boot';
      }

      console.log(this.option, this.option === 'memory');

      return title;
    },
  },
}
</script>

<style lang="stylus"></style>
