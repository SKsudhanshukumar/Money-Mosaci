import BoxHeader from "../../components/BoxHeader";
import DashboardBox from "../../components/DashboardBox";
import FlexBetween from "../../components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "../../state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useGetKpisQuery();
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductsQuery();
  const { data: transactionData, isLoading: transactionLoading, error: transactionError } = useGetTransactionsQuery();
  
  const isLoading = kpiLoading || productLoading || transactionLoading;
  const error = kpiError || productError || transactionError;

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = parseFloat(kpiData[0].totalExpenses.replace(/[$,]/g, ""));
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          const categoryValue = parseFloat(value.replace(/[$,]/g, ""));
          return [
            {
              name: key,
              value: categoryValue,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - categoryValue,
            },
          ];
        }
      );
    }
  }, [kpiData]);

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  if (isLoading) {
    return (
      <>
        <DashboardBox gridArea="g">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="h">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="i">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="j">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="k">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading...
          </div>
        </DashboardBox>
        <DashboardBox gridArea="l">
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
        <DashboardBox gridArea="g">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="h">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="i">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="j">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="k">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
        <DashboardBox gridArea="l">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>
            Error loading data
          </div>
        </DashboardBox>
      </>
    );
  }

  return (
    <>
      <DashboardBox gridArea="g" className="grid-item-enter equal-grid-item">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.mode === 'light' ? palette.grey[100] : palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h" className="grid-item-enter equal-grid-item">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.mode === 'light' ? palette.grey[100] : palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.mode === 'light' ? palette.grey[300] : palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
            getRowId={(row) => row._id}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>
      
      <DashboardBox gridArea="j" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Key Performance Metrics" sideText="Monthly" />
        <Box p="1rem" height="75%">
          <FlexBetween mb="1rem">
            <Typography variant="h6" color={palette.text.secondary}>
              Revenue Growth
            </Typography>
            <Typography variant="h4" color={palette.primary.main}>
              +12.5%
            </Typography>
          </FlexBetween>
          <FlexBetween mb="1rem">
            <Typography variant="h6" color={palette.text.secondary}>
              Profit Margin
            </Typography>
            <Typography variant="h4" color={palette.secondary.main}>
              18.3%
            </Typography>
          </FlexBetween>
          <FlexBetween mb="1rem">
            <Typography variant="h6" color={palette.text.secondary}>
              Customer Acquisition
            </Typography>
            <Typography variant="h4" color={palette.tertiary.main}>
              +8.7%
            </Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography variant="h6" color={palette.text.secondary}>
              Operating Efficiency
            </Typography>
            <Typography variant="h4" color={palette.primary.light}>
              94.2%
            </Typography>
          </FlexBetween>
        </Box>
      </DashboardBox>
      
      <DashboardBox gridArea="k" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Financial Health Score" sideText="Excellent" />
        <Box p="1rem" height="75%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Box 
            width="120px" 
            height="120px" 
            borderRadius="50%" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{
              background: `conic-gradient(${palette.primary.main} 0deg 306deg, ${palette.grey[300]} 306deg 360deg)`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: palette.background.paper,
              }
            }}
          >
            <Typography variant="h2" color={palette.primary.main} sx={{ zIndex: 1 }}>
              85
            </Typography>
          </Box>
          <Typography variant="h6" mt="1rem" textAlign="center" color={palette.text.secondary}>
            Strong financial position with healthy cash flow and growth metrics
          </Typography>
        </Box>
      </DashboardBox>
      
      <DashboardBox gridArea="l" className="grid-item-enter equal-grid-item">
        <BoxHeader title="Quick Actions" sideText="Dashboard" />
        <Box p="1rem" height="75%" display="flex" flexDirection="column" gap="0.8rem">
          <Box 
            p="0.8rem" 
            borderRadius="8px" 
            sx={{ 
              backgroundColor: palette.primary.main + '20',
              border: `1px solid ${palette.primary.main}40`,
              cursor: 'pointer',
              '&:hover': { backgroundColor: palette.primary.main + '30' }
            }}
          >
            <Typography variant="h6" color={palette.primary.main}>
              Generate Report
            </Typography>
            <Typography variant="body2" color={palette.text.secondary}>
              Create monthly financial summary
            </Typography>
          </Box>
          
          <Box 
            p="0.8rem" 
            borderRadius="8px" 
            sx={{ 
              backgroundColor: palette.secondary.main + '20',
              border: `1px solid ${palette.secondary.main}40`,
              cursor: 'pointer',
              '&:hover': { backgroundColor: palette.secondary.main + '30' }
            }}
          >
            <Typography variant="h6" color={palette.secondary.main}>
              Budget Planning
            </Typography>
            <Typography variant="body2" color={palette.text.secondary}>
              Set up next quarter budget
            </Typography>
          </Box>
          
          <Box 
            p="0.8rem" 
            borderRadius="8px" 
            sx={{ 
              backgroundColor: palette.tertiary.main + '20',
              border: `1px solid ${palette.tertiary.main}40`,
              cursor: 'pointer',
              '&:hover': { backgroundColor: palette.tertiary.main + '30' }
            }}
          >
            <Typography variant="h6" color={palette.tertiary.main}>
              Export Data
            </Typography>
            <Typography variant="body2" color={palette.text.secondary}>
              Download financial data
            </Typography>
          </Box>
        </Box>
      </DashboardBox>
    </>
  );
};

export default Row3;
