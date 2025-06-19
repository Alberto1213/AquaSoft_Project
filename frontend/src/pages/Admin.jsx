import React, { useEffect, useState } from "react";
import "./Admin.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "", role_id: "" });
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;

    try {
      const res = await fetch(`http://localhost:3001/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setUpdatedUser({ username: user.username, email: user.email, role_id: user.role_id || "" });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3001/user/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update user");
      }
      setEditingUser(null);
      fetchUsers();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      setAddingUser(false);
      setNewUser({ username: "", email: "", password: "" });
      fetchUsers();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Lista utilizatorilor</h2>
      {error && <p className="admin-error">{error}</p>}
      <button className="admin-add-btn" onClick={() => setAddingUser(true)}>➕ Adaugă utilizator</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Rol</th><th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="admin-table-row">
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role_id}</td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="admin-btn-delete">🗑️</button>
                <button onClick={() => openEdit(user)} className="admin-btn-edit">✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Edit */}
      {editingUser && (
        <div className="admin-popup">
          <div className="admin-modal">
            <h3 className="admin-modal-title">Editează utilizator</h3>
            <input
              placeholder="Username"
              value={updatedUser.username}
              onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
              className="admin-input"
            />
            <input
              placeholder="Email"
              value={updatedUser.email}
              onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              className="admin-input"
            />
            <input
              type="number"
              placeholder="Rol ID"
              value={updatedUser.role_id}
              onChange={(e) => setUpdatedUser({ ...updatedUser, role_id: e.target.value })}
              className="admin-input"
            />
            <div className="admin-btn-group">
              <button onClick={handleUpdate} className="admin-btn-save">Salvează</button>
              <button onClick={() => setEditingUser(null)} className="admin-btn-cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Add */}
      {addingUser && (
        <div className="admin-popup">
          <div className="admin-modal">
            <h3 className="admin-modal-title">Adaugă utilizator</h3>
            <input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="admin-input"
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="admin-input"
            />
            <input
              type="password"
              placeholder="Parola"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="admin-input"
            />
            <div className="admin-btn-group">
              <button onClick={handleAdd} className="admin-btn-save">Creează</button>
              <button onClick={() => setAddingUser(false)} className="admin-btn-cancel">Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
