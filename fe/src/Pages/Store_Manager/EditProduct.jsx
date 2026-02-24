import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";

// Simple localStorage helpers (used for demo / local UI)
const loadProducts = () => JSON.parse(localStorage.getItem("store_products") || "[]");
const saveProducts = (arr) => localStorage.setItem("store_products", JSON.stringify(arr));

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: Date.now(),
    name: "",
    category: "",
    batch: "",
    qty: 0,
    expiry: "",
    status: "Green",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = loadProducts();
    if (id) {
      const found = products.find((p) => String(p.id) === String(id));
      if (found) setProduct(found);
    }
    setLoading(false);
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((p) => ({ ...p, [name]: name === "qty" ? Number(value) : value }));
  }

  function handleSave(e) {
    e.preventDefault();
    const products = loadProducts();
    const exists = products.find((p) => String(p.id) === String(product.id));
    if (exists) {
      const updated = products.map((p) => (String(p.id) === String(product.id) ? product : p));
      saveProducts(updated);
    } else {
      saveProducts([product, ...products]);
    }
    navigate("/store/medicines");
  }

  function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const products = loadProducts().filter((p) => String(p.id) !== String(product.id));
    saveProducts(products);
    navigate("/store/medicines");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-700">
          <FaArrowLeft /> Back
        </button>
        <div className="text-right">
          <div className="text-sm text-gray-500">Edit Product</div>
          <h1 className="text-2xl font-bold text-blue-800">{product.name || "New Product"}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white shadow rounded p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={product.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input name="category" value={product.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch No</label>
            <input name="batch" value={product.batch} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input name="qty" type="number" min={0} value={product.qty} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry</label>
            <input name="expiry" type="date" value={product.expiry} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={product.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option>Green</option>
              <option>Yellow</option>
              <option>Red</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {product.id && (
              <button type="button" onClick={handleDelete} className="bg-red-100 text-red-600 px-3 py-2 rounded flex items-center gap-2">
                <FaTrash /> Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"><FaSave /> Save</button>
          </div>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        Tip: Changes are saved locally in your browser (localStorage). I can wire this to an API when you're ready.
      </div>
    </div>
  );
}
