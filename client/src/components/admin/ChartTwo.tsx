import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartDataType {
  salesData: number[];
  revenueData: number[];
}

interface ChartTwoProps {
  chartData: ChartDataType | null;
}

const ChartTwo: React.FC<ChartTwoProps> = ({ chartData }) => {
  const [state, setState] = useState<ChartDataType | null>(chartData);

  useEffect(() => {
    setState(chartData);
  }, [chartData]);

  const options: ApexOptions = {
    colors: ['#00BFFF', '#FF6347'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        columnWidth : "18%"
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData ? chartData.salesData.map((_, index) => `Day ${index + 1}`) : [],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8 w-full h-auto md:h-full">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Bookings & Revenue This Week
          </h4>
        </div>
        <div>
          
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          {state ? (
            <ReactApexChart
              options={options}
              series={[
                {
                  name: 'Bookings',
                  data: state.salesData,
                },
                {
                  name: 'Revenue',
                  data: state.revenueData,
                }
              ]}
              type="bar"
              height={455}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
