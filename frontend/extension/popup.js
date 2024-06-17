document.addEventListener('DOMContentLoaded', () => {
  const bookmarkInfoDiv = document.getElementById('bookmark-info');
  const categorySelect = document.getElementById('category-select');
  const saveButton = document.getElementById('save-button');
  const viewBookmarksButton = document.getElementById('view-bookmarks-button');
  const bookmarksDiv = document.getElementById('bookmarks');

  // Fetch categories 
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const categories = await response.json();
      console.log('Fetched categories:', categories); 
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchCategories();

  // Define function to classify URL
  const classifyUrl = async (title, url) => {
    const response = await fetch('http://localhost:5000/api/bookmarks/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, url })
    });
    const data = await response.json();
    return data.category;
  };

  // Fetch the bookmark from local storage and classify it
  chrome.storage.local.get(['newlyCreatedBookmark'], async (result) => {
    const bookmark = result.newlyCreatedBookmark;
    if (bookmark) {
      bookmarkInfoDiv.innerHTML = `<h2>${bookmark.title}</h2><p>${bookmark.url}</p>`;
      try {
        const category = await classifyUrl(bookmark.title, bookmark.url);
        categorySelect.value = category;
      } catch (error) {
        console.error('Error classifying bookmark:', error);
      }
    } else {
      bookmarkInfoDiv.innerHTML = `<p>No bookmark found.</p>`;
    }
  });

  // Save bookmark + category
  saveButton.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
      chrome.storage.local.get(['newlyCreatedBookmark'], (result) => {
        const bookmark = result.newlyCreatedBookmark;
        if (bookmark) {
          fetch('http://localhost:5000/api/bookmarks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: bookmark.title,
              url: bookmark.url,
              category: selectedCategory,
            }),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Bookmark saved:', data);
              chrome.storage.local.remove(['newlyCreatedBookmark']);
              window.close();
            })
            .catch(error => console.error('Error saving bookmark:', error));
        }
      });
    } else {
      alert('Please select a category.');
    }
  });

  // Fetch bookmarks category-wise
  viewBookmarksButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookmarks');
      const bookmarks = await response.json();
      bookmarksDiv.innerHTML = ''; 
      const categoryMap = new Map();

      bookmarks.forEach(bookmark => {
        if (!categoryMap.has(bookmark.category)) {
          categoryMap.set(bookmark.category, []);
        }
        categoryMap.get(bookmark.category).push(bookmark);
      });

      categoryMap.forEach((bookmarks, category) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        bookmarks.forEach(bookmark => {
          const bookmarkDiv = document.createElement('div');
          bookmarkDiv.className = 'bookmark';
          bookmarkDiv.innerHTML = `
            <p>${bookmark.title}</p>
            <p><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></p>
          `;
          categoryDiv.appendChild(bookmarkDiv);
        });
        bookmarksDiv.appendChild(categoryDiv);
        viewBookmarksButton.style.display = 'none';
      });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  });
});
