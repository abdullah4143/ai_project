'use client'
export default function SuggestedArticles(){
    return (
        <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Suggested Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "The Quiet Cool of Paul Newman",
              subtitle: "Why he's still the gold standard of charisma.",
              date: "March 10, 1976",
            },
            {
              title: "10 Films You Missed in 1975",
              subtitle: "A love letter to the lesser-known cinematic gems.",
              date: "Feb 25, 1976",
            },
            {
              title: "When Hitchcock Went Hollywood",
              subtitle: "The transformation of suspense with style.",
              date: "March 2, 1976",
            },
          ].map((article, i) => (
            <div key={i} className="border p-4 shadow-sm hover:shadow-md transition duration-200">
              <h3 className="font-bold text-lg">{article.title}</h3>
              <p className="text-sm mt-1 text-gray-700">{article.subtitle}</p>
              <p className="text-xs text-gray-500 mt-2">{article.date}</p>
            </div>
          ))}
        </div>
      </section>
    )
}