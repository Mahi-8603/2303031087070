import React, { useState, useCallback } from 'react'; // Import useCallback
import './App.css'; // Create an App.css file for styling

function App() {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleInputChange = useCallback((event) => { // Use useCallback
        setLongUrl(event.target.value);
    }, []);

    const shortenUrl = useCallback(async () => { // Use useCallback
        setError(''); // Clear any previous errors
        setShortUrl(''); // Clear prev Short url
        setIsLoading(true); // Set loading to true

        try {
            const response = await fetch('/api/shorten', { // Replace with your actual backend API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();  // Assuming the backend sends error details in JSON
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setShortUrl(data.shortUrl);
        } catch (err) {
            setError(err.message);
            console.error("Error shortening URL:", err);  // Log the error to the console for debugging
        } finally {
            setIsLoading(false); // Set loading to false, whether success or failure
        }
    }, [longUrl]); // Add longUrl as a dependency

    const copyToClipboard = useCallback(() => { // Use useCallback
        navigator.clipboard.writeText(shortUrl);
        alert('Short URL copied to clipboard!');  // Simple feedback
    }, [shortUrl]); // Add shortUrl as a dependency

    return (
        <div className="container">
            <h1>URL Shortener</h1>
            <div className="input-group">
                <input
                    type="url"
                    placeholder="Enter a long URL"
                    value={longUrl}
                    onChange={handleInputChange}
                    aria-label="Long URL Input"    // Accessibility
                />
                <button onClick={shortenUrl} disabled={isLoading}>    {/*  Disable the button when loading  */}
                  {isLoading ? 'Shortening...' : 'Shorten'}  {/*  Conditional rendering of button label  */}
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            {shortUrl && (
                <div className="result">
                    <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
                    <button onClick={copyToClipboard} disabled={!shortUrl}>Copy to Clipboard</button> {/* Disable if no short URL */}
                </div>
            )}
        </div>
    );
}

export default App;