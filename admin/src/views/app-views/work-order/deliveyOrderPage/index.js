import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message, Card, Select, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import GlobalFilterModal from "components/GlobalFilterModal";
import useDebounce from "utils/debouce";
import OrderService from "services/OrderService";

const { Option } = Select;

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 🧍‍♂️ Role-based control (admin, buyer, supplier, producer)
  const role = localStorage.getItem("role") || "admin";

  // 🔍 Debounced Search
  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchOrders({ page: 1, limit, search: value });
  }, 500);

  // 🧾 Normalize Order Data
  const normalizeRow = (o) => ({
    key: o._id,
    _id: o._id,
    orderNumber: o.orderNumber,
    buyer: o?.buyer?.fullName || "-",
    producer: o?.producer?.companyName || "-",
    supplier: o?.supplier?.companyName || "-",
    totalAmount: o.totalAmount?.toFixed(2),
    status: o.status,
    paymentStatus: o.paymentStatus || "unpaid",
    orderType: o.orderType || "-",
    createdAt: new Date(o.createdAt).toLocaleDateString("en-GB"),
  });

  // 📦 Fetch Orders
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const { page: p = page, limit: l = limit, search: q = search } = params;
      const res = await OrderService.getAllOrders({
        page: p,
        limit: l,
        search: q,
        role,
      });

      if (res?.success) {
        const rows = (res.data || []).map(normalizeRow);
        setData(rows);
        setTotalCount(res.totalCount || rows.length);
      } else {
        message.error(res?.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [role]);

  // 🔄 Status Change (only Admin or Supplier can update)
  const handleStatusChange = async (record, newStatus) => {
    if (role !== "admin" && role !== "supplier") {
      return message.warning("You are not allowed to change status");
    }
    try {
      await OrderService.updateOrderStatus(record._id, { status: newStatus });
      message.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (e) {
      message.error("Failed to update order status");
    }
  };

  // 📋 Table Columns
  const columns = [
    {
      title: "Order No.",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text) => <strong>{text}</strong>,
    },
    { title: "Buyer", dataIndex: "buyer", key: "buyer" },
    { title: "Producer", dataIndex: "producer", key: "producer" },
    { title: "Supplier", dataIndex: "supplier", key: "supplier" },
    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "Total (₹)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => <strong>₹{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) =>
        role === "admin" || role === "supplier" ? (
          <Select
            size="small"
            value={text}
            style={{ width: 120 }}
            onChange={(val) => handleStatusChange(record, val)}
          >
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        ) : (
          <Tag color="blue">{text?.toUpperCase()}</Tag>
        ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text) => (
        <Tag color={text === "paid" ? "green" : "red"}>
          {text?.toUpperCase() || "UNPAID"}
        </Tag>
      ),
    },
    { title: "Created", dataIndex: "createdAt", key: "createdAt" },
  ];

  // ⚙️ Filter Config
  const filterConfig = [
    {
      type: "select",
      name: "status",
      label: "Order Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Delivered", value: "delivered" },
      ],
    },
    {
      type: "date",
      name: "createdAt",
      label: "Created Date",
    },
  ];

  // 📤 Export Handlers
  const handleExport = async (type) => {
    try {
      let res, mime, fileName;
      if (type === "excel") {
        res = await OrderService.exportOrdersExcel();
        mime =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileName = "orders_export.xlsx";
      } else if (type === "pdf") {
        res = await OrderService.exportOrdersPDF();
        mime = "application/pdf";
        fileName = "orders_export.pdf";
      } else {
        res = await OrderService.exportOrdersWord();
        mime =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileName = "orders_export.docx";
      }

      const blob = new Blob([res], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      message.success(`Orders exported to ${type.toUpperCase()}`);
    } catch (err) {
      message.error(`Failed to export ${type.toUpperCase()}`);
    }
  };

  return (
    <div>
      {/* 🔹 Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>🧾 Orders ({role.toUpperCase()})</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            View and manage all your {role} orders
          </p>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchOrders()}
            style={{ borderColor: "#1890ff" }}
          >
            Refresh
          </Button>

          {(role === "buyer" || role === "supplier" || role === "admin") && (
            <Button type="primary" icon={<PlusOutlined />}>
              New Order
            </Button>
          )}
        </Space>
      </div>

      {/* 🔹 Table Actions */}
      <GlobalTableActions
        showSearch
        onSearch={handleSearch}
        showExport
        onExport={() => handleExport("excel")}
        showExportPDF
        onExportPDF={() => handleExport("pdf")}
        showExportWord
        onExportWord={() => handleExport("word")}
        showFilter
        onFilter={() => setIsFilterModalOpen(true)}
      />

      {/* 🔹 Orders Table */}
      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: totalCount,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
              fetchOrders({ page: p, limit: ps });
            },
            showTotal: (t) => `${t} total orders`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 🔹 Filter Modal */}
      <GlobalFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onSubmit={() => fetchOrders({ page: 1, limit, search })}
        filters={filterConfig}
        title="Filter Orders"
      />
    </div>
  );
};

export default OrderPage;
