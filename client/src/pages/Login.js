import React, { useState, useEffect } from 'react';
import { Form, Input, message }          from 'antd';
import { Link, useNavigate }            from 'react-router-dom';
import axios                            from 'axios';
import Spinner                          from '../components/Spinner';

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
      message.error(
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ padding: '2rem' }}>
      {loading && <Spinner />}

      <Form
        layout="vertical"
        onFinish={submitHandler}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <h1>Login</h1>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password />
        </Form.Item>

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginTop: '1rem' }}
        >
          <Link to="/register" style={{ textDecoration: 'underline' }}>
            Not a user? Click here to register
          </Link>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
