import {
  Chart, ArcElement,
  registerables,
} from 'chart.js';
import React, { useCallback } from 'react';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
} from 'react-chartjs-2';

import htmlLegendPiePlugin from 'common/utils/chart';

type ShapeType = 'bar' | 'line' | 'pie' | 'doughnut';
export interface ChartCustomProps {
  data: any;
  options?: any;
  height?: number;
  width?: number;
  legendCustomId?: string;
  type?: ShapeType;
}
// register Plugins
Chart.register(ArcElement);
Chart.register(...registerables);
// config datalabels: https://chartjs-plugin-datalabels.netlify.app/guide/options.html#scriptable-options

const ChartCustom: React.FC<ChartCustomProps> = ({
  data, options, height, width, type, legendCustomId,
}) => {
  const renderChartType = useCallback(() => {
    switch (type) {
      case 'line':
        return (
          <Line
            data={data}
            options={options}
            height={height}
            width={width}
            plugins={legendCustomId ? [htmlLegendPiePlugin] : undefined}
          />
        );
      case 'bar':
        return (
          <Bar
            data={data}
            options={options}
            height={height}
            width={width}
            plugins={legendCustomId ? [htmlLegendPiePlugin] : undefined}
          />
        );
      case 'pie':
        return (
          <Pie
            plugins={legendCustomId ? [htmlLegendPiePlugin] : undefined}
            data={data}
            options={options}
            height={height}
            width={width}
          />
        );
      case 'doughnut':
        return (
          <Doughnut
            plugins={legendCustomId ? [htmlLegendPiePlugin] : undefined}
            data={data}
            options={options}
            height={height}
            width={width}
          />
        );
      default:
        return null;
    }
  }, [type, data, options, height, width, legendCustomId]);

  return (
    <div className={`o-chart o-chart-${type}`}>
      <div className={`o-chart_panel ${!(data && data?.datasets?.length && data?.labels?.length) && 'empty'}`}>
        {data
          && data?.datasets?.length
          && data?.labels?.length > 0 ? renderChartType()
          : null}
      </div>
      {
        legendCustomId && <div id={legendCustomId} className="o-chart_legendCustom" />
      }
    </div>
  );
};

ChartCustom.defaultProps = {
  options: {},
  height: undefined,
  width: undefined,
  legendCustomId: '',
};

export default ChartCustom;
