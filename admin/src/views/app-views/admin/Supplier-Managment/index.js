import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "components/ActionButtons";
import GlobalTableActions from "components/GlobalTableActions";
import GlobalFilterModal from "components/GlobalFilterModal";
import { fetchSuppliers } from "store/slices/supplierSlice";
import SupplierService from "services/SupplierService";
import AddSupplierModal from "./AddSupplierModal";

const renderBadge = (text, type) => {
  let color = "blue";
  if (type === "status") color = text === "active" ? "green" : "red";
  if (type === "verified") color = text ? "cyan" : "default";
  return <Tag color={color}>{text?.toString().toUpperCase()}</Tag>;
};

const SupplierList = () => {
  const [data, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.suppliers);

  const fetchSupplierData = async (params = {}) => {
    setLoading(true);
    try {
      const res = await SupplierService.getAllSuppliers(params);
      if (res.success) setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchSuppliers());
    fetchSupplierData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await SupplierService.deleteSupplier(id);
      message.success("Supplier deleted successfully!");
      fetchSupplierData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete supplier");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await SupplierService.getSupplierById(id);
      if (res.success) {
        setEditingSupplier(res.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch supplier");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingSupplier) {
        res = await SupplierService.updateSupplier(editingSupplier._id, values);
      } else {
        res = await SupplierService.addSupplier(values);
      }

      if (res.success) {
        message.success(editingSupplier ? "Supplier updated" : "Supplier added");
        setShowModal(false);
        setEditingSupplier(null);
        fetchSupplierData();
      } else {
        message.error("Operation failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    }
  };

  const filterConfig = [
    {
      type: "select",
      name: "status",
      label: "Status",
      placeholder: "Select Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      type: "select",
      name: "verified",
      label: "Verification",
      placeholder: "Select Verification",
      options: [
        { label: "Verified", value: true },
        { label: "Unverified", value: false },
      ],
    },
  ];

  const columns = [
    { title: "No.", render: (_, __, i) => i + 1 },
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "Contact Person", dataIndex: "contactPerson", key: "contactPerson" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Payment Terms", dataIndex: "paymentTerms", key: "paymentTerms" },
    { title: "Inco Terms", dataIndex: "incoTerms", key: "incoTerms" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => renderBadge(text, "status"),
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => renderBadge(verified, "verified"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <ActionButtons
          onEdit={() => handleEdit(record._id)}
          onDelete={() => handleDelete(record._id)}
          showEdit
          showDelete
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Supplier Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage all suppliers and approvals
          </p>
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Supplier
        </Button>
      </div>

      <GlobalTableActions
        showSearch
        onSearch={(value) => {
          setSearch(value);
          fetchSupplierData({ search: value });
        }}
        showFilter
        onFilter={() => setFilterVisible(true)}
      />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <AddSupplierModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleSubmit}
        formData={editingSupplier}
      />

      <GlobalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSubmit={(filter) => fetchSupplierData(filter)}
        filters={filterConfig}
        title="Filters"
      />
    </div>
  );
};

export default SupplierList;
