import React from "react";

const ApplicationSkeleton = ({ count }) => {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="block md:hidden">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="animate-pulse mb-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="mt-3">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="min-w-full divide-y divide-gray-200">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="animate-pulse flex py-4">
              <div className="px-6 py-2 w-1/4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="px-6 py-2 w-1/4">
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="px-6 py-2 w-1/4">
                <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="px-6 py-2 w-1/4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplicationSkeleton;
