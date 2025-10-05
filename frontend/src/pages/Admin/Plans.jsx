import React, { useEffect, useState } from "react";
import axios from "axios";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: "", duration_days: "", price: "" });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingPlanData, setEditingPlanData] = useState({ name: "", duration_days: "", price: "" });
  const [isAdding, setIsAdding] = useState(false); // 👈 NEW toggle for add form

  const API_URL = "http://127.0.0.1:8000/api/admin/plan/";

  // Fetch existing plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(API_URL);
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Add new plan
  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, newPlan);
      setPlans([...plans, res.data]);
      setNewPlan({ name: "", duration_days: "", price: "" });
      setIsAdding(false); // 👈 Hide form after adding
    } catch (err) {
      console.error("Error adding plan:", err);
    }
  };

  // Start editing a plan
  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id);
    setEditingPlanData({ name: plan.name, duration_days: plan.duration_days, price: plan.price });
  };

  // Save edited plan
  const handleUpdatePlan = async (planId) => {
    try {
      const res = await axios.put(`${API_URL}${planId}/`, editingPlanData);
      setPlans(plans.map((p) => (p.id === planId ? res.data : p)));
      setEditingPlanId(null);
    } catch (err) {
      console.error("Error updating plan:", err);
    }
  };

  // Delete a plan
  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${API_URL}${planId}/`);
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  return (
    <div className="container">
      {/* Internal CSS */}
      <style>{`
        .container {
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          max-width: 800px;
          margin: auto;
          background-color: #f5f5f5;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #4CAF50;
          color: white;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        input {
          padding: 10px;
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 8px 15px;
          margin: 2px 0;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .add-btn {
          background-color: #4CAF50;
          color: white;
        }
        .add-btn:hover { background-color: #45a049; }
        .edit-btn { background-color: #ff9800; color: white; }
        .edit-btn:hover { background-color: #e68a00; }
        .delete-btn { background-color: #f44336; color: white; }
        .delete-btn:hover { background-color: #da190b; }
        .cancel-btn { background-color: #9e9e9e; color: white; }
        .cancel-btn:hover { background-color: #7e7e7e; }
      `}</style>

      <h2>Plans</h2>

      {/* Plan Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Duration (days)</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>
                {editingPlanId === plan.id ? (
                  <input
                    type="text"
                    value={editingPlanData.name}
                    onChange={(e) =>
                      setEditingPlanData({ ...editingPlanData, name: e.target.value })
                    }
                  />
                ) : (
                  plan.name
                )}
              </td>
              <td>
                {editingPlanId === plan.id ? (
                  <input
                    type="number"
                    value={editingPlanData.duration_days}
                    onChange={(e) =>
                      setEditingPlanData({
                        ...editingPlanData,
                        duration_days: e.target.value,
                      })
                    }
                  />
                ) : (
                  plan.duration_days
                )}
              </td>
              <td>
                {editingPlanId === plan.id ? (
                  <input
                    type="number"
                    value={editingPlanData.price}
                    onChange={(e) =>
                      setEditingPlanData({ ...editingPlanData, price: e.target.value })
                    }
                  />
                ) : (
                  plan.price
                )}
              </td>
              <td>
                {editingPlanId === plan.id ? (
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdatePlan(plan.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(plan)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Plan Toggle */}
      {!isAdding ? (
        <button
          className="add-btn"
          onClick={() => setIsAdding(true)}
        >
          + Add New Plan
        </button>
      ) : (
        <>
          <form onSubmit={handleAddPlan}>
            <input
              type="text"
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) =>
                setNewPlan({ ...newPlan, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Duration (days)"
              value={newPlan.duration_days}
              onChange={(e) =>
                setNewPlan({ ...newPlan, duration_days: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan({ ...newPlan, price: e.target.value })
              }
              required
            />
            <button type="submit" className="add-btn">
              Save Plan
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Plans;
