import DashboardBox from "./DashboardBox";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@mui/material';

const simpleData = [
  { name: 'Jan', revenue: 15000, expenses: 12000 },
  { name: 'Feb', revenue: 18000, expenses: 13000 },
  { name: 'Mar', revenue: 16000, expenses: 11000 },
  { name: 'Apr', revenue: 20000, expenses: 14000 },
];

const SimpleRow1 = () => {
  const { palette } = useTheme();
  
  return (
    <>
      <DashboardBox gridArea="a" sx={{ minHeight: '300px' }}>
        <h3>Simple Chart Test</h3>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simpleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={palette.primary[500]} 
                fill={palette.primary[300]} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
      
      <DashboardBox gridArea="b" sx={{ minHeight: '300px' }}>
        <h3>Chart B</h3>
        <p>Test content</p>
      </DashboardBox>
      
      <DashboardBox gridArea="c" sx={{ minHeight: '300px' }}>
        <h3>Chart C</h3>
        <p>Test content</p>
      </DashboardBox>
    </>
  );
};

export default SimpleRow1;