import { LinearScale } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { ItemResponseType, locales } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues } from 'shared/state/Applet/Applet.schema';

import { DataProps, ExtendedChartDataset, OptionsProps } from './MultiScatterChart.types';
import { LABEL_WIDTH_Y, MAX_LABEL_CHARS_Y, commonConfig } from './MultiScatterChart.const';

const formatDateToNumber = (date: string | Date) =>
  (typeof date === 'string' ? new Date(date) : date).getTime();

const truncateString = (label: string) =>
  label?.length > MAX_LABEL_CHARS_Y ? `${label.substring(0, MAX_LABEL_CHARS_Y)}...` : label;

export const getOptions = ({
  lang,
  responseValues,
  responseType,
  minY,
  maxY,
  minDate,
  maxDate,
}: OptionsProps) => {
  const min = formatDateToNumber(minDate);
  const max = formatDateToNumber(maxDate);

  const mapperPointOption: { [key: string | number]: string } =
    responseType !== ItemResponseType.Slider
      ? (responseValues as SingleAndMultipleSelectItemResponseValues)?.options.reduce(
          (mapper, { text }, index) => ({
            ...mapper,
            [index + 1]: text,
          }),
          {},
        )
      : {};

  return {
    responsive: true,
    clip: false as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        min: minY,
        max: maxY + 1,
        afterFit(scaleInstance: LinearScale) {
          scaleInstance.width = LABEL_WIDTH_Y;
        },
        ticks: {
          stepSize: 1,
          callback: (value: string | number) => {
            if (value === maxY + 1) return;

            const label =
              responseType === ItemResponseType.Slider
                ? value.toString()
                : mapperPointOption[value];

            return truncateString(label);
          },
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
      },
      x: {
        adapters: {
          date: {
            locale: locales[lang],
          },
        },
        ...commonConfig,
        grid: {
          display: false,
        },
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
        },
        min,
        max,
      },
      x2: {
        ...commonConfig,
        position: 'top' as const,
        border: {
          display: false,
        },
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
          display: false,
        },
        min,
        max,
      },
    },
  };
};

export const getData = ({ maxY, responseValues, responseType, answers, versions }: DataProps) => {
  const mapperIdPoint: { [key: string]: number } =
    responseType !== ItemResponseType.Slider
      ? (responseValues as SingleAndMultipleSelectItemResponseValues)?.options.reduce(
          (mapper, { id }, index) => ({
            ...mapper,
            [id]: index + 1,
          }),
          {},
        )
      : {};

  return {
    datasets: [
      {
        pointRadius: 6,
        pointHoverRadius: 7,
        datalabels: {
          display: false,
        },
        data: answers.map(({ date, value }) => ({
          x: date,
          y: responseType === ItemResponseType.Slider ? value : mapperIdPoint[value],
        })),
        borderWidth: 0,
        backgroundColor: variables.palette.orange,
      },
      {
        xAxisID: 'x2',
        labels: versions.map(({ version }) => version),
        data: versions.map(({ date }) => ({ x: date, y: maxY + 1 })),
        datalabels: {
          anchor: 'center' as const,
          align: 'right' as const,
          font: {
            size: 11,
          },
          formatter: (_: unknown, context: Context) => {
            const dataset = context.dataset as ExtendedChartDataset;

            return dataset.labels[context.dataIndex];
          },
        },
        pointStyle: false as const,
      },
    ],
  };
};
