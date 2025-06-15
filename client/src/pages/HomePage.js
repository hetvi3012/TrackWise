// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  Card,
  Upload,
  Typography,
  Row,
  Col,
  Button
} from 'antd';
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined
} from '@ant-design/icons';
import Tesseract from 'tesseract.js';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;
const { Title } = Typography;

// define income categories for type inference
const incomeCategories = ['salary', 'tip', 'project'];

const HomePage = () => {
  const [form]       = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [loading,    setLoading]  = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [frequency,    setFrequency]    = useState('365');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type,         setType]         = useState('all');
  const [viewData,     setViewData]     = useState('table');
  const [editable,     setEditable]     = useState(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await axios.post('/api/v1/transactions/get-transaction', {
        userid: user.id,
        frequency,
        selectedDate,
        type
      });
      setTransactions(data);
    } catch {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [frequency, selectedDate, type]);

  // Delete
  const handleDelete = async record => {
    setLoading(true);
    try {
      await axios.post('/api/v1/transactions/delete-transaction', {
        transactionID: record._id
      });
      message.success('Deleted successfully');
      fetchTransactions();
    } catch {
      message.error('Delete failed');
      setLoading(false);
    }
  };

  // Add/Edit
  const handleSubmit = async values => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (editable) {
        await axios.post('/api/v1/transactions/edit-transaction', {
          payload: { ...values, userid: user.id },
          transactionID: editable._id
        });
        message.success('Updated successfully');
      } else {
        await axios.post('/api/v1/transactions/add-transaction', {
          ...values,
          userid: user.id
        });
        message.success('Added successfully');
      }
      form.resetFields();
      setEditable(null);
      setShowModal(false);
      fetchTransactions();
    } catch {
      message.error('Save failed');
      setLoading(false);
    }
  };

  // OCR handler (unchanged)
  const handleOcr = async file => {
    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

      // Reference
      const vendor = lines.find(l =>
        !/^(receipt|address[:\s]|tel[:\s]|date[:\s])/i.test(l)
      ) || '';
      form.setFieldsValue({ reference: vendor });

      // Description
      const idx  = lines.indexOf(vendor);
      const desc = lines.slice(idx + 1, idx + 3).join(' ') || vendor;
      form.setFieldsValue({ description: desc });

      // Date detection...
      const dateTokenRe = /\b(\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?)\b/;
      let foundDate = null;
      const dateLine = lines.find(l => /date[:\s]/i.test(l));
      if (dateLine) {
        const m = dateLine.match(dateTokenRe);
        if (m) foundDate = m[1];
      }
      if (!foundDate) {
        for (let l of lines) {
          const m = l.match(dateTokenRe);
          if (m) { foundDate = m[1]; break; }
        }
      }
      if (foundDate) {
        let norm = foundDate.replace(/-/g,'/');
        if (/^\d{1,2}\/\d{1,2}$/.test(norm)) {
          norm = `${norm}/${new Date().getFullYear()}`;
        }
        const parsed = moment(norm, [
          'DD/MM/YYYY','MM/DD/YYYY','D/M/YYYY','M/D/YYYY','DD/MM/YY','MM/DD/YY'
        ], true);
        if (parsed.isValid()) {
          form.setFieldsValue({ date: parsed.format('YYYY-MM-DD') });
        }
      }

      // Amount tokens
      const moneyRe = /([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2}))/g;
      const vals = [];
      let m;
      while ((m = moneyRe.exec(text))) {
        let num = m[1].replace(/\.(?=\d{3})/g,'').replace(',','.');
        const v = parseFloat(num);
        if (!isNaN(v)) vals.push(v);
      }
      if (vals.length) {
        form.setFieldsValue({ amount: Math.max(...vals) });
      }

      // Category & Type fallback
      try {
        const { data } = await axios.post(
          '/api/v1/transactions/predict-category',
          { description: desc }
        );
        form.setFieldsValue({
          category: data.category,
          type: incomeCategories.includes(data.category) ? 'income' : 'expense'
        });
      } catch {}

      message.success('Receipt scanned successfully');
    } catch (err) {
      console.error(err);
      message.error('Receipt scan failed');
    } finally {
      setOcrLoading(false);
    }
  };

  // Table columns
  const columns = [
    { title: 'Date',      dataIndex: 'date',      render: d => moment(d).format('YYYY-MM-DD') },
    { title: 'Amount',    dataIndex: 'amount' },
    { title: 'Type',      dataIndex: 'type' },
    { title: 'Category',  dataIndex: 'category' },
    { title: 'Reference', dataIndex: 'reference' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ marginRight:12, cursor:'pointer', color:'#1890ff' }}
            onClick={()=>{
              setEditable(record);
              form.setFieldsValue(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor:'pointer', color:'#ff4d4f' }}
            onClick={()=>handleDelete(record)}
          />
        </>
      )
    }
  ];

  return (
    <Layout>
      {loading && <Spinner />}

      {/* Filters */}
      <Card style={{ margin:24, borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding:16 }}>
        <Title level={4}>Filters</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Typography.Text>Frequency</Typography.Text>
            <Select value={frequency} onChange={setFrequency} style={{ width:'100%' }}>
              <Select.Option value="7">Last Week</Select.Option>
              <Select.Option value="30">Last Month</Select.Option>
              <Select.Option value="365">Last Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency==='custom' && (
              <RangePicker
                style={{ width:'100%', marginTop:8 }}
                value={selectedDate}
                onChange={setSelectedDate}
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Typography.Text>Type</Typography.Text>
            <Select value={type} onChange={setType} style={{ width:'100%' }}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} style={{ textAlign:'right' }}>
            <Button
              type={viewData==='table'?'primary':'default'}
              icon={<UnorderedListOutlined />}
              style={{ marginRight:8 }}
              onClick={()=>setViewData('table')}
            />
            <Button
              type={viewData==='analytics'?'primary':'default'}
              icon={<AreaChartOutlined />}
              onClick={()=>setViewData('analytics')}
            />
            <Button
              type="primary"
              style={{ marginLeft:16 }}
              onClick={()=>{
                setEditable(null);
                form.resetFields();
                setShowModal(true);
              }}
            >
              Add Transaction
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Data Display */}
      <Card style={{ margin:'0 24px 24px 24px', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
        {viewData==='table' ? (
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="_id"
            pagination={{ pageSize:5 }}
          />
        ) : (
          <Analytics allTransaction={transactions} />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        visible={showModal}
        onCancel={()=>setShowModal(false)}
        footer={null}
        centered
        bodyStyle={{ padding:24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable || {}}
        >
          {/* OCR Upload */}
          <Form.Item label="Scan Receipt">
            <Upload.Dragger
              accept="image/*"
              showUploadList={false}
              disabled={ocrLoading}
              beforeUpload={file => {
                handleOcr(file);
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                {ocrLoading ? <Spinner /> : <InboxOutlined />}
              </p>
              <p>Click or drag receipt image here to scan</p>
            </Upload.Dragger>
          </Form.Item>

          {/* NLP Parser */}
          <Form.Item label="Or type a description">
            <Input.TextArea
              rows={2}
              placeholder="e.g. Paid 500 for Uber on June 5"
              onChange={e=>form.setFieldsValue({ description:e.target.value })}
            />
            <Button
              style={{ marginTop:8 }}
              loading={nlpLoading}
              onClick={async()=>{
                const desc = form.getFieldValue('description')||'';
                if(!desc) return message.warning('Enter a description first');
                setNlpLoading(true);
                try {
                  const { data } = await axios.post(
                    '/api/v1/transactions/parse-description',
                    { description: desc }
                  );
                  form.setFieldsValue({
                    amount:    data.amount    || undefined,
                    date:      data.date      || undefined,
                    reference: data.vendor    || undefined,
                    category:  data.category  || undefined,
                    type:      data.type      || undefined
                  });
                  message.success('Parsed successfully');
                } catch {
                  message.error('NLP parse failed');
                } finally {
                  setNlpLoading(false);
                }
              }}
            >
              Parse Description
            </Button>
          </Form.Item>

          {/* Form Fields */}
          <Form.Item label="Amount"    name="amount"    rules={[{ required:true, message:'Enter amount' }]}>
            <Input type="number" placeholder="e.g. 1000" />
          </Form.Item>
          <Form.Item label="Type"      name="type"      rules={[{ required:true, message:'Select type' }]}>
            <Select placeholder="Income or Expense">
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category"  name="category"  rules={[{ required:true, message:'Select category' }]}>
            <Select placeholder="Choose category">
              {['Salary','Tip','Project','Food','Movie','Bills','Medical','Fee','Tax']
                .map(cat=>(
                  <Select.Option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Date"      name="date"      rules={[{ required:true, message:'Pick a date' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference" rules={[{ required:true, message:'Enter reference' }]}>
            <Input placeholder="e.g. Netflix" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required:true, message:'Enter description' }]}>
            <Input.TextArea rows={2} placeholder="Details…" />
          </Form.Item>
          <div style={{ textAlign:'right' }}>
            <Button type="primary" htmlType="submit">Save</Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
