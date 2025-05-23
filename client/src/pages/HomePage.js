import React, { useState, useEffect }     from 'react';
import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table
}                                         from 'antd';
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined
}                                         from '@ant-design/icons';
import Layout                            from '../components/Layout/Layout';
import axios                             from 'axios';
import Spinner                           from '../components/Spinner';
import moment                            from 'moment';
import Analytics                         from '../components/Analytics';
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal,   setShowModal]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [transactions,setTransactions]= useState([]);
  const [frequency,   setFrequency]   = useState('365');
  const [selectedDate,setSelectedDate]= useState([]);
  const [type,        setType]        = useState('all');
  const [viewData,    setViewData]    = useState('table');
  const [editable,    setEditable]    = useState(null);

  // Fetch transactions
  useEffect(() => {
    const getAll = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const res  = await axios.post(
          '/api/v1/transactions/get-transaction',
          { userid: user.id, frequency, selectedDate, type }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        message.error('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    getAll();
  }, [frequency, selectedDate, type]);

  // Delete a transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(
        '/api/v1/transactions/delete-transaction',
        { transactionID: record._id }
      );
      message.success('Transaction deleted');
      // Refresh list:
      setTransactions(txs => txs.filter(t => t._id !== record._id));
    } catch (err) {
      console.error(err);
      message.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // Add or edit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (editable) {
        await axios.post(
          '/api/v1/transactions/edit-transaction',
          {
            payload: { ...values, userid: user.id },
            transactionID: editable._id
          }
        );
        message.success('Transaction updated');
      } else {
        await axios.post(
          '/api/v1/transactions/add-transaction',
          { ...values, userid: user.id }
        );
        message.success('Transaction added');
      }
      setShowModal(false);
      setEditable(null);
      // Optionally refetch or update local state here...
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    { title: 'Amount',    dataIndex: 'amount'   },
    { title: 'Type',      dataIndex: 'type'     },
    { title: 'Category',  dataIndex: 'category' },
    { title: 'Reference', dataIndex: 'reference'},
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            style={{ marginLeft: 12 }}
            onClick={() => handleDelete(record)}
          />
        </>
      )
    }
  ];

  return (
    <Layout>
      {loading && <Spinner />}

      <div className="filters" style={{ display: 'flex', gap: 16 }}>
        <div>
          <h6>Frequency</h6>
          <Select value={frequency} onChange={setFrequency}>
            <Select.Option value="7">Last Week</Select.Option>
            <Select.Option value="30">Last Month</Select.Option>
            <Select.Option value="365">Last Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={setSelectedDate}
              style={{ marginTop: 8 }}
            />
          )}
        </div>

        <div>
          <h6>Type</h6>
          <Select value={type} onChange={setType}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <UnorderedListOutlined
            style={{ fontSize: 24, marginRight: 8 }}
            onClick={() => setViewData('table')}
            className={viewData === 'table' ? 'active-icon' : ''}
          />
          <AreaChartOutlined
            style={{ fontSize: 24 }}
            onClick={() => setViewData('analytics')}
            className={viewData === 'analytics' ? 'active-icon' : ''}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditable(null);
            setShowModal(true);
          }}
        >
          Add New
        </button>
      </div>

      <div className="content" style={{ marginTop: 24 }}>
        {viewData === 'table' ? (
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="_id"
          />
        ) : (
          <Analytics allTransaction={transactions} />
        )}
      </div>

      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable || {}}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Enter amount' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Select type' }]}
          >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Select category' }]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Pick a date' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Reference"
            name="reference"
            rules={[{ required: true, message: 'Enter reference' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Enter description' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
