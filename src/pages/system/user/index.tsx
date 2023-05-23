import React, { useEffect, useState } from 'react';


import { ModalForm, ProFormItem, ProTable } from '@ant-design/pro-components';
import { Button, Form, Modal, Space, Switch, Tag } from 'antd';
import { DeleteOutlined, DotChartOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { selectUsers, fetchAllUsers } from '@/store/reducer/userSlice';
import { toggleUserStatus } from '@/services/user';
const UserList = () => {

  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
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
    { title: '用户名', dataIndex: 'username', sorter: true, },

    { title: '邮箱', dataIndex: 'email', copyable: true, search: false },
    {
      title: '生日', dataIndex: 'birthday', sorter: true, search: false, valueType: 'date',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: '男',
        2: '女',
      }
    },
    {
      title: '创建时间', dataIndex: 'createdAt',
      filters: true,
      onFilter: true,
      sorter: true,
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      render: (status, record) => (
        <Switch
          checked={!!record.status}
          checkedChildren={statusValuesEnum[2]}
          unCheckedChildren={statusValuesEnum[1]}
          onChange={(checked) => {
            Modal.confirm({
              title: '确认',
              content: `你确定要${checked ? '启用' : '禁用'}用户 ${record.nickname} 吗？`,
              onOk: () => {
                handleChangeStatus(record, checked);
              },
              onCancel: () => {
                console.log('Cancel');
              }
            });
          }}
        />
      ),
    },


    {
      title: '角色',
      dataIndex: 'roles',
      // valueType: 'tags',
      render: (roles, record) => (
        <>
          {roles.map((role) => (
            <Tag key={role.id} color={TagColors[(role.id % 3) + 1]}>{role.nameZh}</Tag>
          ))}
          {/* 竖着的三个点，点击后弹出分配角色的弹窗 */}
          <a
            onClick={() => handleAssignRole(record)}
            size="small"
            title='分配角色'
          >
            <MoreOutlined />
          </a>

        </>
      ),
    },
    { title: '昵称', dataIndex: 'nickname', search: false, },
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
    // 编辑用户
    // 注意：你需要实现 editUser 函数，发送请求到后端，编辑用户
  }
  const handleDelete = (record) => {
    // 删除用户
    // 注意：你需要实现 deleteUser 函数，发送请求到后端，删除用户
  }
  const handleAssignRole = (record) => {
  }
  const handleChangeStatus = (record, checked) => {
    const targetStatus = checked ? 1 : 0;
    toggleUserStatus(record.id, targetStatus)
      .then((data) => {
        // console.log('操作成功:', response)
        message.success(`用户 ${record.username} 已经 ${data.status === 1 ? '启用' : '禁用'}`);
        // 重新获取用户列表
        dispatch(fetchAllUsers());
      })
      .catch((error) => {
        console.error('操作失败:', error);
      });

  }
  useEffect(() => {
    dispatch(fetchAllUsers())
      .then((response) => {
        if (response.payload) {
          const total = response.payload.length;
          setPagination({ ...pagination, total }); // 更新 pagination 的 total 值
        }
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, [dispatch, pagination.current, pagination.pageSize]);
  const handleAddUser = () => {
    setIsModalVisible(true);
  }


  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={users}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAddUser}>
            新增用户
          </Button>,
        ]}
      />
      <ModalForm
        title="新增用户"
        width="400px"
        visible={isModalVisible}
        form={form}
        onVisibleChange={setIsModalVisible}
        onFinish={async (values) => {
          console.log(values);
          // await waitTime(2000);
          // message.success('提交成功');
          // setIsModalVisible(false);
        }}
      >
        <ProFormItem
          name="name"
          label="用户名"
          tooltip="最长为 24 位"
          placeholder="请输入用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormItem
          name="nickname"
          label="昵称"
          tooltip="最长为 24 位"
          placeholder="请输入昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        />
      </ModalForm>
    </>
  )

};

export default UserList;
