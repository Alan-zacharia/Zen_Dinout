import { PieChart } from "@mui/x-charts/PieChart";
import { Typography, Stack } from "@mui/material";

const items = [
  { value: 10, label: "Series A ( no Id )" },
  { id: "id_B", value: 15, label: "Series B" },
  { id: "id_C", value: 20, label: "Series C" },
];

export default function OnSeriesItemClick() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <Typography
        component="pre"
        sx={{
          maxWidth: { xs: "100%", md: "50%", flexShrink: 1 },
          overflow: "auto",
        }}
      ></Typography>

      <div className="w-full max-w-md mx-auto md:max-w-none">
        <PieChart
          series={[
            {
              data: items,
            },
          ]}
          className="w-full"
          height={300}
          margin={{ right: 200 }}
        />
      </div>
    </Stack>
  );
}
