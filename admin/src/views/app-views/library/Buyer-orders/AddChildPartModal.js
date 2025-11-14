import React, { useEffect } from "react";
import { Modal, Form, Select, InputNumber, Button } from "antd";

const AddBuyerOrderModal = ({ visible, onCancel, onSubmit, formData }) => {
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
      title={formData ? "Edit Order" : "Create New Order"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Product"
          name="product"
          rules={[{ required: true, message: "Select a product" }]}
        >
          <Select
            placeholder="Select Product"
            options={[
              { label: "Milk", value: "milk" },
              { label: "Wheat Flour", value: "flour" },
              { label: "Rice", value: "rice" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Enter quantity" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Total Amount (₹)"
          name="totalAmount"
          rules={[{ required: true, message: "Enter total amount" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          initialValue="pending"
          rules={[{ required: true, message: "Select status" }]}
        >
          <Select
            options={[
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {formData ? "Update Order" : "Create Order"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddBuyerOrderModal;
