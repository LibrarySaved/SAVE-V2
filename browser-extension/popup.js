// SaveStack Popup Script

const SAVESTACK_URL = 'https://social-hub-687.emergent.host';

document.addEventListener('DOMContentLoaded', () => {
  // Get current page info
  chrome.runtime.sendMessage({ action: 'getPageInfo' }, (response) => {
    if (response) {
      document.getElementById('pageTitle').textContent = response.title || 'Untitled';
      document.getElementById('pageUrl').textContent = response.url || '';
      
      const platformBadge = document.getElementById('platformBadge');
      platformBadge.textContent = response.platform || 'other';
      platformBadge.className = `platform-badge platform-${response.platform || 'other'}`;
    }
  });
  
  // Save button click
  document.getElementById('saveBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'quickSave' }, (response) => {
      if (response && response.success) {
        window.close();
      }
    });
  });
});
