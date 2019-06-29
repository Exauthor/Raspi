<template lang="pug">
  svg.pie-chart(ref='svgPie')
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {
  props: {
    option: {
      default: 'temperature',
      type: String,
    }
  },
  data() {
    return {
      percent: 10,
      data: {},
    }
  },
  methods: {
    async getData() {
      let request = (this.option === 'memory') ? '/api/memory' : '/api/temperature';
      let apiData = await axios.get(request);

      if (this.option === 'memory') {
        console.log('MEMORY', apiData.data.percentMemory)
        this.percent = 100 - apiData.data.percentMemory;
      } else {
        console.log('temperature', apiData.data.temperature)
        this.percent = apiData.data.temperature;
      }

      this.data = apiData.data;
      console.log('temperature', this.data)
    },
    async getTemperature() {
      let apiTemp = await axios.get('/api/temperature');
      return apiTemp.data.temperature;
    },
    async initPieChart() {
      let that = this,
          width = document.documentElement.clientWidth,
          height = document.documentElement.clientHeight,
          margin = 10,
          minValue = Math.min(width, height) / 2,
          radius = (minValue / 2) - margin * 2,
          range = d3.scaleLinear().domain([0, 100]).range([17, 100]),
          svg = d3.select(this.$refs.svgPie)
            .attr('width', minValue)
            .attr('height', minValue)
            .append('g')
            .attr('transform', `translate(${minValue / 2}, ${minValue / 2})`);


      let group = svg.append('g').attr( 'style', 'transform: rotate(150deg)');

      let oldValue = 0;

      let arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius * .9)
        .startAngle(1)
        .cornerRadius(radius * .1);

      group.append('path')
        .attr('d', arc({endAngle: Math.PI*2}))
        .attr('style', 'fill: rgba(0,0,0,.5)');

      let path = group.append('path')
        .datum({endAngle: 1})
        .attr('d', arc( { endAngle: (range(that.percent) / 100) * (2 * Math.PI) } ) );

      let titleText = svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', -20)
        .attr('dx', 0);

      let textValue = (that.option === 'memory') ? that.data.usedMemory : that.percent;

      let text = svg.append('text')
        .datum(textValue)
        .text(d => d+'%')
        .attr('class', 'middleText')
        .attr('text-anchor', 'middle')
        .attr('dy', 20)
        .attr('dx', '0');

      if (this.option === 'memory') {
        path.attr('style', 'fill: var(--color-active)');

        titleText.text('Memory:')
          .attr('style', 'fill: var(--color-active); font-size: 1rem');

        text.attr('style', 'fill: var(--color-active); font-size: 2rem');
      } else {
        path.attr('style', 'fill: var(--color-second)');

        titleText.text('Temperature:')
          .attr('style', 'fill: var(--color-second); font-size: 1rem');

        text.attr('style', 'fill: var(--color-second); font-size: 2rem');
      }

      let animation = (transition, percent, oldValue) => {
        transition.attrTween('d', (d) => {
          let textValue = (that.option === 'memory') ? that.data.usedMemory : that.percent;

          let newAngle = (range(that.percent) / 100) * (2 * Math.PI),
              interpolate = d3.interpolate(d.endAngle, newAngle),
              interpolateCount = d3.interpolate(oldValue, textValue);

          return (t) => {
            d.endAngle = interpolate(t);

            let pathForegroundCircle = arc(d);

            if (this.option === 'memory') {
              text.text(`${Math.floor(interpolateCount(t))} Мб`);
            } else {
              text.text(`+${Math.floor(interpolateCount(t))}C°`);
            }

            return pathForegroundCircle;
          }
        });
      };

      let animate = async function() {
          path.transition()
            .duration(800)
            .ease(d3.easeLinear)
            .call(animation, that.percent, oldValue);

          oldValue = (that.option === 'memory') ? that.data.usedMemory : that.percent;
          await that.getData();

          setTimeout(await animate, 1200);
      };
 
      await animate();
    },
  },
  async mounted() {
    await this.getData();
    this.initPieChart();
  },
}
</script>

<style lang="stylus">
svg.pie-chart
  background rgba(0,0,0,.7)
  border-radius 20px
</style>
