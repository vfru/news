import React, { forwardRef, useState, useEffect } from 'react'
import { Input, Form, Select } from 'antd'

//选择器中结构
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    //token中获得用户的权限和区域，控制用户页面的显示
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": "超级管理员",
        "2": "区域管理员",
        "3": "区域编辑",
    }
    //根据用户的权限，来判断角色的可选
    const roleDisabled = (item) => {
        //如果是更新的时候
        if (props.isUpdate) {
            //是超级管理员时
            if (roleObj[roleId] === "超级管理员") {
                //不禁用角色的选择
                return false
            } else {
                //禁用角色的选择
                return true
            }
        }else {
            //如果是创建的时候
            if (roleObj[roleId] === "超级管理员") {
                //不禁用角色的选择
                return false
            } else {
                //只能选比自己权限小的角色
                return item.id !== 3
            }
        }
    }
    //根据用户的权限，来判断区域的是否可选
    const regionDisabled = (item) => {
        //如果是更新的时候
        if (props.isUpdate) {
            //是超级管理员时
            if (roleObj[roleId] === "超级管理员") {
                //不禁用区域的编辑
                return false
            } else {
                //禁用区域的编辑
                return true
            }
        }
        else {
            //如果是创建的时候
            if (roleObj[roleId] === "超级管理员") {
                //不禁用区域的编辑
                return false
            } else {
                //不是超级管理员只能选指定的区域
                return item.value !== region
            }
        }
    }
    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            //必填项
                            required: true,
                            message: '必填',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            //必填项
                            required: true,
                            message: '必填',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    // 超级管理员不用填区域
                    rules={isDisabled ? [] : [
                        {
                            //必填项
                            required: true,
                            message: '必填',
                        },
                    ]}
                >
                    <Select disabled={isDisabled} >
                        {
                            props.regionList.map(item =>
                                <Option key={item.id} value={item.value} disabled={regionDisabled(item)} >{item.label}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[
                        {
                            //必填项
                            required: true,
                            message: '必填',
                        },
                    ]}
                >
                    <Select onChange={(value) => {
                        if (value === 1) {
                            setisDisabled(true)
                            //将区域选中的值设置为空
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        }
                        else {
                            setisDisabled(false)
                        }
                    }} >
                        {
                            props.roleList.map(item =>
                                <Option key={item.id} value={item.id} disabled={roleDisabled(item)} >{item.roleName}</Option>)
                        }
                    </Select>

                </Form.Item>
            </Form>
        </div>
    )
})

export default UserForm