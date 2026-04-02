import React, { useEffect, useState, useRef } from "react";
import { Search, Trash2, Pencil, X, AlertTriangle, Loader2, Save } from "lucide-react";
import api from "../api";

function ManageExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ spent: "", amount: "", mode: "", month: "", description: "" });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletedId, setDeletedId] = useState(null);
  const deleteModalRef = useRef(null);
  const editModalRef = useRef(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/allexpenses");
      if (res.length > 0) {
        setExpenses(res);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Close modals on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (deleteTarget && deleteModalRef.current && !deleteModalRef.current.contains(e.target)) {
        setDeleteTarget(null);
      }
      if (editTarget && editModalRef.current && !editModalRef.current.contains(e.target)) {
        setEditTarget(null);
      }
    };
    if (deleteTarget || editTarget) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [deleteTarget, editTarget]);

  // Close modals on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setDeleteTarget(null);
        setEditTarget(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Open edit modal
  const openEdit = (row) => {
    setEditTarget(row);
    setEditForm({
      spent: row.spent || "",
      amount: row.amount || "",
      mode: row.mode || "",
      month: row.month || "",
      description: row.description || "",
    });
  };

  // Save edit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    try {
      const updated = await api.put(`/expense/${editTarget._id}`, {
        spent: editForm.spent,
        amount: Number(editForm.amount),
        mode: editForm.mode,
        month: editForm.month,
        description: editForm.description,
      });
      // Update the local list with the returned data
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === editTarget._id ? updated : exp))
      );
      setEditTarget(null);
    } catch (err) {
      console.log(err);
      alert("Failed to update expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/expense/${deleteTarget._id}`);
      setDeletedId(deleteTarget._id);
      setTimeout(() => {
        setExpenses((prev) => prev.filter((e) => e._id !== deleteTarget._id));
        setDeletedId(null);
        setDeleteTarget(null);
        setDeleting(false);
      }, 350);
    } catch (err) {
      console.log(err);
      alert("Failed to delete expense.");
      setDeleting(false);
    }
  };

  const filtered = expenses.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.spent && e.spent.toLowerCase().includes(q)) ||
      (e.mode && e.mode.toLowerCase().includes(q)) ||
      (e.month && e.month.toLowerCase().includes(q))
    );
  });

  const getModeColor = (mode) => {
    switch (mode?.toLowerCase()) {
      case "cash":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "hdfc":
        return "bg-green-50 text-green-700 border-green-200";
      case "sbi":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 overflow-x-hidden">
      <div className="min-h-screen bg-slate-50">
        <div className="p-4 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Expenses
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Search, edit, and delete your expenses
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="expense-search"
                type="text"
                placeholder="Search by description, category, mode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
              <span className="ml-3 text-slate-500 text-sm">
                Loading expenses...
              </span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {search ? "No matching expenses" : "No expenses yet"}
              </h3>
              <p className="text-slate-500 text-sm">
                {search
                  ? `No expenses found for "${search}". Try a different search term.`
                  : "Start by adding some expenses from the Expense Form."}
              </p>
            </div>
          )}

          {/* Desktop Table */}
          {!loading && filtered.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Summary bar */}
              <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  All Expenses
                </h2>
                <span className="text-sm text-slate-500">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "expense" : "expenses"}
                  {search && " found"}
                </span>
              </div>

              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Spent On
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr
                        key={row._id}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition-all duration-300 ${
                          deletedId === row._id
                            ? "opacity-0 scale-95 h-0"
                            : "opacity-100"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-[200px] truncate">
                          {row.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {row.spent}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-600">
                          ₹{row.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {row.CreatedAt?.split("T")[0]}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getModeColor(
                              row.mode
                            )}`}
                          >
                            {row.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`edit-expense-${row._id}`}
                              onClick={() => openEdit(row)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer transition-colors"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              id={`delete-expense-${row._id}`}
                              onClick={() => setDeleteTarget(row)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {filtered.map((row) => (
                  <div
                    key={row._id}
                    className={`p-4 transition-all duration-300 ${
                      deletedId === row._id
                        ? "opacity-0 scale-95 h-0 overflow-hidden"
                        : "opacity-100"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {row.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {row.spent}
                        </p>
                      </div>
                      <span className="text-base font-bold text-red-600 ml-3 shrink-0">
                        ₹{row.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getModeColor(
                            row.mode
                          )}`}
                        >
                          {row.mode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {row.CreatedAt?.split("T")[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div
            ref={editModalRef}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 animate-[scaleIn_0.2s_ease-out]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100">
                  <Pencil className="text-indigo-600" size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Edit Expense</h3>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-transparent border-none cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave}>
              <div className="p-5 space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    placeholder="Amount spent"
                    required
                  />
                </div>

                {/* Spent On */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Spent On</label>
                  <input
                    type="text"
                    value={editForm.spent}
                    onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    placeholder="Where is it spent"
                    required
                  />
                </div>

                {/* Month */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
                  <input
                    type="text"
                    value={editForm.month}
                    onChange={(e) => setEditForm({ ...editForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                    placeholder="Current month"
                    required
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mode</label>
                  <select
                    value={editForm.mode}
                    onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select mode</option>
                    <option value="cash">Cash</option>
                    <option value="HDFC">HDFC</option>
                    <option value="SBI">SBI</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
                    placeholder="Description"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                <button
                  type="button"
                  id="cancel-edit"
                  onClick={() => setEditTarget(null)}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-edit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border-none cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-6 animate-[scaleIn_0.2s_ease-out]"
          >
            {/* Warning Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Delete Expense?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-2">
              This action cannot be undone.
            </p>

            {/* Expense summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
              <p className="text-sm font-medium text-slate-900 truncate">
                {deleteTarget.description}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">
                  {deleteTarget.spent}
                </span>
                <span className="text-sm font-bold text-red-600">
                  ₹{deleteTarget.amount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                id="cancel-delete"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 border-none cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ManageExpenses;
