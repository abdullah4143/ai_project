"use client";


const categoriesData = {
  Sports: [
    { title: "Ali vs. Frazier: The Final Bell", date: "March 19, 1974" },
    { title: "The Wild Ride of Evel Knievel", date: "April 5, 1975" },
    { title: "How the 70s Changed Baseball", date: "Jan 8, 1976" },
  ],
  Politics: [
    { title: "Watergate Fallout Still Lingers", date: "Feb 12, 1976" },
    { title: "Nixon’s Comeback? Not So Fast", date: "Feb 29, 1976" },
    { title: "A New Era for American Voters", date: "March 1, 1976" },
  ],
  Drama: [
    { title: "Cassavetes' Take on Modern Love", date: "Dec 23, 1975" },
    { title: "Gena Rowlands' Rise", date: "March 2, 1976" },
    { title: "Why Indie Films Matter", date: "March 15, 1976" },
  ],
};

export default function CategoriesSection() {

  return (
    <div className="font-sans px-4 py-10 bg-white text-gray-900 space-y-12">
      

      {/* Categories Section */}
      <section className="space-y-12">
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Categories</h2>

        {Object.entries(categoriesData).map(([category, articles], idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{category}</h3>
              <a href={`/category/${category.toLowerCase()}`} className="text-sm text-blue-700 hover:underline">
                View All →
              </a>
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              {articles.map((article, i) => (
                <div
                  key={i}
                  className="min-w-[220px] border p-3 shadow-sm bg-white hover:shadow-md transition duration-200"
                >
                  <h4 className="font-bold text-md">{article.title}</h4>
                  <p className="text-xs text-gray-500 mt-2">{article.date}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
