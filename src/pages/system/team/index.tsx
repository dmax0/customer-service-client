import React, { useEffect, useState } from 'react';


import { ModalForm, ProFormItem, ProTable } from '@ant-design/pro-components';
import { Button, Cascader, Form, Input, Modal, Space, Switch, Tag } from 'antd';
import { DeleteOutlined, DotChartOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { selectUsers, fetchAllUsers } from '@/store/reducer/userSlice';
import { selectTeams, fetchAllTeams } from '@/store/reducer/teamSlice';
import { toggleUserStatus } from '@/services/user';
import list from 'china-location/dist/location.json'
import { fetchTeams } from '@/services/api';


import ChinaLocation from 'china-location';

const TeamList = () => {

  const dispatch = useAppDispatch();

  const teams = useAppSelector(selectTeams);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const genderValuesEnum = {
    1: '男',
    2: '女',
  };
  const TagColors = {
    1: 'green',
    2: 'pink',
    3: 'orange',
  };
  const statusValuesEnum = {
    1: '启用',
    2: '禁用',
  };

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    { title: '团队名称', dataIndex: 'name', sorter: true, },

    { title: '行业', dataIndex: 'industry', sorter: true, },
    {
      title: '省份', dataIndex: 'province', sorter: false,
    },
    {
      title: '城市', dataIndex: 'city', sorter: false,
    },
    {
      title: '创建时间', dataIndex: 'createdAt',
      filters: true,
      onFilter: true,
      sorter: true,
      valueType: 'date',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      search: false,
      render: (text, record) => (
        <>
          {/* 在这里添加你的操作按钮 */}
          {/* 例如： */}
          <Space size="small">

            <Button onClick={() => handleEdit(record)} size="small" type="primary"><EditOutlined />编辑</Button>
            <Button onClick={() => handleDelete(record)} size="small" type="primary" danger><DeleteOutlined />删除</Button>
          </Space>
        </>
      ),
    },
  ];
  const handleEdit = (record) => {
  }
  const handleDelete = (record) => {
  }
  // useEffect(() => {
  //   dispatch(fetchAllTeams())
  //     .then((response) => {

  //     })
  //     .catch((error) => {
  //       console.error('Failed to fetch users:', error);
  //     });
  // }, [dispatch, pagination.current, pagination.pageSize]);
  useEffect(() => {

  });
  const handleChinaProvinceAndCity = () => {
    const provinces = [];
    // list is a object
    const data = Object.keys(list).map((key) => {
      return {
        name: list[key].name,
        code: list[key].code,
        children: Object.keys(list[key].cities).map((key2) => {
          return {
            label: list[key].cities[key2].name,
            value: list[key].cities[key2].code,
            key: list[key].cities[key2].code,
          };
        }),
      };
    });

    data.forEach(element => {

      provinces.push({
        label: element.name,
        value: element.code,
        key: element.code,
        children: element.children
      })
    });
    return provinces;

  }
  const handleAddTeam = () => {
    setIsModalVisible(true);
  }


  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={teams}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAddTeam}>
            创建团队
          </Button>,
        ]}
      />
      <ModalForm
        title="新增团队"
        width="400px"
        visible={isModalVisible}
        form={form}
        onVisibleChange={setIsModalVisible}
        onFinish={async (values) => {
          console.log(values);
        }}
      >
        <ProFormItem
          name="name"
          label="团队名称"
          rules={[
            {
              required: true,
              message: '请输入团队名称',
            },
          ]}
        >
          <Input placeholder="请输入团队名称" />
        </ProFormItem>
        <ProFormItem
          name="industry"
          label="行业"
          rules={[
            {
              required: true,
              message: '请输入行业',
            },
          ]}
        >
          <Input placeholder="请输入行业" />
        </ProFormItem>
        {/* 省市联动 */}
        <ProFormItem
          name="province"
          label="省份"
          rules={[
            {
              required: true,
              message: '请输入省份',
            },
          ]}
        >
          <Cascader options={handleChinaProvinceAndCity()} placeholder="请选择省份" />
        </ProFormItem>
        <ProFormItem
          name="city"
          label="城市"
          rules={[
            {
              required: true,
              message: '请输入城市',
            },
          ]}
        >
          {/* <Cascader options={new ChinaLocation().getCities()} placeholder="请选择城市" /> */}
        </ProFormItem>

      </ModalForm>
    </>
  )

};

export default TeamList;
