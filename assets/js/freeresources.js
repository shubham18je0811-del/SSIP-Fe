// YouTube Playlist ID
const PLAYLIST_ID = 'PLt-EyYJP3Q8YQB-9bzdwJ7myHZka1yuN8';

// YouTube Data API v3 endpoint
// To use this, you need to:
// 1. Get a YouTube Data API key from Google Cloud Console
// 2. Replace 'YOUR_API_KEY' with your actual API key
// 3. Set up a backend endpoint to avoid CORS issues (or use a serverless function)
const YOUTUBE_API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;

// Function to extract video ID from YouTube URL
function getVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Function to create video card HTML
function createVideoCard(video) {
    const videoId = video.snippet?.resourceId?.videoId || video.contentDetails?.videoId || video.id?.videoId || getVideoId(video.url);
    if (!videoId) return '';
    
    const thumbnail = video.snippet?.thumbnails?.high?.url || 
                     video.snippet?.thumbnails?.medium?.url || 
                     video.snippet?.thumbnails?.default?.url ||
                     `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const title = video.snippet?.title || 'Untitled Video';
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return `
        <div class="video-card" data-video-id="${videoId}">
            <div class="video-thumbnail">
                <img src="${thumbnail}" alt="${title}" loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${title}</h3>
            </div>
            <a href="${videoUrl}" target="_blank" class="video-link" aria-label="Watch ${title}"></a>
        </div>
    `;
}

// Function to fetch playlist videos using CORS proxy
async function fetchPlaylistWithProxy() {
    try {
        // Using allorigins.win as a CORS proxy (for development)
        // Note: For production, use your own backend endpoint
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}`)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            const playlistData = JSON.parse(data.contents);
            if (playlistData.items && playlistData.items.length > 0) {
                return playlistData.items;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching with proxy:', error);
        return null;
    }
}

// Function to fetch playlist videos directly (requires API key and backend)
async function fetchPlaylistDirect() {
    if (YOUTUBE_API_KEY === 'YOUR_API_KEY') {
        return null;
    }
    
    try {
        const response = await fetch(YOUTUBE_API_URL);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items;
        }
        return null;
    } catch (error) {
        console.error('Error fetching playlist directly:', error);
        return null;
    }
}

// Alternative: Parse playlist page (works without API but less reliable)
async function parsePlaylistPage() {
    try {
        const playlistUrl = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(playlistUrl)}`;
        
        const response = await fetch(proxyUrl);
        const html = await response.text();
        
        // Extract video data from YouTube's JSON embedded in the page
        // Look for ytInitialData in script tags or as a variable
        let ytInitialDataMatch = html.match(/var ytInitialData = ({.+?});/);
        if (!ytInitialDataMatch) {
            // Try to find it in script tags
            const scriptMatches = html.match(/<script[^>]*>var ytInitialData = ({.+?});<\/script>/s);
            if (scriptMatches) {
                ytInitialDataMatch = scriptMatches;
            }
        }
        if (!ytInitialDataMatch) {
            // Try window["ytInitialData"]
            ytInitialDataMatch = html.match(/window\["ytInitialData"\] = ({.+?});/);
        }
        
        if (ytInitialDataMatch) {
            try {
                const ytInitialData = JSON.parse(ytInitialDataMatch[1]);
                // Navigate through YouTube's complex data structure
                const contents = ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;
                
                if (contents && Array.isArray(contents)) {
                    const videos = contents
                        .filter(item => item.playlistVideoRenderer)
                        .map(item => {
                            const video = item.playlistVideoRenderer;
                            const videoId = video.videoId;
                            const title = video.title?.runs?.[0]?.text || video.title?.simpleText || 'Untitled Video';
                            const thumbnail = video.thumbnail?.thumbnails?.[video.thumbnail.thumbnails.length - 1]?.url;
                            
                            return {
                                id: { videoId: videoId },
                                snippet: {
                                    title: title,
                                    thumbnails: {
                                        high: { url: thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
                                        medium: { url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
                                        default: { url: `https://img.youtube.com/vi/${videoId}/default.jpg` }
                                    },
                                    resourceId: { videoId: videoId }
                                },
                                contentDetails: { videoId: videoId }
                            };
                        });
                    
                    if (videos.length > 0) {
                        return videos;
                    }
                }
            } catch (parseError) {
                console.log('Could not parse ytInitialData, trying alternative method');
            }
        }
        
        // Fallback: Extract video IDs using regex (simpler but less accurate)
        const videoIdRegex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        const matches = [...html.matchAll(videoIdRegex)];
        const videoIds = [...new Set(matches.map(m => m[1]))].filter(id => id.length === 11);
        
        if (videoIds.length > 0) {
            // Create video objects with thumbnails
            return videoIds.map((id, index) => ({
                id: { videoId: id },
                snippet: {
                    title: `Video ${index + 1}`,
                    thumbnails: {
                        high: { url: `https://img.youtube.com/vi/${id}/hqdefault.jpg` },
                        medium: { url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` },
                        default: { url: `https://img.youtube.com/vi/${id}/default.jpg` }
                    },
                    resourceId: { videoId: id }
                },
                contentDetails: { videoId: id }
            }));
        }
        
        return null;
    } catch (error) {
        console.error('Error parsing playlist page:', error);
        return null;
    }
}

// Function to load videos from YouTube playlist
async function loadPlaylistVideos() {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Loading videos from playlist...</div>';
    
    let videos = null;
    
    // Try different methods to fetch videos
    // Method 1: Direct API call (requires API key and backend)
    videos = await fetchPlaylistDirect();
    
    // Method 2: Using CORS proxy
    if (!videos) {
        videos = await fetchPlaylistWithProxy();
    }
    
    // Method 3: Parse playlist page
    if (!videos) {
        videos = await parsePlaylistPage();
    }
    
    if (videos && videos.length > 0) {
        displayVideos(videos);
    } else {
        // Fallback: Show playlist embed
        showPlaylistEmbed();
    }
}

// Function to show playlist embed as fallback
function showPlaylistEmbed() {
    const container = document.getElementById('videoContainer');
    container.innerHTML = `
        <div class="playlist-embed-container">
            <iframe 
                src="https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&loop=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="playlist-iframe">
            </iframe>
        </div>
        <p style="text-align: center; margin-top: 1.5rem; color: var(--text-gray);">
            <a href="https://www.youtube.com/playlist?list=${PLAYLIST_ID}" target="_blank" class="btn primary-btn">
                <i class="fab fa-youtube"></i> View Full Playlist on YouTube
            </a>
        </p>
    `;
    
    // Hide scroll buttons for embed
    document.getElementById('scrollLeft').style.display = 'none';
    document.getElementById('scrollRight').style.display = 'none';
}

// Function to display videos in horizontal scroll
function displayVideos(videos) {
    const container = document.getElementById('videoContainer');
    
    if (!videos || videos.length === 0) {
        container.innerHTML = '<div class="error-message">No videos found in the playlist.</div>';
        // Hide scroll buttons if no videos
        const scrollLeftBtn = document.getElementById('scrollLeft');
        const scrollRightBtn = document.getElementById('scrollRight');
        if (scrollLeftBtn) scrollLeftBtn.style.display = 'none';
        if (scrollRightBtn) scrollRightBtn.style.display = 'none';
        return;
    }
    
    container.innerHTML = videos.map(video => createVideoCard(video)).join('');
    
    // Show scroll buttons and initialize them
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    if (scrollLeftBtn) scrollLeftBtn.style.display = 'flex';
    if (scrollRightBtn) scrollRightBtn.style.display = 'flex';
    
    // Initialize scroll buttons after a short delay to ensure DOM is ready
    setTimeout(() => {
        initScrollButtons();
    }, 100);
}

// Function to initialize scroll buttons
function initScrollButtons() {
    const scrollContainer = document.querySelector('.video-scroll-container');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;
    
    // Scroll left
    scrollLeftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -400,
            behavior: 'smooth'
        });
    });
    
    // Scroll right
    scrollRightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: 400,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll buttons based on scroll position
    const updateScrollButtons = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        scrollLeftBtn.style.display = scrollLeft > 0 ? 'flex' : 'none';
        scrollRightBtn.style.display = scrollLeft < scrollWidth - clientWidth - 10 ? 'flex' : 'none';
    };
    
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
    
    // Update on window resize
    window.addEventListener('resize', updateScrollButtons);
}

// Alternative: Manual video list (if API doesn't work)
// You can manually add video IDs here as a fallback
const MANUAL_VIDEO_LIST = [
    // Add video IDs here if needed
    // Example: 'dQw4w9WgXcQ'
];

// Function to load videos manually (fallback)
function loadManualVideos() {
    if (MANUAL_VIDEO_LIST.length === 0) return;
    
    // This would require additional API calls to get video details
    // For now, we'll rely on the playlist embed or API approach
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylistVideos();
});

