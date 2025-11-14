import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button } from "antd";

const AddMaterialModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    else form.resetFields();
  }, [formData]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={formData ? "Edit Material" : "Add Material"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Material Name"
          name="name"
          rules={[{ required: true, message: "Enter material name" }]}
        >
          <Input placeholder="Enter material name" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Select type" }]}
        >
          <Select placeholder="Select type">
            <Select.Option value="raw">Raw</Select.Option>
            <Select.Option value="semi-finished">Semi-Finished</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Available Quantity"
          name="availableQuantity"
          rules={[{ required: true, message: "Enter quantity" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item label="Unit" name="unit">
          <Input placeholder="Unit (kg, litre, etc.)" />
        </Form.Item>

        <Form.Item
          label="Price Per Unit (₹)"
          name="pricePerUnit"
          rules={[{ required: true, message: "Enter price per unit" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item label="Status" name="status" initialValue="available">
          <Select>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="low-stock">Low Stock</Select.Option>
            <Select.Option value="out-of-stock">Out of Stock</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {formData ? "Update Material" : "Add Material"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddMaterialModal;
