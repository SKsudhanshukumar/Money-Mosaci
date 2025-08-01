import BoxHeader from "../../components/BoxHeader";
import DashboardBox from "../../components/DashboardBox";
import FlexBetween from "../../components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "../../state/api";
import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { calculateOperationalExpensesGrowth, calculateProductMarginGrowth } from "../../utils/calculations";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData, isLoading: kpiLoading, error: kpiError } = useGetKpisQuery();
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductsQuery();
  
  const isLoading = kpiLoading || productLoading;
  const error = kpiError || productError;

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": parseFloat(operationalExpenses.replace(/[$,]/g, "")),
            "Non Operational Expenses": parseFloat(nonOperationalExpenses.replace(/[$,]/g, "")),
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: parseFloat(price.replace(/[$,]/g, "")),
          expense: parseFloat(expense.replace(/[$,]/g, "")),
        };
      })
    );
  }, [productData]);

  // Calculate dynamic percentage changes
  const operationalExpensesGrowth = useMemo(() => {
    return operationalData && operationalData[0] && operationalData[0].monthlyData 
      ? calculateOperationalExpensesGrowth(operationalData[0].monthlyData)
      : "+0%";
  }, [operationalData]);

  const productMarginGrowth = useMemo(() => {
    return productData 
      ? calculateProductMarginGrowth(productData)
      : "+0%";
  }, [productData]);

  if (isLoading) {
    return (
      <>
        <DashboardBox gridArea="d">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="e">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="f">
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
        <DashboardBox gridArea="d">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="e">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="f">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
      </>
    );
  }

  return (
    <>
      <DashboardBox gridArea="d" className="grid-item-enter equal-grid-item">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText={operationalExpensesGrowth}
        />
        <ResponsiveContainer width="100%" height="75%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="e" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Campaigns and Targets" sideText={productMarginGrowth} />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={15}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
            <Typography variant="h5">Target Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              82
            </Typography>
            <Typography variant="h6">
              Finance goals of the campaign that is desired
            </Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6">Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Profit Margins
            </Typography>
            <Typography variant="h6">
              Margins are up by 30% from last month.
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="f" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Product Prices vs Expenses" sideText={productMarginGrowth} />
        <ResponsiveContainer width="100%" height="75%">
          <ScatterChart
            data={productExpenseData}
            margin={{
              top: 20,
              right: 25,
              bottom: 40,
              left: -10,
            }}
          >
            <CartesianGrid stroke={palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} />
            <XAxis
              type="number"
              dataKey="price"
              name="price"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis
              type="number"
              dataKey="expense"
              name="expense"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <ZAxis type="number" range={[20]} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Scatter
              name="Product Expense Ratio"
              data={productExpenseData}
              fill={palette.tertiary[500]}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
