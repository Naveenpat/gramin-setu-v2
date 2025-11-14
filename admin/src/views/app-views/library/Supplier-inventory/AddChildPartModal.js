import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Select, Button } from "antd";
import RawMaterialService from "services/rawMaterialService";

const AddInventoryModal = ({ visible, onCancel, onSubmit, formData }) => {
  const [form] = Form.useForm();
  const [materials, setMaterials] = React.useState([]);

  useEffect(() => {
    if (formData) form.setFieldsValue(formData);
  }, [formData]);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const res = await RawMaterialService.getAll();
      if (res.success) setMaterials(res.data || []);
    } catch (err) {
      console.error("Failed to fetch materials", err);
    }
  };

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={formData ? "Edit Inventory Item" : "Add Inventory Item"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Raw Material"
          name="rawMaterial"
          rules={[{ required: true, message: "Select a raw material" }]}
        >
          <Select placeholder="Select Raw Material">
            {materials.map((m) => (
              <Select.Option key={m._id} value={m._id}>
                {m.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Total Quantity"
          name="totalQuantity"
          rules={[{ required: true, message: "Enter total quantity" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: "Select unit" }]}
        >
          <Select>
            <Select.Option value="kg">Kg</Select.Option>
            <Select.Option value="litre">Litre</Select.Option>
            <Select.Option value="piece">Piece</Select.Option>
            <Select.Option value="packet">Packet</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Threshold" name="threshold">
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {formData ? "Update" : "Add"} Inventory
        </Button>
      </Form>
    </Modal>
  );
};

export default AddInventoryModal;
