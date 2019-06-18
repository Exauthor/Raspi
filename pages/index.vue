<template lang="pug">
  main 
    h2 IoT
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {
  methods: {
    async getTemperature() {
      let apiTemp = await axios.get('/api/temperature');
      return apiTemp.data.temperature;
    },
    async initPieChart() {
      let width = document.documentElement.clientWidth * .4,
          height = document.documentElement.clientHeight * .4,
          radius = Math.min(width, height) / 2,
          range = d3.scaleLinear().domain([0, 100]).range([17, 100]),
          percent = await this.getTemperature(),
          svg = d3.select('main').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);


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
        .attr('d', arc( { endAngle: (range(percent) / 100) * (2 * Math.PI) } ) )
        .attr('style', 'fill: var(--color-second)');

      svg.append('text')
        .text('Temperature:')
        .attr('text-anchor', 'middle')
        .attr('dy', -20)
        .attr('dx', 0)
        .attr('style', 'fill: var(--color-second); font-size: 1rem');

      let text = svg.append('text')
        .datum(percent)
        .text(d => d+'%')
        .attr('class', 'middleText')
        .attr('text-anchor', 'middle')
        .attr('dy', 20)
        .attr('dx', '0')
        .attr('style', 'fill: var(--color-second); font-size: 2rem');

      let animation = (transition, percent, oldValue) => {
        transition.attrTween('d', (d) => {

          var newAngle = (range(percent) / 100) * (2 * Math.PI),
              interpolate = d3.interpolate(d.endAngle, newAngle),
              interpolateCount = d3.interpolate(oldValue, percent);

          return (t) => {
            d.endAngle = interpolate(t);

            let pathForegroundCircle = arc(d);
            text.text(`+${Math.floor(interpolateCount(t))}C°`);

            return pathForegroundCircle;
          }
        });
      };

      let that = this;
      let animate = async function() {
          path.transition()
            .duration(800)
            .ease(d3.easeLinear)
            .call(animation, percent, oldValue);
       
          oldValue = percent;
          percent = await that.getTemperature();
          setTimeout(await animate, 1200);
      };
 
      await animate();
    },
  },
  mounted() {
    this.initPieChart();
  }
}
</script>

<style lang='stylus'>
main
  svg 
    display block
    margin 20px auto
</style>
