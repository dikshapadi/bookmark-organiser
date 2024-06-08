chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    console.log('Bookmark Created:', bookmark);
    chrome.storage.local.set({ newlyCreatedBookmark: bookmark }, () => {
      console.log('Bookmark stored in chrome.storage.local:', bookmark);
      chrome.action.setPopup({ popup: 'popup.html' }); // read docs from chrome, doesnt work yet, no API yet
    });
});
  