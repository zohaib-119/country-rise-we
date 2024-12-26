'use client'

import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Image from 'next/image';

// Mock data
const product = {
    id: 1,
    name: "Elegant Wooden Chair",
    description: "A beautifully crafted wooden chair perfect for your living room.",
    price: 249.99,
    stockQuantity: 20,
    reviewsCount: 18,
    averageRating: 4.5,
    soldCount: 150,
    category: 'Wooden Products',
    images: [
        "https://media.istockphoto.com/id/1317323736/photo/a-view-up-into-the-trees-direction-sky.jpg?s=612x612&w=0&k=20&c=i4HYO7xhao7CkGy7Zc_8XSNX_iqG0vAwNsrH1ERmw2Q=", // Mock image URL
        "https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg"
    ]
};

const reviews = [
    {
        id: 1,
        buyerName: "John Doe",
        rating: 5,
        comment: "Fantastic product! High quality and worth every penny.",
        createdAt: "2024-12-01"
    },
    {
        id: 2,
        buyerName: "Jane Smith",
        rating: 4,
        comment: "Looks great, but took a while to assemble.",
        createdAt: "2024-12-10"
    },
    {
        id: 3,
        buyerName: "Ali Khan",
        rating: 4,
        comment: "Good value for the price.",
        createdAt: "2024-12-15"
    }
];

const ProductDetails = () => {
    const [imageIndex, setImageIndex] = useState(0);

    const handleDeleteReview = (reviewId) => {
        alert('Delete Review clicked for ', reviewId);
    };

    return (
        <div className="bg-white min-h-screen text-gray-800 p-6">
            {/* Product */}
            <div className="mx-auto flex justify-center items-center gap-10 max-w-4xl rounded-lg shadow-md my-10">
                <div className="w-1/2 object-contain">
                    {product.images.length > 0 ? (
                        <Image
                            src={product.images[imageIndex]}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                <div className="w-1/2 p-4">
                    <h1 className="text-2xl font-bold text-blue-600">{product.name}</h1>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-blue-500 font-semibold text-2xl">Rs. {Math.floor(product.price)}</p>
                    <div className="flex justify-between mt-3">
                        <span className="text-gray-500">Stock: {product.stockQuantity > 0 ? product.stockQuantity : 'Out of stock'}</span>
                        <span className="text-gray-500">Category: {product.category}</span>
                    </div>
                    <div className="mt-3">
                        <span className="text-blue-500 font-semibold text-xl">
                            {"★".repeat(Math.floor(product.averageRating))}
                            {"☆".repeat(5 - Math.floor(product.averageRating))}
                        </span>
                        <span className="text-gray-500 ml-2">({product.reviewsCount} reviews)</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-gray-600">Sold: {product.soldCount}</span>
                    </div>
                    <div className="flex gap-4 mt-4">
                        {product.images.length > 0 && product.images.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={product.name}
                                width={100}
                                height={100}
                                className="rounded object-cover cursor-pointer border-2 border-blue-500 hover:opacity-80"
                                onClick={() => setImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Reviews Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">Reviews</h2>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-4 bg-gray-100 rounded-lg shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-blue-600">{review.buyerName}</h3>
                                    <span className="text-yellow-500 font-semibold">
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p className="text-gray-700 mt-2">{review.comment}</p>
                                <div className="flex justify-between mt-2">
                                    <p className="text-gray-500 text-sm">Reviewed on {review.createdAt}</p>
                                    <button
                                        className="bg-red-500 text-white py-1 px-2 rounded-2xl hover:bg-red-600"
                                        onClick={() => handleDeleteReview(review.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
