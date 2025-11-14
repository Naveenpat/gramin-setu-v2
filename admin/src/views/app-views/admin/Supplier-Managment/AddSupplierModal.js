import React, { useEffect } from "react";
import { Form, Row, Col, Switch } from "antd";
import GlobalModal from "components/GlobalModal";
import {
  RoundedInput,
  RoundedTextArea,
  RoundedSelect,
} from "components/FormFields";

const AddSupplierModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
    else form.resetFields();
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
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={handleOk}
      header={formData ? "Edit Supplier" : "Add Supplier"}
      okText={formData ? "Update" : "Submit"}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Enter company name" }]}
            >
              <RoundedInput placeholder="Enter company name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Contact Person"
              name="contactPerson"
              rules={[{ required: true, message: "Enter contact person" }]}
            >
              <RoundedInput placeholder="Enter contact person" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Enter email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <RoundedInput placeholder="Enter email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <RoundedInput placeholder="Enter phone number" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Company Address"
              name="companyAddress"
              rules={[{ required: true, message: "Enter company address" }]}
            >
              <RoundedTextArea placeholder="Enter full address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Payment Terms"
              name="paymentTerms"
              rules={[{ required: true, message: "Enter payment terms" }]}
            >
              <RoundedInput placeholder="e.g. Net 30, Advance, etc." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Inco Terms"
              name="incoTerms"
              rules={[{ required: true, message: "Enter Inco terms" }]}
            >
              <RoundedInput placeholder="e.g. FOB, CIF, EXW" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="GST Registered" name="gst" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Verified" name="verified" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Select status" }]}
            >
              <RoundedSelect placeholder="Select status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </RoundedSelect>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
};

export default AddSupplierModal;
