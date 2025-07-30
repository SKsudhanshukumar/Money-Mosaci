import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@mui/material';

const testData = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 300 },
];

const TestChart = () => {
  const { palette } = useTheme();
  
  return (
    <div style={{ width: '100%', height: '300px', border: '1px solid red' }}>
      <h3>Test Chart</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={testData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={palette.primary[500]} 
            fill={palette.primary[300]} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestChart;