import React, { useEffect } from "react";
import { Form, Input, Select, Switch } from "antd";
import GlobalModal from "components/GlobalModal";

const { Option } = Select;

const AddBuyerModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [formData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <GlobalModal
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      header={formData ? "Edit Buyer" : "Add Buyer"}
      okText={formData ? "Update" : "Create"}
      width={600}
    >
      <Form form={form} layout="vertical">
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Enter buyer's full name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", required: true, message: "Enter valid email" }]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        {/* Phone */}
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Company Name */}
        <Form.Item label="Company Name" name="companyName">
          <Input placeholder="Enter company name" />
        </Form.Item>

        {/* GST Number */}
        <Form.Item label="GST Number" name="gstNumber">
          <Input placeholder="Enter GST number" />
        </Form.Item>

        {/* Address */}
        <Form.Item label="Address" name="address">
          <Input.TextArea rows={2} placeholder="Enter company address" />
        </Form.Item>

        {/* Status */}
        <Form.Item label="Status" name="status" initialValue="active">
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        {/* Verified */}
        <Form.Item label="Verified" name="verified" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </GlobalModal>
  );
};

export default AddBuyerModal;
