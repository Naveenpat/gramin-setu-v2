import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import AddRawMaterialModal from "./AddChildPartModal";
import RawMaterialService from "services/rawMaterialService";

const renderBadge = (text, type) => {
  let color;
  switch (type) {
    case "status":
      color =
        text === "approved" || text === "live"
          ? "green"
          : text === "pending"
          ? "orange"
          : "red";
      break;
    default:
      color = "gray";
  }
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

const RawMaterialList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const columns = [
    {
      title: "Material Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Price / Unit (₹)",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
    },
    {
      title: "Stock Qty",
      dataIndex: "stockQty",
      key: "stockQty",
    },
    {
      title: "Lead Time (Days)",
      dataIndex: "leadTimeDays",
      key: "leadTimeDays",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => renderBadge(text, "status"),
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
      name: "category",
      label: "Category",
      placeholder: "Select Category",
      options: [
        { value: "Fiber", label: "Fiber" },
        { value: "Wood", label: "Wood" },
        { value: "Clay", label: "Clay" },
        { value: "Metal", label: "Metal" },
        { value: "Textile", label: "Textile" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      placeholder: "Select Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "live", label: "Live" },
        { value: "blocked", label: "Blocked" },
      ],
    },
  ];

  const fetchRawMaterials = async (params = {}) => {
    setLoading(true);
    try {
      const res = await RawMaterialService.getAll({ page, limit, search, ...params });
      if (res.success) setData(res.data || []);
    } catch (err) {
      console.error("Error fetching raw materials:", err);
      message.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchRawMaterials({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await RawMaterialService.remove(id);
      if (res.success) {
        message.success("Material deleted successfully");
        fetchRawMaterials();
      }
    } catch {
      message.error("Failed to delete material");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await RawMaterialService.getById(id);
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
        res = await RawMaterialService.update(editingRecord._id, values);
      } else {
        res = await RawMaterialService.create(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Material updated" : "Material added");
        setShowModal(false);
        setEditingRecord(null);
        fetchRawMaterials();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Raw Material Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage your materials, pricing, and availability
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
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

      <AddRawMaterialModal
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
          fetchRawMaterials(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Materials"
      />
    </div>
  );
};

export default RawMaterialList;
