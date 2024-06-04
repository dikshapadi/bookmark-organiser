chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('Bookmark Created:', bookmark); // Debug log
  chrome.storage.local.set({ newlyCreatedBookmark: bookmark }, () => {
    console.log('Bookmark stored in chrome.storage.local:', bookmark); // Debug log
    chrome.runtime.sendMessage({ action: 'bookmarkStored' });
  });
});
