import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import AddBuyerOrderModal from "./AddChildPartModal";
import BuyerOrderService from "services/buyerOrderService";


const renderStatus = (status) => {
  let color =
    status === "pending"
      ? "orange"
      : status === "confirmed"
      ? "green"
      : status === "cancelled"
      ? "red"
      : "blue";
  return <Tag color={color}>{status.toUpperCase()}</Tag>;
};

const BuyerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const columns = [
    { title: "Order ID", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Product", dataIndex: ["product", "name"], key: "product" },
    { title: "Buyer", dataIndex: ["buyer", "name"], key: "buyer" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Total (₹)", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => renderStatus(text),
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
      label: "Status",
      placeholder: "Select Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const res = await BuyerOrderService.getAllOrders({
        page,
        limit,
        search,
        ...params,
      });
      if (res.success) setOrders(res.data || []);
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
      const res = await BuyerOrderService.deleteOrder(id);
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
      const res = await BuyerOrderService.getOrderById(id);
      if (res.success) {
        setEditingOrder(res.data);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch order details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingOrder) {
        res = await BuyerOrderService.updateOrder(editingOrder._id, values);
      } else {
        res = await BuyerOrderService.createOrder(values);
      }

      if (res.success) {
        message.success(editingOrder ? "Order updated" : "Order created");
        setShowModal(false);
        setEditingOrder(null);
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
          <h2 style={{ margin: 0 }}>Buyer Orders</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage and track all buyer orders
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Create Order
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
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={{ current: page, pageSize: limit, onChange: setPage }}
      />

      <AddBuyerOrderModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingOrder(null);
        }}
        onSubmit={handleSubmit}
        formData={editingOrder}
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

export default BuyerOrdersList;
