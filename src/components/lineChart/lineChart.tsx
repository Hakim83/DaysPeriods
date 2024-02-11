// LineChart.tsx
import { onCleanup, createEffect, Component } from 'solid-js';
import 'chartjs-adapter-date-fns';
import Chart, { ChartData } from 'chart.js/auto';
import { YearData } from '../../types/YearData';
interface LineChartProps {
  data: YearData | undefined;
}

const updateFeaturePoints = (chart: Chart<"line", { x: Date, y: Date }[] | undefined, unknown>, maxDate: Date, minDate: Date) => {
  const maxDayIndex = getDayIndex(maxDate);
  const minDayIndex = getDayIndex(minDate);

  const data = chart.data;
  //todo: complete..
  data.datasets.forEach(dataset => {
    dataset.pointBorderColor = (ctx) => {
      return ctx.dataIndex == maxDayIndex || ctx.dataIndex== minDayIndex ? 'red' : 'green';
    };
    dataset.pointBorderColor = (ctx) => {
      return ctx.dataIndex == maxDayIndex || ctx.dataIndex== minDayIndex ? 'red' : 'green';
    };
  });

}

const getDayIndex = (date: Date) => {
  let firstDay = new Date(date.getFullYear(), 0, 1);
  let diff = +date - +firstDay;
  let index = Math.floor(diff / (1000 * 60 * 60 * 24));
  return index;
}

const LineChart: Component<LineChartProps> = (props) => {
  const canvasRef = (element: HTMLCanvasElement) => {
    createEffect(() => {
      if (element) {
        const ctx = element.getContext('2d');
        if (ctx) {
          const newChart = new Chart(ctx, {
            type: 'line',
            data: {
              datasets: [
                {
                  label: 'Sunrise',
                  data: props.data?.timesData.map(t => ({ x: t.date, y: t.sunrise })),
                  borderWidth: 2,
                  fill: true,
                  borderColor: "blue",
                  backgroundColor: "white"
                },
                {
                  label: 'Sunset',
                  data: props.data?.timesData.map(t => ({ x: t.date, y: t.sunset })),
                  borderWidth: 2,
                  fill: true,
                  borderColor: "red",
                  backgroundColor: "orange",
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: "time", // use the time scale for the x-axis
                  time: {
                    unit: "month", // display the data by month
                    displayFormats: {
                      month: "MMM", // format the month as Jan, Feb, etc.
                    },
                  },
                },
                y: {
                  type: "time", // use the time scale for the y-axis
                  time: {
                    parser: "HH:mm", // parse the data as hours and minutes
                    displayFormats: {
                      hour: "HH:mm", // format the tick labels as hours and minutes
                    },
                  },
                },
              },
            }
          });
          updateFeaturePoints(newChart, props.data?.maxDate.date!, props.data?.minDate.date!);
          // Cleanup when the component unmounts
          onCleanup(() => {
            newChart.destroy();
          });
        }
      }
    });
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LineChart;
