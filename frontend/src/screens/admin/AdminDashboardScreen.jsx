import { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import {
  Line,
  Pie,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get('/api/admin/summary');
      setStats(data);
    };
    fetchStats();
  }, []);

  const revenueChartData = {
    labels: stats.dailyRevenue?.map((day) => day._id),
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: stats.dailyRevenue?.map((day) => day.total),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,0.8)',
      },
    ],
  };

  const pieData = {
    labels: stats.bestSellers?.map((p) => p.name),
    datasets: [
      {
        label: 'Top Products',
        data: stats.bestSellers?.map((p) => p.totalSold),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
      },
    ],
  };

  return (
    <>
          <h2 className='mb-4'>Hello Admin</h2>

      <h2 className='mb-4'>📊 Sales Analytics Dashboard</h2>

      <Row className='mb-4'>
        <Col md={3}>
          <Card className='p-3 shadow-sm'>
            <h6>Total Users</h6>
            <h4>{stats.userCount}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='p-3 shadow-sm'>
            <h6>Total Orders</h6>
            <h4>{stats.orderCount}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='p-3 shadow-sm'>
            <h6>Total Products</h6>
            <h4>{stats.productCount}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='p-3 shadow-sm'>
            <h6>Total Sales</h6>
            <h4>${stats.totalSales?.toFixed(2)}</h4>
          </Card>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={8}>
          <Card className='p-3'>
            <h6>📈 Revenue Over Last 7 Days</h6>
            <Line data={revenueChartData} />
          </Card>
        </Col>
        <Col md={4}>
          <Card className='p-3'>
            <h6>📊 Top Performing Products</h6>
            <Pie data={pieData} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className='p-3'>
            <h6>🔥 Best Sellers (Raw)</h6>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {stats.bestSellers?.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.totalSold}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboardScreen;
