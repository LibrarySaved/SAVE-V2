// SaveStack Content Script
// Injects a floating action button on social media sites

const SAVESTACK_URL = 'https://social-hub-687.emergent.host';

// Check if we're on a supported social media site
function isSocialMediaSite() {
  const url = window.location.href.toLowerCase();
  return (
    url.includes('instagram.com') ||
    url.includes('tiktok.com') ||
    url.includes('youtube.com') ||
    url.includes('twitter.com') ||
    url.includes('x.com') ||
    url.includes('pinterest.com') ||
    url.includes('linkedin.com') ||
    url.includes('facebook.com')
  );
}

// Detect platform
function detectPlatform() {
  const url = window.location.href.toLowerCase();
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('facebook.com')) return 'facebook';
  return 'other';
}

// Get content type based on URL
function detectContentType() {
  const url = window.location.href.toLowerCase();
  if (url.includes('/reel') || url.includes('/shorts')) return 'reel';
  if (url.includes('/video') || url.includes('/watch')) return 'video';
  if (url.includes('/stories')) return 'story';
  if (url.includes('/pin/')) return 'pin';
  if (url.includes('/status/')) return 'tweet';
  return 'post';
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'savestack-toast';
  toast.innerHTML = `
    <svg class="savestack-toast-icon" viewBox="0 0 24 24" fill="white">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
    </svg>
    ${message}
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Create floating action button
function createFAB() {
  if (document.querySelector('.savestack-fab')) return;
  
  const fab = document.createElement('button');
  fab.className = 'savestack-fab';
  fab.title = 'Save to SaveStack';
  fab.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
    </svg>
  `;
  
  fab.addEventListener('click', () => {
    const platform = detectPlatform();
    const contentType = detectContentType();
    const title = document.title;
    const url = window.location.href;
    
    // Try to get thumbnail
    let thumbnail = '';
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      thumbnail = ogImage.content;
    }
    
    // Open SaveStack with pre-filled data
    const saveUrl = `${SAVESTACK_URL}/dashboard?save=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&platform=${platform}&type=${contentType}${thumbnail ? '&thumbnail=' + encodeURIComponent(thumbnail) : ''}`;
    
    window.open(saveUrl, '_blank');
    showToast('Opening SaveStack...');
  });
  
  document.body.appendChild(fab);
}

// Initialize
if (isSocialMediaSite()) {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFAB);
  } else {
    createFAB();
  }
}

// Listen for keyboard shortcut (Ctrl/Cmd + Shift + S)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    const platform = detectPlatform();
    const contentType = detectContentType();
    const title = document.title;
    const url = window.location.href;
    
    const saveUrl = `${SAVESTACK_URL}/dashboard?save=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&platform=${platform}&type=${contentType}`;
    window.open(saveUrl, '_blank');
    showToast('Opening SaveStack...');
  }
});
