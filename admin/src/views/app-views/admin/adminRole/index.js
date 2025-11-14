import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Space,
  message,
  Checkbox,
  Tag,
  Avatar,
  Tooltip,
  Popconfirm,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import modulePermissions from "../../../../assets/data/permissions.json";
import RoleService from "services/RoleService";
import { hasPermission } from "utils/auth";
import GlobalModal from "components/GlobalModal";
import ActionButtons from "components/ActionButtons";

const AdminRole = () => {
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RoleService.getAllRoles();
      // Expecting res.data.roles or res.roles depending on API
      const fetched = res?.data?.roles || res?.roles || res?.data || [];
      // Normalize to ensure permissions array exists
      const normalized = fetched.map((r) => ({
        ...r,
        permissions: Array.isArray(r.permissions) ? r.permissions : [],
        users: Array.isArray(r.users) ? r.users : [],
      }));
      setRoles(normalized);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      message.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const showModal = (role = null) => {
    setEditingRole(role);

    // prepare permission object for the form: { moduleName: [actions...] }
    const emptyPerm = {};
    Object.keys(modulePermissions).forEach((m) => (emptyPerm[m] = []));

    if (!role) {
      form.setFieldsValue({ name: "", permissions: emptyPerm });
      setIsModalVisible(true);
      return;
    }

    // Convert array like ['*:module', 'create:material', '*'] into object
    const permObj = { ...emptyPerm };
    const perms = Array.isArray(role.permissions) ? role.permissions : [];

    if (perms.includes("*")) {
      // all access
      Object.keys(permObj).forEach((m) => (permObj[m] = ["*"]));
    } else {
      perms.forEach((p) => {
        if (typeof p !== "string") return;
        if (p.startsWith("*:")) {
          const mod = p.split(":")[1];
          if (permObj[mod]) permObj[mod] = ["*"];
        } else {
          const parts = p.split(":");
          if (parts.length === 2) {
            const [action, mod] = parts;
            permObj[mod] = permObj[mod] || [];
            // avoid duplicates
            if (!permObj[mod].includes(action)) permObj[mod].push(action);
          }
        }
      });
    }

    form.setFieldsValue({ name: role.name || "", permissions: permObj });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // values.permissions is an object {module: [actions]}
      const permsArray = [];

      Object.entries(values.permissions || {}).forEach(([mod, actions]) => {
        if (!Array.isArray(actions) || actions.length === 0) return;
        if (actions.includes("*")) {
          permsArray.push(`*:${mod}`);
        } else {
          actions.forEach((a) => {
            permsArray.push(`${a}:${mod}`);
          });
        }
      });

      // If all modules have "*", simplify to ["*"]
      const allModules = Object.keys(modulePermissions || {});
      const isAll = allModules.length > 0 && allModules.every((m) => permsArray.includes(`*:${m}`));
      const finalPerms = isAll ? ["*"] : permsArray;

      const rolePayload = {
        name: values.name.trim(),
        permissions: finalPerms,
      };

      let response;
      if (editingRole && editingRole._id) {
        response = await RoleService.updateRole(editingRole._id, rolePayload);
        // Update local state safely using returned role if present
        const updatedRole = response?.data?.role || { ...editingRole, ...rolePayload };
        setRoles((prev) => prev.map((r) => (r._id === editingRole._id ? updatedRole : r)));
        message.success("Role updated successfully");
      } else {
        response = await RoleService.createRole(rolePayload);
        const newRole = response?.data?.role || { _id: Date.now().toString(), ...rolePayload, users: [] };
        setRoles((prev) => [...prev, newRole]);
        message.success("Role added successfully");
      }

      fetchRoles();
      handleCancel();
    } catch (error) {
      // validation errors are handled above; handle API errors here
      console.error("Role save error:", error);
      // Axios-style error handling
      const errMsg = error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await RoleService.deleteRole(id);
      setRoles((prev) => prev.filter((r) => r._id !== id));
      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
      const errMsg = error?.response?.data?.message || error?.message || "Failed to delete role";
      message.error(errMsg);
    }
  };

  const renderUserBadges = (users = [], onAddUser) => {
    return (
      <Space size={[4, 8]} wrap>
        {users.map((user) => (
          <Tag key={user._id || user.id || user.email || Math.random()} color="blue" style={{ display: "flex", alignItems: "center" }}>
            <Avatar size="small" src={user.avatar || null} style={{ marginRight: 6 }}>
              {(!user.avatar && user.name) ? user.name[0] : null}
            </Avatar>
            {user.name || user.email || "User"}
          </Tag>
        ))}
        <Tooltip title="Assign User">
          <Tag onClick={onAddUser} color="green" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <PlusOutlined />
          </Tag>
        </Tooltip>
      </Space>
    );
  };

  const renderPermissions = (perms = []) => {
    if (!Array.isArray(perms) || perms.length === 0) return <Tag>No Permissions</Tag>;
    return perms.map((p) => {
      const key = typeof p === "string" ? p : JSON.stringify(p);
      if (p === "*") return <Tag color="green" key={key}>All Modules Access</Tag>;
      if (p.startsWith("*:")) return <Tag color="blue" key={key}>{p.replace("*:", "")}: All Access</Tag>;
      const [action, mod] = p.split(":");
      return <Tag key={key}>{mod}: {action}</Tag>;
    });
  };

  const renderPermissionForm = () => {
    return Object.entries(modulePermissions || {}).map(([module, actions]) => (
      <div key={module} style={{ marginBottom: 16, borderBottom: "1px dashed #eee", paddingBottom: 12 }}>
        <div style={{ fontWeight: "600", marginBottom: 8 }}>{module}</div>
        <Form.Item name={['permissions', module]} style={{ marginBottom: 0 }}>
          <Checkbox.Group>
            <Space direction="horizontal">
              <Checkbox value="*">All Access</Checkbox>
              {Array.isArray(actions) && actions.map((action) => (
                <Checkbox value={action} key={action}>
                  {action}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </div>
    ));
  };

  const columns = [
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Permissions", key: "permissions", render: (_, record) => renderPermissions(record.permissions) },
    {
      title: "Users",
      key: "users",
      render: (_, record) => renderUserBadges(record.users || [], () => console.log("Assign user to", record._id)),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space>
          <ActionButtons
            onInfo={() => console.log("Info", record)}
            onEdit={() => showModal(record)}
            onDelete={() => {}}
            showInfo={false}
            showEdit={true}
            showDelete={false}
          />
          <Popconfirm
            title={`Delete role "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Admin Roles</h2>
        {hasPermission('manage_roles') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add Role
          </Button>
        )}
      </div>

      <Table
        dataSource={roles}
        columns={columns}
        rowKey={(record) => record._id || record.id}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />

      <GlobalModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        header={editingRole ? "Edit Role" : "Add Role"}
        okText={editingRole ? "Update" : "Add"}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input />
          </Form.Item>

          <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 8 }}>
            {renderPermissionForm()}
          </div>
        </Form>
      </GlobalModal>
    </div>
  );
};

export default AdminRole;
