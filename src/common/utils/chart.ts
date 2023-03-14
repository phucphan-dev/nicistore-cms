import { numberWithPrefix } from 'common/utils/functions';

const getOrCreateLegendList = (_: any, id: any) => {
  const legendContainer = document.getElementById(id);
  if (!legendContainer) return null;
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.classList.add('o-chart_legendCustom_container');
    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};
const htmlLegendPiePlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: any, _: any, opts: any) {
    const ul = getOrCreateLegendList(chart, opts.containerID);

    if (!ul) return;
    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);
    items.forEach((item: any) => {
      const li = document.createElement('li');
      li.classList.add('o-chart_legendCustom_item');

      li.onclick = () => {
        const chartConfig = chart.config;
        if (chartConfig.type === 'pie') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.classList.add('o-chart_legendCustom_box');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = `${item.lineWidth}px`;

      // Text
      const textContainer = document.createElement('span');
      const decsContainer = document.createElement('p');
      const wrapper = document.createElement('div');
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      const desc = document.createTextNode(
        numberWithPrefix(chart.data.datasets[0].data[item.index], '.'),
      );
      textContainer.appendChild(text);
      decsContainer.appendChild(desc);
      wrapper.appendChild(textContainer);
      wrapper.appendChild(decsContainer);

      li.appendChild(boxSpan);
      li.appendChild(wrapper);
      ul.appendChild(li);
    });
  },
};
export default htmlLegendPiePlugin;
