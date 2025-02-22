import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ClipboardIcon,
  ShareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

// Fallback quotes in case API fails
const fallbackQuotes = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    genre: "inspiration",
  },
  {
    id: "2",
    text: "Life is what happens when you’re busy making other plans.",
    author: "John Lennon",
    genre: "life",
  },
  {
    id: "3",
    text: "Love recognizes no barriers.",
    author: "Maya Angelou",
    genre: "love",
  },
  {
    id: "4",
    text: "Wisdom begins in wonder.",
    author: "Socrates",
    genre: "wisdom",
  },
];

function App() {
  const [quote, setQuote] = useState({});
  const [category, setCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ["all", "inspiration", "life", "love", "wisdom"];

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      const quoteData = response.data;
      const formattedQuote = {
        id: quoteData.id.toString(),
        text: quoteData.quote,
        author: quoteData.author,
        genre: categorizeQuote(quoteData.quote), // Simple categorization
      };
      // If category is not 'all', fetch until we get a matching genre
      if (category !== "all" && formattedQuote.genre !== category) {
        fetchQuote(); // Recursive call until match
        return;
      }
      setQuote(formattedQuote);
    } catch (error) {
      console.error("API Error:", error);
      // Use fallback quote if API fails
      const randomFallback = getRandomFallbackQuote();
      setQuote(randomFallback);
      toast.error("Using fallback quote due to API failure");
    } finally {
      setLoading(false);
    }
  };

  const categorizeQuote = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("inspir")) return "inspiration";
    if (lowerText.includes("life")) return "life";
    if (lowerText.includes("love")) return "love";
    if (lowerText.includes("wisdom") || lowerText.includes("know"))
      return "wisdom";
    return categories[Math.floor(Math.random() * (categories.length - 1)) + 1]; // Random category if no match
  };

  const getRandomFallbackQuote = () => {
    let filtered = fallbackQuotes;
    if (category !== "all") {
      filtered = fallbackQuotes.filter((q) => q.genre === category);
    }
    if (filtered.length === 0) filtered = fallbackQuotes;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  useEffect(() => {
    fetchQuote();
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (favorites.length !== 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (Object.keys(quote).length > 0) {
      fetchQuote();
    }
  }, [category]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    toast.success("Quote copied!");
  };

  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text="${quote.text}" - ${quote.author}`;
    window.open(twitterUrl, "_blank");
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some((fav) => fav.id === quote.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== quote.id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, quote]);
      toast.success("Added to favorites");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Quote Generator
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Category Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full capitalize ${
                category === cat
                  ? "bg-blue-500 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800"
                    }`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quote Card */}
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105`}
        >
          {loading || !quote.text ? (
            <p className="text-xl italic mb-4">Loading quote...</p>
          ) : (
            <>
              <p className="text-xl italic mb-4">"{quote.text}"</p>
              <p className="text-right font-semibold">- {quote.author}</p>
              <p className="text-sm text-gray-500 mt-2">Genre: {quote.genre}</p>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:text-blue-500"
                  disabled={loading}
                >
                  <ClipboardIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 hover:text-blue-500"
                  disabled={loading}
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 ${
                    favorites.some((fav) => fav.id === quote.id)
                      ? "text-red-500"
                      : ""
                  }`}
                  disabled={loading}
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* New Quote Button */}
        <button
          onClick={fetchQuote}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Loading..." : "New Quote"}
        </button>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Favorite Quotes
            </h2>
            <div className="grid gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className={`${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  } p-4 rounded-lg`}
                >
                  <p className="italic">"{fav.text}"</p>
                  <p className="text-right mt-2">- {fav.author}</p>
                  <p className="text-sm text-gray-500">Genre: {fav.genre}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
