import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Upload, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalModal from "components/GlobalModal";

const { Option } = Select;

const AddRawMaterialModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
      if (formData.images) {
        setFileList(
          formData.images.map((url, i) => ({
            uid: i,
            name: `Image-${i}`,
            status: "done",
            url:`http://localhost:5001/api/uploads/images/${url}`,
          }))
        );
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [formData, form]);

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formDataToSend = new FormData();

      // 🔹 Append primitive fields
      for (const [key, value] of Object.entries(values)) {
        if (["returnPolicy"].includes(key)) continue; // handled below
        formDataToSend.append(key, value ?? "");
      }

      // 🔹 Handle nested object (returnPolicy)
      if (values.returnPolicy) {
        formDataToSend.append("returnPolicy", JSON.stringify(values.returnPolicy));
      }

      // 🔹 Handle image uploads
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formDataToSend.append("images", file.originFileObj);
        }
      });

      onSubmit(formDataToSend);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error("Please fill all required fields properly");
    }
  };

  return (
    <GlobalModal
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      header={formData ? "Edit Raw Material" : "Add Raw Material"}
      okText={formData ? "Update" : "Create"}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Material Name"
              name="name"
              rules={[{ required: true, message: "Enter material name" }]}
            >
              <Input placeholder="Enter material name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Select category" }]}
            >
              <Select placeholder="Select category">
                <Option value="Fiber">Fiber</Option>
                <Option value="Wood">Wood</Option>
                <Option value="Clay">Clay</Option>
                <Option value="Metal">Metal</Option>
                <Option value="Textile">Textile</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: true, message: "Select unit" }]}
            >
              <Select placeholder="Select unit">
                <Option value="Kg">Kg</Option>
                <Option value="Gram">Gram</Option>
                <Option value="Meter">Meter</Option>
                <Option value="Piece">Piece</Option>
                <Option value="Litre">Litre</Option>
                <Option value="Bundle">Bundle</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Price Per Unit (₹)"
              name="pricePerUnit"
              rules={[{ required: true, message: "Enter price" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="Enter price" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Stock Quantity"
              name="stockQty"
              rules={[{ required: true, message: "Enter stock quantity" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="Enter stock quantity" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Lead Time (Days)" name="leadTimeDays">
              <InputNumber min={1} className="w-full" placeholder="Enter lead time" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="HSN Code" name="hsnCode">
              <Input placeholder="Enter HSN code" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Return Policy Allowed"
              name={["returnPolicy", "allowed"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Enter short description" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Upload Images">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                multiple
              >
                {fileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </GlobalModal>
  );
};

export default AddRawMaterialModal;
