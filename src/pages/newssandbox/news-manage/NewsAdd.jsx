import React from 'react'
import { PageHeader, Steps, Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import   './News.moudule.css'
const { Option } = Select;
const { Step } = Steps;
const layout = {
  //占多大的范围
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export default function NewsAdd() {
  const [current, setcurrent] = useState(0)
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
  };

  const onGenderChange = (value) => {

  };
  return (

    // 步骤条
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题,新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

    <div className={current===0?'':"active"} style={{ marginTop: "50px" }} >
    <Form  {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="title"
        label="新闻标题"
        rules={[{required: true,},]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="新闻分类"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          onChange={onGenderChange}
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      </Form>
    </div>
    <div className={current===1?'':"active"} >222
    <Input type='text' />
    </div>
    <div className={current===2?'':"active"} >333
    <Input type='text' />
    </div>

      {/* 按钮组件，往下50px */}
      <div style={{ marginTop: "50px" }}  >
        {current === 2 && <span>
          <Button type="primary" >保存草稿箱</Button>
          <Button type='danger'>提交审核</Button>
        </span>}
        {current < 2 && <Button type="primary" onClick={() => {
          setcurrent(current + 1)
        }} >下一步</Button>}
        {current > 0 && <Button onClick={() => {
          setcurrent(current - 1)
        }} >上一步</Button>}
      </div>
    </div>
  )
}
