import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import InventoryService from "services/InventoryService";
import AddInventoryModal from "./AddChildPartModal";


const renderBadge = (text, type) => {
  let color;
  switch (type) {
    case "status":
      color =
        text === "available"
          ? "green"
          : text === "low"
          ? "orange"
          : "red";
      break;
    default:
      color = "gray";
  }
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

const SupplierInventoryList = () => {
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
      dataIndex: ["rawMaterial", "name"],
      key: "material",
      render: (text) => text || "—",
    },
    {
      title: "Category",
      dataIndex: ["rawMaterial", "category"],
      key: "category",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Threshold",
      dataIndex: "threshold",
      key: "threshold",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status =
          record.availableQuantity <= record.threshold
            ? "low"
            : "available";
        return renderBadge(status, "status");
      },
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
      name: "unit",
      label: "Unit",
      placeholder: "Select Unit",
      options: [
        { value: "kg", label: "Kg" },
        { value: "litre", label: "Litre" },
        { value: "piece", label: "Piece" },
        { value: "packet", label: "Packet" },
      ],
    },
  ];

  const fetchInventory = async (params = {}) => {
    setLoading(true);
    try {
      const res = await InventoryService.getAll({ page, limit, search, ...params });
      if (res.success) setData(res.inventory || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      message.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchInventory({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await InventoryService.delete(id);
      if (res.success) {
        message.success("Item deleted successfully");
        fetchInventory();
      }
    } catch {
      message.error("Failed to delete item");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await InventoryService.getById(id);
      if (res.success) {
        setEditingRecord(res.item);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch inventory details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await InventoryService.update(editingRecord._id, values);
      } else {
        res = await InventoryService.add(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Inventory updated" : "Item added");
        setShowModal(false);
        setEditingRecord(null);
        fetchInventory();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Inventory Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Track and manage your stock levels efficiently
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Inventory
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

      <AddInventoryModal
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
          fetchInventory(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Inventory"
      />
    </div>
  );
};

export default SupplierInventoryList;
