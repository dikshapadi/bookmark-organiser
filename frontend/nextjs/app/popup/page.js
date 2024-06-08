"use client"
import { useState, useEffect } from 'react';

export default function Popup() {
  const [bookmark, setBookmark] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchBookmark = () => {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'bookmarkStored') {
          chrome.storage.local.get(['newlyCreatedBookmark'], (result) => {
            console.log('Retrieved bookmark from chrome.storage.local:', result.newlyCreatedBookmark); 
            setBookmark(result.newlyCreatedBookmark);
          });
        }
      });
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        console.log('Fetched categories:', data); 
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBookmark();
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (bookmark && selectedCategory) {
      try {
        const response = await fetch('http://localhost:5000/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: bookmark.title,
            url: bookmark.url,
            category: selectedCategory,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Bookmark saved:', data);
          chrome.storage.local.remove(['newlyCreatedBookmark']); 
          window.close();
        } else {
          console.error('Error saving bookmark:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Bookmark or selected category is missing.');
    }
  };

  return (
    <div>
      <h1>Choose Category</h1>
      {bookmark ? (
        <div>
          <h2>{bookmark.title}</h2>
          <p>{bookmark.url}</p>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <button onClick={handleSave}>Save Bookmark</button>
        </div>
      ) : (
        <p>Loading bookmark...</p>
      )}
    </div>
  );
}
