// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/users/login', values);
      message.success(data.message || 'Login successful');
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response || err);
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      '100vh',
      background:     'linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)'
    }}>
      <Card
        style={{
          width:        360,
          borderRadius: 8,
          boxShadow:    '0 8px 24px rgba(0,0,0,0.1)'
        }}
      >
        {loading && <Spinner />}
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          TrackWise Login
        </Title>

        <Form
          layout="vertical"
          onFinish={submitHandler}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' }
            ]}
          >
            <Input placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Log In
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link to="/register">Not a user? Register now</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
