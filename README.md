# BookMarkIt 
BookMarkIt is a chrome extension that allows users to save, categorize, and manage their bookmarks effectively. Leverages the OpenAI API to automate the classification of bookmarked site.
<img width="311" alt="ss1" src="https://github.com/dikshapadi/bookmark-organiser/assets/95542633/d79c9758-e230-4801-83ef-3b7a45cb3ace">

# Overview 
This project is a Chrome extension that organizes bookmarks into categories and stores them in a MongoDB database. The extension allows users to assign categories to newly created bookmarks and view all bookmarks sorted by category. In addition it also auto assigns a category when a bookmark is detected sparing the user the time and effort of going through the categories and assigning one. 

## Features 
- Detects when a new bookmark is added in Chrome.
- Prompts the user to assign a category to the new bookmark.
- Auto assigns a category as well.
- Stores bookmarks and their categories in a MongoDB database.
- Allows users to view bookmarks categorized in a carousel layout.

## Tech Stack 
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, MongoDB
- Chrome API: chrome.bookmarks, chrome.storage
- OpenAI API
  
## Results
<img width="956" alt="ss3" src="https://github.com/dikshapadi/bookmark-organiser/assets/95542633/f8e45ef6-4aa8-4eea-940d-80da89549a19">
