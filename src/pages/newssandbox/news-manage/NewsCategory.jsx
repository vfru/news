import { Button, Form, Input, Table, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
const EditableContext = React.createContext(null);
export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`categories`).then(res => {
      let list = res.data
      setdataSource(list)
    })
  }, [])
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      //???????????????
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '????????????',
      dataIndex: 'label',
      onCell: (record) => ({
        record,
        //?????????
        editable: true,
        dataIndex: 'label',
        title: '????????????',
        handleSave,
      }),
    },
    {
      title: '??????',
      //???????????????
      render: (item) => {
        return <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
      }
    },
  ]
  //??????????????????????????????
  const handleSave = (record) => {
    // console.log(record)
    setdataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: record.id,
          label: record.label,
          value: record.value
        }
      }
      else {
        return item
      }
    }))
    axios.patch(`/categories/${record.id}`, {
      ...record
    })
  }
  //?????????????????????????????????
  const confirmDelete = (item) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '?????????????????????',
      cancelText: '??????',
      okText: '??????',
      //??????ok???
      onOk() {
        deleteMethod(item)
      }
    });
  }
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  return (
    <div>
      <Table
        //table????????????
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id}
      />
    </div>
  )
}
