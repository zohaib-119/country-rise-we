import React from 'react';
import Image from 'next/image'; // Import the `next/image` component
import { images } from '@/constants';
import { CldImage } from 'next-cloudinary';
import { FaTrash, FaEdit, FaBox } from 'react-icons/fa';

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
const ProductCard = ({ product, handleChangeStock, handleDelete, handleEdit }) => {
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
        {product.images.length > 0 ?
          <CldImage
            src={product.images[0]}
            width="500"
            height="500"
            crop={{
              type: 'auto',
              source: true
            }}
            alt={product.title}
            className='rounded-lg'
          /> : <Image
            src={images.noImage}
            alt={product.title}
            layout='fill'
            className='object-cover rounded-lg'
          />
        }
      </div>
      <h3 className='text-xl font-semibold mt-2'>{product.title}</h3>
      <p className='text-gray-600'>{truncateDescription(product.description)}</p>
      <div className='flex justify-between items-center mt-2'>
        <p className='text-gray-800 font-bold text-lg'>Rs. {product.price.toFixed(0)}</p>
        <p className='text-gray-600'>Stock: {product.stock_quantity}</p>
      </div>
      <div className="flex justify-end gap-4 mt-2">
        {/* Update Stock Button */}
        <button
          className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-x-1"
          onClick={handleChangeStock}
          title="Update Stock"
        >
          <FaBox size={14} />
          <span>Stock</span>
        </button>

        {/* Edit Button */}
        <button
          className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-x-1"
          onClick={() => handleEdit(product.id)}
          title="Edit Product"
        >
          <FaEdit size={14} />
          <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-x-1"
          onClick={handleDelete}
          title="Delete Product"
        >
          <FaTrash size={14} />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
