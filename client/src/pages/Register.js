import React, { useState, useEffect } from 'react';
import { Form, Input, message }          from 'antd';
import { Link, useNavigate }            from 'react-router-dom';
import axios                            from 'axios';
import Spinner                          from '../components/Spinner';

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
      const { data } = await axios.post(
        '/api/v1/users/register',
        values
      );
      message.success(data.message || 'Registration successful — please log in');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response || err);
      message.error(
        err.response?.data?.message ||
        'Registration failed — please check console/network'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ padding: '2rem' }}>
      {loading && <Spinner />}

      <Form
        layout="vertical"
        onFinish={submitHandler}
        style={{ maxWidth: 400, margin: 'auto' }}
      >
        <h1>Register</h1>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input />
        </Form.Item>

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
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <Input.Password />
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
          <Input.Password />
        </Form.Item>

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginTop: '1rem' }}
        >
          <Link to="/login" style={{ textDecoration: 'underline' }}>
            Already registered? Log in
          </Link>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
