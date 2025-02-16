import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { motion } from "framer-motion";

const Newsroom = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const querySnapshot = await getDocs(collection(db, "news"));
      const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(newsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setSelectedNews(newsData[0]); // Select latest news initially
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row p-6 text-white">
      {/* Timeline (Left Column) */}
      <div className="w-full lg:w-1/4 border-r border-gray-700 pr-4">
        <h2 className="text-xl font-bold mb-4">Timeline</h2>
        <ul>
          {news.map((item) => (
            <motion.li
              key={item.id}
              className={`cursor-pointer p-2 hover:bg-gray-800 rounded ${selectedNews?.id === item.id ? "bg-gray-700" : ""}`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedNews(item)}
            >
              {new Date(item.date).toLocaleDateString()}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* News Content (Right Column) */}
      <div className="w-full lg:w-3/4 pl-6">
        {selectedNews && (
          <motion.div
            key={selectedNews.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-2">{selectedNews.headline}</h2>
            <p className="text-sm text-gray-400">{new Date(selectedNews.date).toLocaleDateString()}</p>
            <img src={selectedNews.image} alt={selectedNews.headline} className="rounded-lg mt-4 mb-4 w-full max-h-96 object-cover" />
            <p className="text-lg">{selectedNews.description}</p>
            <a href={selectedNews.link} className="text-blue-400 mt-4 block" target="_blank" rel="noopener noreferrer">
              Read More →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Newsroom;
