import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, Upload, Space } from "antd";
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from "@ant-design/icons";

const AddProductModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    else form.resetFields();
  }, [formData]);

  const handleFinish = (values) => {
    const formDataObj = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === "materialsUsed") {
        formDataObj.append("materialsUsed", JSON.stringify(values.materialsUsed));
      } else if (key === "images") {
        values.images?.forEach((file) => {
          formDataObj.append("images", file.originFileObj || file);
        });
      } else {
        formDataObj.append(key, values[key]);
      }
    });

    onSubmit(formDataObj);
    form.resetFields();
  };

  return (
    <Modal
      title={formData ? "Edit Product" : "Add Product"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={750}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* PRODUCT DETAILS */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Enter product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select placeholder="Select category">
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Beverage">Beverage</Select.Option>
            <Select.Option value="Dairy">Dairy</Select.Option>
            <Select.Option value="Grain">Grain</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Space align="baseline" style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item
            label="Cost Price (₹)"
            name="costPrice"
            rules={[{ required: true, message: "Enter cost price" }]}
            style={{ width: "48%" }}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Selling Price (₹)"
            name="sellingPrice"
            rules={[{ required: true, message: "Enter selling price" }]}
            style={{ width: "48%" }}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </Space>

        <Form.Item
          label="Stock Quantity"
          name="stockQty"
          rules={[{ required: true, message: "Enter stock quantity" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        {/* MATERIALS USED */}
        <Form.List name="materialsUsed">
          {(fields, { add, remove }) => (
            <div>
              <label className="font-semibold mb-2 block">Raw Materials Used</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Material name required" }]}
                  >
                    <Input placeholder="Material Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Qty required" }]}
                  >
                    <InputNumber min={1} placeholder="Qty" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "unit"]}
                    rules={[{ required: true, message: "Unit required" }]}
                  >
                    <Input placeholder="Unit (kg, Ltr...)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Material
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        {/* IMAGE UPLOAD */}
        <Form.Item label="Upload Images" name="images" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
          <Upload multiple listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item label="Status" name="status" initialValue="draft">
          <Select>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="live">Live</Select.Option>
            <Select.Option value="blocked">Blocked</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {formData ? "Update Product" : "Add Product"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
