import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Checkbox, Divider, message, Select } from "antd";
import GlobalModal from "components/GlobalModal";
import { RoundedInput, RoundedSelect } from "components/FormFields";

const { Title } = Typography;

const AddUserModal = ({ visible, onCancel, onSubmit, formData, roles = [], modules = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (formData) {
      const allPermissions = formData.permissions || [];

      form.setFieldsValue({
        username: formData.userName,
        email: formData.email,
        name: formData.name,
        primaryRole: formData.role?._id,
        permissions: allPermissions,
        status: formData.isActive ? 'active' : "inactive"
      });
      setSelectedPermissions(allPermissions);
    } else {
      form.resetFields();
      setSelectedPermissions([]);
    }
  }, [formData, form]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const submitData = {
        userName: values.username,
        name: values.name,
        email: values.email,
        role: values.primaryRole, // just store role id
        permissions: selectedPermissions,
        status: values.status === "active" ? true : false,  // default if not set
      };

      if (!formData && values.tempPassword) submitData.tempPassword = values.tempPassword;

      await onSubmit(submitData);
      form.resetFields();
      setSelectedPermissions([]);
    } catch (err) {
      message.error("Please check the form for errors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalModal
      visible={visible}
      onCancel={() => { onCancel(); form.resetFields(); setSelectedPermissions([]); }}
      onOk={handleOk}
      header={formData ? "Edit User" : "Add New User"}
      okText={formData ? "Update" : "Submit"}
      width={900}
      height={700}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter username' }]}>
              <RoundedInput placeholder="Enter username" disabled={!!formData} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
              <RoundedInput placeholder="Enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Enter valid email' }]}>
              <RoundedInput placeholder="Enter email" disabled={!!formData} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select user status" }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {!formData && (
              <Form.Item label="Temporary Password" name="tempPassword" rules={[{ required: true, message: 'Enter temp password' }]}>
                <RoundedInput type="password" placeholder="Enter temp password" />
              </Form.Item>
            )}
          </Col>

        </Row>

        <Title level={5}>Primary Role</Title>
        <Form.Item label="Primary Role" name="primaryRole" rules={[{ required: true, message: 'Please select role' }]}>
          <RoundedSelect placeholder="Select role" options={roles.map(r => ({ label: r.name, value: r._id }))} />
        </Form.Item>
      </Form>
    </GlobalModal>
  );
};

export default AddUserModal;
