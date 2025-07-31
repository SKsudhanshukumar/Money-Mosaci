import BoxHeader from "../../components/BoxHeader";
import DashboardBox from "../../components/DashboardBox";
import { useGetKpisQuery } from "../../state/api";
import { useTheme } from "@mui/material";
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

const Row1 = () => {
  const { palette } = useTheme();
  const { data, error, isLoading } = useGetKpisQuery();
  const revenue = useMemo(() => {
    console.log('Processing revenue data:', data);
    return (
      data &&
      data[0] &&
      data[0].monthlyData &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: parseFloat(revenue.replace(/[$,]/g, "")),
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    console.log('Processing revenueExpenses data:', data);
    return (
      data &&
      data[0] &&
      data[0].monthlyData &&
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
    console.log('Processing revenueProfit data:', data);
    return (
      data &&
      data[0] &&
      data[0].monthlyData &&
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

  console.log('Final processed data:', { revenue, revenueExpenses, revenueProfit });

  // Test data for debugging
  const testData = [
    { name: 'Jan', revenue: 15000, expenses: 12000, profit: 3000 },
    { name: 'Feb', revenue: 16000, expenses: 13000, profit: 3000 },
    { name: 'Mar', revenue: 17000, expenses: 14000, profit: 3000 },
  ];

  if (isLoading) {
    return (
      <>
        <DashboardBox gridArea="a" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="b" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="c" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardBox gridArea="a" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="b" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="c" className="hover-lift">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
      </>
    );
  }

  return (
    <>
      <DashboardBox gridArea="a" className="hover-lift grid-item-enter equal-grid-item">
        <BoxHeader
          icon={<TrendingUpIcon />}
          title="Revenue and Expenses"
          subtitle="Monthly comparison of revenue vs expenses"
          sideText="+4%"
          trend="up"
        />
        <ResponsiveContainer width="100%" height="75%">
          <AreaChart
            data={revenueExpenses || testData}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.secondary.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.secondary.main}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={palette.mode === 'light' ? palette.grey[600] : palette.grey[700]}
                opacity={0.3}
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
              <Tooltip
                contentStyle={{
                  backgroundColor: palette.background.paper,
                  border: `1px solid ${palette.grey[700]}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: palette.text.primary }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={palette.primary.main}
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: palette.primary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.primary.main, strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke={palette.secondary.main}
                strokeWidth={3}
                fill="url(#colorExpenses)"
                dot={{ fill: palette.secondary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.secondary.main, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardBox>
      
      <DashboardBox gridArea="b" className="hover-lift grid-item-enter equal-grid-item">
        <BoxHeader
          icon={<ShowChartIcon />}
          title="Profit and Revenue"
          subtitle="Dual-axis comparison of profit vs revenue trends"
          sideText="+4%"
          trend="up"
        />
        <ResponsiveContainer width="100%" height="75%">
          <LineChart
            data={revenueProfit || testData}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
              <CartesianGrid 
                vertical={false} 
                stroke={palette.mode === 'light' ? palette.grey[600] : palette.grey[700]}
                strokeDasharray="3 3"
                opacity={0.3}
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
              <Tooltip
                contentStyle={{
                  backgroundColor: palette.background.paper,
                  border: `1px solid ${palette.grey[700]}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: palette.text.primary }}
              />
              <Legend
                height={20}
                wrapperStyle={{
                  margin: "0 0 10px 0",
                  color: palette.text.primary,
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                stroke={palette.tertiary.main}
                strokeWidth={3}
                dot={{ fill: palette.tertiary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.tertiary.main, strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke={palette.primary.main}
                strokeWidth={3}
                dot={{ fill: palette.primary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: palette.primary.main, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardBox>
      
      <DashboardBox gridArea="c" className="hover-lift grid-item-enter equal-grid-item">
        <BoxHeader
          icon={<BarChartIcon />}
          title="Revenue Month by Month"
          subtitle="Monthly revenue breakdown with growth trends"
          sideText="+4%"
          trend="up"
        />
        <ResponsiveContainer width="100%" height="75%">
          <BarChart
            data={revenue || testData}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
              <defs>
                <linearGradient id="colorRevenueBar" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={palette.primary.main}
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor={palette.primary.light}
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                stroke={palette.mode === 'light' ? palette.grey[600] : palette.grey[700]}
                strokeDasharray="3 3"
                opacity={0.3}
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
              <Tooltip
                contentStyle={{
                  backgroundColor: palette.background.paper,
                  border: `1px solid ${palette.grey[700]}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: palette.text.primary }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorRevenueBar)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardBox>
    </>
  );
};

export default Row1;
