import Sidebar from '@/components/Sidebar';
import React from 'react';
import ProductCard from '@/components/ProductCard'; // Import the ProductCard component
import Link from 'next/link'; // Import the Link component

// Example data for products
const realProducts = [
  { id: 1, title: 'Artistic Sculpture', description: 'A beautifully crafted sculpture perfect for any home decor.', images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'], price: 1499, category: 'Home Decor', stock_quantity: 20 },
  { id: 2, title: 'Techy T-shirt', description: 'A stylish T-shirt with a modern tech-inspired design.', images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'], price: 999, category: 'Apparel', stock_quantity: 50 },
  { id: 3, title: 'Gardening Tools Set', description: 'A comprehensive set of tools for avid gardeners.', images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'], price: 2999, category: 'Gardening', stock_quantity: 15 },
  { id: 4, title: 'Gaming Mouse', description: 'A high-precision gaming mouse for a competitive edge.', images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'], price: 1999, category: 'Gaming', stock_quantity: 30 },
  { id: 5, title: 'Organic Honey', description: 'Pure, organic honey sourced from the best beekeepers.', images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'], price: 599, category: 'Food & Beverages', stock_quantity: 100 },
];

const Products = () => {
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
          {realProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
