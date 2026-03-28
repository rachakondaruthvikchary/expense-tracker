import { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const Charts = ({ user }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await transactionService.getChartData();
        setChartData(response.chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading charts...</div>;
  }

  if (error) {
    return <div className="text-danger text-center py-8">Error loading charts: {error}</div>;
  }

  if (!chartData) {
    return <div className="text-center py-8">No data available</div>;
  }

  // Vibrant, distinct colors for each category
  const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Pink
    '#AA96DA', // Purple
    '#FCBAD3', // Light Pink
    '#A8D8EA', // Light Blue
    '#FF8C42', // Orange
    '#2E86AB', // Dark Blue
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pie Chart - Category Spending */}
      <div
        className="p-6 rounded-2xl bg-white"
        style={{
          border: '1px solid #e8e6e1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
          💰 Spending by Category
        </h2>
        {chartData.pieChart && chartData.pieChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value, user?.currency || 'USD')}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.pieChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value, user?.currency || 'USD')}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e8e6e1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center py-8">No expense data available</p>
        )}
        {/* Legend for pie chart */}
        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
          {chartData.pieChart &&
            chartData.pieChart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
                <span style={{ color: '#5a5a6f' }}>{item.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Line Chart - Monthly Trends */}
      <div
        className="p-6 rounded-2xl bg-white"
        style={{
          border: '1px solid #e8e6e1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
          📈 Monthly Trends
        </h2>
        {chartData.lineChart && chartData.lineChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.lineChart} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e8e6e1"
                vertical={false}
                style={{ opacity: 0.5 }}
              />
              <XAxis
                dataKey="month"
                stroke="#5a5a6f"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <YAxis
                stroke="#5a5a6f"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value, user?.currency || 'USD')}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e8e6e1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                cursor={{ stroke: '#0d7377', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }}
                iconType="line"
              />
              {/* Expense line */}
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#FF6B6B"
                strokeWidth={3}
                name="Expense"
                dot={{
                  fill: '#FF6B6B',
                  r: 5,
                  strokeWidth: 2,
                  stroke: 'white',
                  cursor: 'pointer',
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: '#FF6B6B',
                  stroke: 'white',
                }}
                animationDuration={800}
                animationEasing="ease-in-out"
                isAnimationActive={true}
              />
              {/* Income line (if available) */}
              {chartData.lineChart.some((d) => d.income) && (
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#4ECDC4"
                  strokeWidth={3}
                  name="Income"
                  dot={{
                    fill: '#4ECDC4',
                    r: 5,
                    strokeWidth: 2,
                    stroke: 'white',
                    cursor: 'pointer',
                  }}
                  activeDot={{
                    r: 7,
                    strokeWidth: 3,
                    fill: '#4ECDC4',
                    stroke: 'white',
                  }}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center py-8">No transaction data available</p>
        )}
      </div>
    </div>
  );
};

export default Charts;
