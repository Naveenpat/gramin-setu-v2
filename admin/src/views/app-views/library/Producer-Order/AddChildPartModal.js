import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Select, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const AddOrderModal = ({ visible, onCancel, onSubmit, formData }) => {
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
      title={formData ? "Edit Producer Order" : "Create Producer Order"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Producer"
          name="producerId"
          rules={[{ required: true, message: "Select a producer" }]}
        >
          <Select placeholder="Select Producer">
            {/* dynamically map producers if fetched */}
          </Select>
        </Form.Item>

        <Form.Item
          label="Buyer"
          name="buyerId"
          rules={[{ required: true, message: "Select a buyer" }]}
        >
          <Select placeholder="Select Buyer">
            {/* dynamically map buyers if fetched */}
          </Select>
        </Form.Item>

        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              <label className="font-semibold mb-2 block">Products Ordered</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Select product" }]}
                  >
                    <Select placeholder="Select Product" style={{ width: 200 }}>
                      {/* dynamically map product list */}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Enter quantity" }]}
                  >
                    <InputNumber min={1} placeholder="Qty" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    rules={[{ required: true, message: "Enter price" }]}
                  >
                    <InputNumber min={0} placeholder="Price" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  Add Product
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Total Amount (₹)"
          name="totalAmount"
          rules={[{ required: true, message: "Enter total amount" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Space align="baseline" style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item label="Payment Status" name="paymentStatus" initialValue="unpaid">
            <Select>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="unpaid">Unpaid</Select.Option>
              <Select.Option value="refunded">Refunded</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Order Status" name="status" initialValue="pending">
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Space>

        <Button type="primary" htmlType="submit" block>
          {formData ? "Update Order" : "Create Order"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
