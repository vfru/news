import React, { useState, useRef, useEffect } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom'
import './News.moudule.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';

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

export default function NewsUpdate() {
  //ref
  const NewsForm = useRef(null)
  //步骤条到那个步骤
  const [current, setcurrent] = useState(0)
  //保存请求回来的数据
  const [categories, setcategories] = useState([])
  const [form] = Form.useForm();
  //保存数据
  //保存新闻标题和新闻分类
  const [formValue, setformValue] = useState({})
  //保存输入的富文本
  const [content, setContent] = useState('')

  const navigate = useNavigate()

  const params = useParams()
  useEffect(() => {
    axios.get('categories').then(res => {
      setcategories(res.data)
    })
    //得到原来的新闻
    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res => {
      // setOldnews(res.data)

      //从请求的数据中解构，再通过ref的方法设置显示的值
      let { label, categoryId, content } = res.data
      NewsForm.current.setFieldsValue({
        label: label,
        categoryId: categoryId,
      })
      setContent(content)
    })
  }, [params.id])

  const onFinish = (values) => {
    console.log(values);
  };

  const onGenderChange = (value) => {

  };
  const handleSave = (auditState) => {

    axios.patch(`news/${params.id}`,
      {
        ...formValue,
        "content": content,
        "auditState": auditState,
        // "publishTime": 0
      }
    ).then(res => {

      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/audit')
      //右下角弹出提醒
      notification.info({
        message: `通知`,
        description: `你可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看`,
        placement: 'bottomRight',
      });
    })
  }

  return (

    // 步骤条
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => navigate(-1)}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题,新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div className={current === 0 ? '' : "active"} style={{ marginTop: "50px" }} >
        <Form  {...layout} form={form} name="control-hooks" onFinish={onFinish} ref={NewsForm} >
          <Form.Item
            name="label"
            label="新闻标题"
            rules={[{ required: true, },]}
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
              {categories.map(item => <Option key={item.id} value={item.id}>{item.label}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={current === 1 ? '' : "active"} >
        <NewsEditor
        //把获得的原来的新闻内容传给子组件
          content={content}
          getContent={(html) => {
            //保存富文本,发送后端，报警告需要优化
            setContent(html)
            // console.log(html)
          }} />
      </div>
      <div className={current === 2 ? '' : "active"} ></div>

      {/* 按钮组件，往下50px */}
      <div style={{ marginTop: "50px" }}  >
        {current === 2 && <span>
          <Button type="primary" onClick={() => handleSave(0)}  >保存草稿箱</Button>

          <Button type='danger' onClick={() => handleSave(1)} >提交审核</Button>

        </span>}
        {current < 2 && <Button type="primary" onClick={() => {
          //点击下一步后校验
          if (current === 0) {
            //从ref中得到用户输入的所选择的新闻标题和新闻分类，判断是否填入了必须填的项
            NewsForm.current.validateFields().then(res => {
              // console.log(res)
              //保存
              setformValue(res)
              //进入下一步
              setcurrent(current + 1)
            }).catch(err => {
              //没输入的话弹出提示
              console.log(err)
            })
          }
          //第二步及之后
          else {
            if (content === "" || content.trim() === "<p><br></p>" || content.trim() === "<p></p>") {
              message.error('新闻内容不能为空')
            } else {
              // console.log(content, formValue)
              setcurrent(current + 1)
            }
          }
        }} >下一步</Button>}
        {current > 0 && <Button onClick={() => {
          setcurrent(current - 1)
        }} >上一步</Button>}
      </div>
    </div>
  )
}
