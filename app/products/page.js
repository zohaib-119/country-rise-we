'use client'

import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard'; // Import the ProductCard component
import Link from 'next/link'; // Import the Link component
import { useSession } from 'next-auth/react';

const Products = () => {
  const { data: session } = useSession();

  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if(!session)
          return
        
        const response = await fetch(`/api/products?user_id=${session?.user.id}`);

        // Check if the response is okay
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Failed to fetch products");
        }

        // Parse the response JSON
        const { _products } = await response.json();

        // Update state with the fetched products
        setProducts(_products);
      } catch (err) {
        console.error(err)
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
          <Link href="/products/create">
            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Create Product</button>
          </Link>
        </div>
        <div className='flex gap-5 flex-wrap'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
