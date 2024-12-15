import React from 'react';
import Image from 'next/image'; // Import the `next/image` component

/**
 * ProductCard Component
 * 
 * Displays an individual product with its details.
 * 
 * Props:
 * - product (object): The product data to display.
 *   - id (integer): Unique identifier for the product.
 *   - title (string): Title of the product.
 *   - description (text): Description of the product.
 *   - images (array): Array of image URLs for the product.
 *   - price (decimal): Price of the product in rupees.
 *   - category (string): Category of the product.
 *   - stock_quantity (integer): Quantity of the product in stock.
 */
const ProductCard = ({ product }) => {
  // Function to truncate the description to 60 characters
  const truncateDescription = (desc) => {
    if (desc.length > 60) {
      return desc.substring(0, 60) + '...';
    }
    return desc;
  };

  return (
    <div className='w-72 p-3 border rounded-lg shadow-lg bg-white'>
      <div className='m-auto relative w-64 h-64'>
        <Image 
          src={product.images[0]} 
          alt={product.title} 
          layout='fill'
          className='object-cover rounded-lg'
        />
      </div>
      <h3 className='text-xl font-semibold mt-2'>{product.title}</h3>
      <p className='text-gray-600'>{truncateDescription(product.description)}</p>
      <div className='flex justify-between items-center mt-2'>
        <p className='text-gray-800 font-bold text-lg'>Rs. {product.price.toFixed(0)}</p>
        <p className='text-gray-600'>Stock: {product.stock_quantity}</p>
      </div>
      <div className='flex justify-between gap-4 mt-2'>
        <button className='bg-yellow-500 text-white px-4 py-1 rounded'>Edit</button>
        <button className='bg-red-500 text-white px-4 py-1 rounded'>Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;
