import { FaSpinner } from "react-icons/fa";

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        {/* <p className="text-blue-600 text-lg mt-4">Loading, please wait...</p> */}
      </div>
    </div>
  );
};

export default LoadingComponent;
