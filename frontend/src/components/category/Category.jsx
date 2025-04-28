import React, { useRef } from "react";
import "./Categories.css"; // Import the CSS for custom scrollbar

const categories = [
  {
    id: 1,
    name: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 2,
    name: "Lunch",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 3,
    name: "Dinner",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 4,
    name: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1576613109757-2183d1e9d9d8?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 5,
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 6,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1578685759430-9fcc7f1b1c9c?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 7,
    name: "Snacks",
    image:
      "https://images.unsplash.com/photo-1543352634-7c1d6b7e7d1b?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 8,
    name: "Vegan",
    image:
      "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
  {
    id: 9,
    name: "Seafood",
    image:
      "https://images.unsplash.com/photo-1617196038435-df631f0c4af2?crop=entropy&cs=tinysrgb&fit=crop&w=200&q=60",
  },
];

const Categories = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 px-4 relative">
      <h2 className="text-2xl font-bold mb-10 ">Categories</h2>

      {/* Scroll Buttons */}
      <div className="hidden md:flex mt-1 absolute right-6 top-4 z-10 gap-2">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition"
        >
          ◀️
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition"
        >
          ▶️
        </button>
      </div>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 scroll-smooth snap-x snap-mandatory px-1 pb-2 relative custom-scrollbar"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer w-32 snap-center group"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-orange-400 transition">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
