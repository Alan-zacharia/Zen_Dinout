
import React from 'react';
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const xLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface ChartDataType {
  salesData: number[];
  revenueData: number[];
}

interface ChartTwoProps {
  chartData: ChartDataType | null;
  isLoading: boolean;
}

const SellerChartOne: React.FC<ChartTwoProps> = ({ chartData, isLoading }) => {
  console.log(chartData)
  if(!chartData){
    return
  }
  if (isLoading) {
    return (
      <div className="w-[90%] flex m-auto justify-center items-center" style={{ height: 440 }}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: 16 }}>Loading...</Typography>
      </div>
    );
  }


  if (!chartData || !chartData.revenueData || !chartData.salesData) {
    return (
      <div className="w-[90%] flex m-auto justify-center items-center" style={{ height: 440 }}>
        <Typography variant="body1">No data available</Typography>
      </div>
    );
  }

  return (
    <div className="w-[90%] flex m-auto">
      <BarChart
        className="w-full"
        height={440}
        series={[
          { data: chartData.revenueData, label: "Revenue", stack: "stack1" },
          { data: chartData.salesData, label: "Sales" },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </div>
  );
};

export default SellerChartOne;
