'use client';

import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import DeleteProductModal from '@/components/DeleteProductModal';
import ChangeStockModal from '@/components/ChangeStockModal';
import { useRouter } from 'next/navigation';

const Products = () => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDelete = async (product_id) => {
    try {
      // Make API request to delete the product
      const response = await fetch(`/api/product/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id }), // Pass only the product_id
      });
  
      // Check for response success
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete product");
      }
  
      // Update the product list state by filtering out the deleted product
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== product_id));
  
      // Close the delete modal and reset selected product
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
  
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };
  

  const handleChangeStock = async (product_id, stock_quantity) => {
    try {
      // Make API request to update the stock
      const response = await fetch(`/api/product/change-stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock_quantity, product_id }),
      });

      // Check for response success
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to update stock");
      }

      // Update the product list state with the updated stock
      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === product_id ? { ...product, stock_quantity: updatedProduct.stock_quantity } : product
        )
      );

      // Close the stock modal and reset selected product
      setIsStockModalOpen(false);
      setSelectedProduct(null);

      console.log('Stock updated successfully');
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const handleEdit = (product_id) => {
    router.replace(`/products/edit/${product_id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products`);

        // Check if the response is okay
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Failed to fetch products");
        }

        // Parse the response JSON
        const { products } = await response.json();

        // Update state with the fetched products
        setProducts(products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-5/6 h-screen overflow-auto p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>Product List</h2>
          <Link href="/products/add">
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Create Product</button>
          </Link>
        </div>
        <div className='flex gap-5 flex-wrap'>
          {products.map(product => (
            <ProductCard key={product.id} product={product}
              handleEdit={() => handleEdit(product.id)}
              handleChangeStock={() => {
                setSelectedProduct(product);
                setIsStockModalOpen(true);
              }}
              handleDelete={() => {
                setSelectedProduct(product);
                setIsDeleteModalOpen(true);
              }} />
          ))}
        </div>
      </div>

      {isDeleteModalOpen && <DeleteProductModal
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onDelete={() => handleDelete(selectedProduct?.id)}
        productName={selectedProduct?.title}
      />
      }
      {
        isStockModalOpen && <ChangeStockModal
          onClose={() => {
            setIsStockModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={(stock_quantity) => handleChangeStock(selectedProduct?.id, stock_quantity)}
          currentStock={selectedProduct?.stock_quantity}
          productName={selectedProduct?.title}
        />
      }

    </div>
  );
};

export default Products;
