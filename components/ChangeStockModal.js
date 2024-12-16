import React, { useEffect, useState } from 'react';

const ChangeStockModal = ({ onClose, onSave, currentStock, productName}) => {
  const [stock, setStock] = useState(currentStock);

  const handleSubmit = () => {
    onSave(stock);
  };

  useEffect(()=> {
    console.log(currentStock)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">Change Stock</h3>
        <p className="mb-4">
          Adjust the stock for <strong>{productName}</strong>.
        </p>
        <div className="mb-4">
          <label className="block mb-2 font-medium">New Stock:</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStockModal;
