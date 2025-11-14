import React, { useEffect } from "react";
import { Form, Input, Select, Switch, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import GlobalModal from "components/GlobalModal";

const { Option } = Select;

const AddProducerModal = ({ visible, onCancel, onSubmit, formData, suppliers = [] }) => {
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
      header={formData ? "Edit Producer" : "Add Producer"}
      okText={formData ? "Update" : "Create"}
      width={700}
    >
      <Form form={form} layout="vertical">
        {/* Company Info */}
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: "Enter company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item
          label="Contact Person"
          name="contactPerson"
          rules={[{ required: true, message: "Enter contact person name" }]}
        >
          <Input placeholder="Enter contact person name" />
        </Form.Item>

        <Form.Item label="Company Address" name="companyAddress">
          <Input.TextArea rows={2} placeholder="Enter company address" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Enter valid email" }]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item label="GST Registered" name="gst" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item label="Payment Terms" name="paymentTerms">
          <Input placeholder="Enter payment terms (e.g. Net 30, Net 45)" />
        </Form.Item>

        {/* Products Section */}
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <div>
              <label style={{ fontWeight: "500" }}>Products</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Enter product name" }]}
                  >
                    <Input placeholder="Product name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "category"]}
                    rules={[{ required: true, message: "Enter category" }]}
                  >
                    <Input placeholder="Category" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Product
              </Button>
            </div>
          )}
        </Form.List>

        {/* Raw Materials Section */}
        <Form.List name="rawMaterialsUsed">
          {(fields, { add, remove }) => (
            <div style={{ marginTop: 16 }}>
              <label style={{ fontWeight: "500" }}>Raw Materials Used</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "materialName"]}
                    rules={[{ required: true, message: "Enter material name" }]}
                  >
                    <Input placeholder="Material name" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "supplier"]}
                    rules={[{ required: true, message: "Select supplier" }]}
                  >
                    <Select placeholder="Select supplier">
                      {suppliers.map((s) => (
                        <Option key={s._id} value={s._id}>
                          {s.companyName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Material
              </Button>
            </div>
          )}
        </Form.List>

        {/* Status and Verified */}
        <Form.Item label="Status" name="status" initialValue="active">
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Verified" name="verified" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </GlobalModal>
  );
};

export default AddProducerModal;
