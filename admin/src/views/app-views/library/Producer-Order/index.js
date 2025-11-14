import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import ProducerOrderService from "services/producerOrderService";
import AddOrderModal from "./AddChildPartModal";

const renderBadge = (status) => {
  const colors = {
    pending: "orange",
    processing: "blue",
    completed: "green",
    cancelled: "red",
  };
  return <Tag color={colors[status] || "gray"}>{status?.toUpperCase()}</Tag>;
};

const ProducerOrderList = () => {
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
      title: "Producer",
      dataIndex: ["producerId", "name"],
      key: "producerId",
    },
    {
      title: "Buyer",
      dataIndex: ["buyerId", "name"],
      key: "buyerId",
    },
    {
      title: "Total Amount (₹)",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "paid" ? "green" : status === "unpaid" ? "orange" : "red"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Order Status",
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
      name: "status",
      label: "Order Status",
      placeholder: "Select Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      type: "select",
      name: "paymentStatus",
      label: "Payment Status",
      placeholder: "Select Payment",
      options: [
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  ];

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const res = await ProducerOrderService.getAllOrders({
        page,
        limit,
        search,
        ...params,
      });
      if (res.success) setData(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchOrders({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await ProducerOrderService.deleteOrder(id);
      if (res.success) {
        message.success("Order deleted successfully");
        fetchOrders();
      }
    } catch {
      message.error("Failed to delete order");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await ProducerOrderService.getOrderById(id);
      if (res.success) {
        setEditingRecord(res.data);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch order details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await ProducerOrderService.updateOrder(editingRecord._id, values);
      } else {
        res = await ProducerOrderService.createOrder(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Order updated" : "Order created");
        setShowModal(false);
        setEditingRecord(null);
        fetchOrders();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Producer Orders</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage all producer orders and transactions
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Add Order
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

      <AddOrderModal
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
        onSubmit={(filters) => {
          fetchOrders(filters);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Orders"
      />
    </div>
  );
};

export default ProducerOrderList;
