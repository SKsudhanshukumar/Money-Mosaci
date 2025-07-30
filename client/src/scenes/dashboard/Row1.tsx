import BoxHeader from "../../components/BoxHeader";
import DashboardBox from "../../components/DashboardBox";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetKpisQuery } from "../../state/api";
import { useTheme, Box } from "@mui/material";
import { useMemo } from "react";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const { palette } = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.mode === 'light' ? palette.grey[300] : palette.grey[700]}`,
          borderRadius: 2,
          p: 2,
          boxShadow: `0 8px 32px ${palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ fontWeight: 600, mb: 1, color: palette.text.primary }}>
          {label}
        </Box>
        {payload.map((entry: any, index: number) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color,
              }}
            />
            <Box sx={{ fontSize: '0.875rem', color: palette.text.secondary }}>
              {entry.name}: <span style={{ color: entry.color, fontWeight: 600 }}>
                ${entry.value?.toLocaleString()}
              </span>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const Row1 = () => {
  const { palette } = useTheme();
  const { data, isLoading } = useGetKpisQuery();
  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: parseFloat(revenue.replace(/[$,]/g, "")),
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: parseFloat(revenue.replace(/[$,]/g, "")),
          expenses: parseFloat(expenses.replace(/[$,]/g, "")),
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        const revenueNum = parseFloat(revenue.replace(/[$,]/g, ""));
        const expensesNum = parseFloat(expenses.replace(/[$,]/g, ""));
        return {
          name: month.substring(0, 3),
          revenue: revenueNum,
          profit: parseFloat((revenueNum - expensesNum).toFixed(2)),
        };
      })
    );
  }, [data]);

  if (isLoading) {
    return (
      <>
        <DashboardBox gridArea="a">
          <LoadingSpinner message="Loading revenue data..." />
        </DashboardBox>
        <DashboardBox gridArea="b">
          <LoadingSpinner message="Loading profit data..." />
        </DashboardBox>
        <DashboardBox gridArea="c">
          <LoadingSpinner message="Loading monthly data..." />
        </DashboardBox>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ gridArea: "a" }}
      >
        <DashboardBox>
          <BoxHeader
            title="Revenue and Expenses"
            subtitle="Monthly comparison of revenue vs expenses"
            sideText="+4%"
            icon={<TrendingUpIcon />}
          />
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart
              data={revenueExpenses}
              margin={{
                top: 15,
                right: 25,
                left: -10,
                bottom: 40,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary[400]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary[400]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.secondary[400]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.secondary[400]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={palette.mode === 'light' ? palette.grey[200] : palette.grey[800]}
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
                domain={[8000, 23000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={palette.primary[500]}
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: palette.primary[500], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.primary[500], strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke={palette.secondary[500]}
                strokeWidth={3}
                fill="url(#colorExpenses)"
                dot={{ fill: palette.secondary[500], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.secondary[500], strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardBox>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ gridArea: "b" }}
      >
        <DashboardBox>
          <BoxHeader
            title="Profit and Revenue"
            subtitle="Dual-axis comparison of profit margins and revenue"
            sideText="+4%"
            icon={<ShowChartIcon />}
          />
          <ResponsiveContainer width="100%" height="80%">
            <LineChart
              data={revenueProfit}
              margin={{
                top: 15,
                right: 25,
                left: -10,
                bottom: 40,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={palette.mode === 'light' ? palette.grey[200] : palette.grey[800]}
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                stroke={palette.tertiary[500]}
                strokeWidth={3}
                dot={{ fill: palette.tertiary[500], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.tertiary[500], strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke={palette.primary[500]}
                strokeWidth={3}
                dot={{ fill: palette.primary[500], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.primary[500], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardBox>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ gridArea: "c" }}
      >
        <DashboardBox>
          <BoxHeader
            title="Revenue Month by Month"
            subtitle="Monthly revenue breakdown with trend analysis"
            sideText="+4%"
            icon={<BarChartIcon />}
          />
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={revenue}
              margin={{
                top: 15,
                right: 25,
                left: -10,
                bottom: 40,
              }}
            >
              <defs>
                <linearGradient id="colorRevenueBar" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary[400]}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary[600]}
                    stopOpacity={0.7}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={palette.mode === 'light' ? palette.grey[200] : palette.grey[800]}
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: palette.text.secondary }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorRevenueBar)"
                radius={[4, 4, 0, 0]}
                stroke={palette.primary[500]}
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardBox>
      </motion.div>
    </>
  );
};

export default Row1;
