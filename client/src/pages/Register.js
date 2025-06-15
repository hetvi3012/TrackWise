// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/users/register', values);
      message.success(data.message || 'Registration successful — please log in');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response || err);
      message.error(err.response?.data?.message || 'Registration failed');
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
          width:        380,
          borderRadius: 8,
          boxShadow:    '0 8px 24px rgba(0,0,0,0.1)'
        }}
      >
        {loading && <Spinner />}
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Create Your Account
        </Title>

        <Form
          layout="vertical"
          onFinish={submitHandler}
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Your name" size="large" />
          </Form.Item>

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
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
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
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Link to="/login">Already have an account? Log in</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
