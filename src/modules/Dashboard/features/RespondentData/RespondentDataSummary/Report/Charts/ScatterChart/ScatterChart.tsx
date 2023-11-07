import { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableTooltipContext,
  TimeScale,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { Scatter } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { locales } from 'shared/consts';

import { scatterChartTooltipHandler } from '../Charts.utils';
import { ScatterChartType, SetTooltipData } from '../Chart.types';
import { getData, getOptions } from './ScatterChart.utils';
import { ScatterChartProps } from './ScatterChart.types';
import { ChartTooltip } from './ChartTooltip';
import { StyledWrapper } from './ScatterChart.styles';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export const ScatterChart = ({
  height = '5rem',
  answers,
  versions,
  minDate,
  maxDate,
}: ScatterChartProps) => {
  const { i18n } = useTranslation('app');

  const [tooltipData, setTooltipData] = useState<TooltipItem<'scatter'> | null>(null);
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const lang = i18n.language as keyof typeof locales;

  const hideTooltip = () => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    isHovered.current = false;
    tooltipEl.style.display = 'none';
  };

  const tooltipHandler = (context: ScriptableTooltipContext<'scatter'>) =>
    scatterChartTooltipHandler({
      context,
      tooltipRef,
      isHovered,
      chartRef,
      setTooltipData: setTooltipData as SetTooltipData,
      type: ScatterChartType.ScatterChart,
    });

  const renderChart = useMemo(
    () => (
      <Scatter
        ref={chartRef}
        options={getOptions(lang, minDate, maxDate, tooltipHandler)}
        data={getData(answers, versions)}
        plugins={[ChartDataLabels]}
      />
    ),
    [chartRef, minDate, maxDate, answers, versions, lang],
  );

  return (
    <StyledWrapper sx={{ height }}>
      {renderChart}
      <ChartTooltip
        ref={tooltipRef}
        data={tooltipData}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
      />
    </StyledWrapper>
  );
};
