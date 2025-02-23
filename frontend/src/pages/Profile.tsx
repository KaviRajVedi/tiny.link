import { useEffect, useState } from "react";

interface ShortUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  expiration: string;
}

const Profile = () => {
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [message, setMessage] = useState("");
  const [expirationMap, setExpirationMap] = useState<{ [key: number]: string }>(
    {}
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/url/user-urls",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setShortUrls(data);
        } else {
          setMessage(data.message || "Failed to fetch URLs.");
        }
      } catch (error) {
        console.error("Error fetching URLs:", error);
        setMessage("Failed to load URLs.");
      }
    };

    fetchUrls();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/url/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setShortUrls(shortUrls.filter((url) => url.id !== id));
        setMessage("URL deleted successfully.");
      } else {
        setMessage("Failed to delete URL.");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
      setMessage("Error deleting URL.");
    }
  };

  const handleCopy = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setMessage("Short URL copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleSetExpiration = async (id: number) => {
    const expiration = expirationMap[id];

    // Check if expiration is set
    if (!expiration) {
      setMessage("Please set a valid expiration date.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/url/${id}/set-expiration`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiration }),
        }
      );

      if (response.ok) {
        setShortUrls(
          shortUrls.map((url) => (url.id === id ? { ...url, expiration } : url))
        );
        setMessage("Expiration date updated successfully.");
      } else {
        setMessage("Failed to update expiration date.");
      }
    } catch (error) {
      console.error("Error updating expiration date:", error);
      setMessage("Error updating expiration date.");
    }
  };

  const formatExpiration = (expiration: string) => {
    return new Date(expiration).toLocaleString();
  };

  // Separate active and expired URLs
  const currentTime = new Date().getTime();
  const activeUrls = shortUrls.filter(
    (url) => new Date(url.expiration).getTime() > currentTime
  );
  const expiredUrls = shortUrls.filter(
    (url) => new Date(url.expiration).getTime() <= currentTime
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Your Shortened URLs
        </h1>

        {message && (
          <div className="mb-4 text-center text-lg text-green-600">
            {message}
          </div>
        )}

        {/* Active URLs Section */}
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Active URLs
        </h2>
        {activeUrls.length === 0 ? (
          <p className="text-center text-gray-500">No active URLs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {activeUrls.map((url) => (
              <div
                key={url.id}
                className=" bg-white border border-gray-200 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:shadow-lg hover:bg-gray-100 hover:scale-105"
              >
                <p className="text-sm text-gray-500">
                  Generated: {new Date(url.createdAt).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">
                    Terminates: {formatExpiration(url.expiration)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {url.clicks} <strong>Clicks</strong>
                  </p>
                </div>
                <p className="text-md font-semibold text-gray-700 truncate">
                  <span className="text-gray-500">Original:</span>{" "}
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {url.originalUrl}
                  </a>
                </p>

                <p className="text-md font-semibold text-blue-600 truncate">
                  <span className="text-gray-500">Short:</span>{" "}
                  <a
                    href={`http://localhost:5000/${url.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    http://localhost:5000/${url.shortCode}
                  </a>
                </p>

                {/* Set expiration date section */}
                <div className="mt-4 flex justify-center items-center">
                  <input
                    type="datetime-local"
                    value={expirationMap[url.id] || ""}
                    onChange={(e) =>
                      setExpirationMap({
                        ...expirationMap,
                        [url.id]: e.target.value,
                      })
                    }
                    className="border border-gray-300 p-2 rounded-xl"
                  />
                </div>

                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleSetExpiration(url.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    Set Expiration
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expired URLs Section */}
        <h2 className="text-2xl font-semibold text-red-600 mt-10 mb-4">
          Expired URLs
        </h2>
        {expiredUrls.length === 0 ? (
          <p className="text-center text-gray-500">No expired URLs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {expiredUrls.map((url) => (
              <div
                key={url.id}
                className="bg-gray-200 border border-gray-300 rounded-lg p-4 shadow-md"
              >
                <p className="text-sm text-gray-500">
                  Generated: {new Date(url.createdAt).toLocaleString()}
                </p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Terminated: {formatExpiration(url.expiration)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {url.clicks} <strong>Times Clicked</strong>
                  </p>
                </div>

                <p className="text-md font-semibold text-gray-700 truncate">
                  Original: {url.originalUrl}
                </p>
                <p className="text-md font-semibold text-gray-500 truncate">
                  Short: {url.shortCode}
                </p>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => handleDelete(url.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
