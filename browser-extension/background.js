// SaveStack Browser Extension - Background Service Worker

const SAVESTACK_URL = 'https://social-hub-687.preview.emergentagent.com';
const API_URL = `${SAVESTACK_URL}/api`;

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  // Context menu for links
  chrome.contextMenus.create({
    id: 'savestack-link',
    title: 'Save link to SaveStack',
    contexts: ['link']
  });

  // Context menu for page
  chrome.contextMenus.create({
    id: 'savestack-page',
    title: 'Save this page to SaveStack',
    contexts: ['page']
  });

  // Context menu for images
  chrome.contextMenus.create({
    id: 'savestack-image',
    title: 'Save image to SaveStack',
    contexts: ['image']
  });

  // Context menu for videos
  chrome.contextMenus.create({
    id: 'savestack-video',
    title: 'Save video to SaveStack',
    contexts: ['video']
  });

  console.log('SaveStack extension installed');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url, title, thumbnailUrl, contentType;

  switch (info.menuItemId) {
    case 'savestack-link':
      url = info.linkUrl;
      title = info.selectionText || 'Saved Link';
      contentType = 'article';
      break;
    case 'savestack-page':
      url = tab.url;
      title = tab.title;
      contentType = 'article';
      break;
    case 'savestack-image':
      url = info.srcUrl;
      thumbnailUrl = info.srcUrl;
      title = 'Saved Image';
      contentType = 'image';
      break;
    case 'savestack-video':
      url = info.srcUrl || info.pageUrl;
      title = 'Saved Video';
      contentType = 'video';
      break;
  }

  // Detect platform from URL
  const platform = detectPlatform(url);

  // Open SaveStack with pre-filled data
  const saveUrl = `${SAVESTACK_URL}/dashboard?save=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&platform=${platform}&type=${contentType}${thumbnailUrl ? '&thumbnail=' + encodeURIComponent(thumbnailUrl) : ''}`;
  
  chrome.tabs.create({ url: saveUrl });
});

// Detect platform from URL
function detectPlatform(url) {
  if (!url) return 'other';
  
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('instagram.com')) return 'instagram';
  if (urlLower.includes('tiktok.com')) return 'tiktok';
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
  if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) return 'pinterest';
  if (urlLower.includes('linkedin.com')) return 'linkedin';
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
  
  return 'other';
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'quickSave') {
    // Quick save current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const platform = detectPlatform(tab.url);
      const saveUrl = `${SAVESTACK_URL}/dashboard?save=true&url=${encodeURIComponent(tab.url)}&title=${encodeURIComponent(tab.title)}&platform=${platform}&type=article`;
      chrome.tabs.create({ url: saveUrl });
      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getPageInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      sendResponse({
        url: tab.url,
        title: tab.title,
        platform: detectPlatform(tab.url)
      });
    });
    return true;
  }
});
