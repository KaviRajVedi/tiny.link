import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customShort, setCustomShort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ✅ **Stricter URL validation function**
  const isValidUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl.trim());

      // Ensure protocol is http or https
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        return false;
      }

      // Check for a valid hostname (no invalid characters like "-example.com")
      if (
        !/^[a-zA-Z0-9.-]+$/.test(urlObj.hostname) || // No special characters in domain
        urlObj.hostname.startsWith("-") || // No leading "-"
        urlObj.hostname.endsWith("-") || // No trailing "-"
        !urlObj.hostname.includes(".") // Must have a valid TLD (e.g., .com)
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const shortenUrl = async () => {
    setError("");
    setShortUrl("");

    if (!url.trim()) {
      setError("Please enter a URL before shortening.");
      return;
    }

    if (!isValidUrl(url)) {
      setError(
        "Invalid URL! Please enter a valid URL (e.g., https://example.com)."
      );
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to shorten URLs.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalUrl: url.trim(),
          customShortCode: customShort.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message || "Failed to shorten URL.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-white font-poppins mb-4">
          Shorten Your URL
        </h1>
        <p className="text-white mb-6">Generate shareable links in seconds.</p>

        <input
          className="w-11/12 p-4 mb-4 bg-white bg-opacity-90 border border-indigo-500 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-500 text-gray-800"
          type="url"
          placeholder="Enter your URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="w-11/12 p-4 mb-4 bg-white bg-opacity-90 border border-indigo-500 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-500 text-gray-800"
          type="text"
          placeholder="Custom short code (optional)"
          value={customShort}
          onChange={(e) => setCustomShort(e.target.value)}
        />

        <button
          className="w-full p-3 text-white font-semibold text-lg rounded-3xl shadow-md transition-all duration-300 bg-white/10 backdrop-blur-lg hover:shadow-lg disabled:opacity-50 flex justify-center items-center"
          onClick={shortenUrl}
          disabled={loading}
        >
          Make it{" "}
          <span className="text-white pacifico-regular ml-2"> tiny</span>
        </button>

        {error && <p className="text-orange-300 font-light mt-4">{error}</p>}

        {shortUrl && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md flex items-center justify-between">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="text-gray-600 hover:text-blue-600"
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
