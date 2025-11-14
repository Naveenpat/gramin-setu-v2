import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import ProducerMaterialService from "services/ProducerMaterialService";
import AddMaterialModal from "./AddChildPartModal";


const renderBadge = (text) => {
  let color =
    text === "available"
      ? "green"
      : text === "low-stock"
      ? "orange"
      : text === "out-of-stock"
      ? "red"
      : "blue";
  return <Tag color={color}>{text?.toUpperCase()}</Tag>;
};

const ProducerMaterialList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const columns = [
    { title: "Material Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Quantity", dataIndex: "availableQuantity", key: "availableQuantity" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    {
      title: "Price/Unit (₹)",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => renderBadge(text),
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

  const filterConfig = [
    {
      type: "select",
      name: "type",
      label: "Material Type",
      placeholder: "Select Type",
      options: [
        { value: "raw", label: "Raw" },
        { value: "semi-finished", label: "Semi-Finished" },
      ],
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      placeholder: "Select Status",
      options: [
        { value: "available", label: "Available" },
        { value: "low-stock", label: "Low Stock" },
        { value: "out-of-stock", label: "Out of Stock" },
      ],
    },
  ];

  const fetchMaterials = async (params = {}) => {
    setLoading(true);
    try {
      const res = await ProducerMaterialService.getAllMaterials({
        page,
        limit,
        search,
        ...params,
      });
      if (res.success) setData(res.data || []);
    } catch (err) {
      console.error("Error fetching materials:", err);
      message.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchMaterials({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await ProducerMaterialService.deleteMaterial(id);
      if (res.success) {
        message.success("Material deleted successfully");
        fetchMaterials();
      }
    } catch {
      message.error("Failed to delete material");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await ProducerMaterialService.getMaterialById(id);
      if (res.success) {
        setEditingRecord(res.data);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch material details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await ProducerMaterialService.updateMaterial(editingRecord._id, values);
      } else {
        res = await ProducerMaterialService.createMaterial(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Material updated" : "Material added");
        setShowModal(false);
        setEditingRecord(null);
        fetchMaterials();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Producer Materials</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage your producer raw and semi-finished materials
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Add Material
        </Button>
      </div>

      <GlobalTableActions
        showSearch
        onSearch={handleSearch}
        showFilter
        onFilter={() => setFilterVisible(true)}
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ current: page, pageSize: limit, onChange: setPage }}
      />

      <AddMaterialModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        formData={editingRecord}
      />

      <GlobalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSubmit={(f) => {
          fetchMaterials(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Materials"
      />
    </div>
  );
};

export default ProducerMaterialList;
