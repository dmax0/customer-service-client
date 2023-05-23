import React, { CSSProperties, useEffect, useState, useRef } from 'react';


import { ModalForm, ProFormText, ProTable, ProFormGroup, ProFormTextArea, ProFormDigit, ProFormItem } from '@ant-design/pro-components';
import { Button, Form, Modal, Rate, Space, Switch, Tag, Tooltip } from 'antd';
import { DeleteOutlined, DotChartOutlined, EditOutlined, InfoCircleOutlined, MoreOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { fetchAllRoles, selectRoles } from '@/store/reducer/roleSlice';
import ProForm from '@/pages/pro-form';
import FormItem from 'antd/es/form/FormItem';
const FAQList = () => {

    const dispatch = useAppDispatch();
    const roles = useAppSelector(selectRoles);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const TagColors = {
        1: 'orange',
        2: 'green',
        3: 'red',
        4: 'blue',
    };
    const renderLevel = (_, record) => {
        const starColor: CSSProperties = { color: '#FFC107' };

        return Array(5 - record.level)
            .fill(null)
            .map((_, index) => <StarFilled key={index} style={starColor} />);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [form] = Form.useForm<{ nameEn: string; nameZh: string; remark: string; level: number }>();

    const handleEdit = (record) => {
        // console.log(record)
        setEditRecord(record);
        setIsModalVisible(true);
    }


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        { title: '英文名', dataIndex: 'nameEn', sorter: true, },
        {
            title: '中文名', dataIndex: 'nameZh', sorter: true,
            render: (_, record) => (
                <Tag color={TagColors[record.level]}>{record.nameZh}</Tag>
            ),
        },
        { title: '描述', dataIndex: 'remark', search: false },
        { title: '等级', dataIndex: 'level', search: false, sorter: true, render: renderLevel },
        {
            title: '操作',
            dataIndex: 'operation',
            valueType: 'option',
            search: false,
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        icon={<DotChartOutlined />}
                        onClick={() => handleAssignPermission(record)}
                    >
                        分配权限
                    </Button>
                </>
            ),
        },
    ];
    const handleDelete = (record) => {
    }
    const handleAssignPermission = (record) => {

    }
    useEffect(() => {
        dispatch(fetchAllRoles());
    }, []
    );



    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    return (
        <div>
            <ProTable
                columns={columns}
                dataSource={roles}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                headerTitle="用户列表"
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary">
                        新增角色
                    </Button>,
                ]}
            />
            <ModalForm
                title="编辑角色"
                visible={isModalVisible}
                initialValues={editRecord}
                form={form}
                onVisibleChange={setIsModalVisible}
                onFinish={async (values) => {
                    console.log(values);
                }}
                modalProps={{
                    onCancel: handleCancel,
                    destroyOnClose: true,
                }}
                width={400}

            >
                <ProFormItem

                >

                    <ProFormText
                        width="md"
                        name="nameZh"
                        label="中文名"
                        rules={[{ required: true, message: '请输入中文名' }]}
                    />

                </ProFormItem>
                <ProFormItem
                >
                    <ProFormTextArea
                        width="md"
                        name="remark"
                        label="描述"
                    />

                </ProFormItem>
                <ProFormItem
                    label={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            等级
                            <Tooltip title="等级越高，权限越小">
                                <InfoCircleOutlined style={{ marginLeft: '8px', color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        </span>
                    }
                    name="level"

                >

                    <ProFormDigit
                        width="md"
                        min={1}
                        max={4}
                        rules={[{ required: true, message: '请输入等级' }]}
                    />
                </ProFormItem>
            </ModalForm>

        </div>
    )

};

export default FAQList;
