// LineChart.tsx
import { onCleanup, createEffect, Component } from 'solid-js';
import 'chartjs-adapter-date-fns';
import { CurveData } from '../../types/CurveData';
import { Chart } from 'chart.js/auto';
interface LineChartProps{
  data:CurveData;
}
const LineChart:Component<LineChartProps> = (props) => {
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
                  data: props.data.sunriseData,
                  borderWidth: 2,
                  fill: true,
                  borderColor:"blue",
                  backgroundColor:"white"
                },
                {
                  label: 'Sunset',
                  data: props.data.sunsetData,
                  borderWidth: 2,
                  fill: true,
                  borderColor:"red",
                  backgroundColor:"orange",
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
