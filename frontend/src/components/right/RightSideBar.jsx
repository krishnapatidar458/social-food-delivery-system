import React from "react";
import { Filter } from "lucide-react"; // import Filter icon from lucide-react

const Suggestions = () => {
  return (
    <section className="p-7 border-l-1 h-full ">
      {/* Header section with Suggestions and Filter */}
      <div className="flex justify-between items-center mb-4 gap-5">
        <h2 className="text-sm font-semibold">Suggestions</h2>

        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-orange-500">
          <Filter className="w-6 h-6 bold" />
          <span className="text-gray-700 font-medium text-xl hover:text-orange-500">
            Filter
          </span>
        </div>
      </div>

      {/* User suggestions */}
      <div className="flex flex-col gap-4 ">
        {[1, 2, 3, 4].map((user) => (
          <div
            key={user}
            className="flex items-center gap-3 bg-gray-300 p-3 rounded-sm hover:bg-orange-100"
          >
            <div className="w-8 h-8 rounded-full bg-gray-400 " />
            <span className="text-sm font-medium">User</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between p-t-6 ">
        <div>

        </div>
        <button className="justify-end p-t-3  text-blue-600 rounded-sm hover:text-blue-800 hover:border-b-2 p-b-1">view all</button>
      </div>
    </section>
  );
};

export default Suggestions;
