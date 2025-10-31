// Load courses from JSON file
let allCourses = [];
let filteredCourses = [];

async function loadCourses() {
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) {
        console.error('Course grid element not found');
        return;
    }

    // Try multiple path variations
    const paths = [
        'data/courses.json',
        './data/courses.json',
        '../data/courses.json',
        '/data/courses.json'
    ];

    let response = null;
    let error = null;

    for (const path of paths) {
        try {
            response = await fetch(path);
            if (response.ok) {
                break;
            }
        } catch (err) {
            error = err;
            continue;
        }
    }

    if (!response || !response.ok) {
        console.error('Error loading courses:', error || 'All fetch attempts failed');
        courseGrid.innerHTML = 
            '<div style="text-align: center; padding: 2rem; color: var(--text-gray);">' +
            '<i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--secondary-blue);"></i>' +
            '<p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Error loading courses.</p>' +
            '<small style="display: block; margin-bottom: 1rem;">Make sure you are using a local server:</small>' +
            '<code style="background: var(--light-beige); padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-bottom: 1rem;">python3 -m http.server 8000</code>' +
            '<p style="font-size: 0.9rem; color: var(--text-gray); margin-top: 1rem;">Then visit: <strong>http://localhost:8000/courses.html</strong></p>' +
            '</div>';
        return;
    }

    try {
        allCourses = await response.json();
        console.log('Courses loaded successfully:', allCourses.length, 'courses');
        if (!Array.isArray(allCourses)) {
            throw new Error('Courses data is not an array');
        }
        filteredCourses = [...allCourses];
        console.log('Rendering courses...');
        renderCourses(allCourses);
        setupFilterButtons();
        console.log('Courses rendered successfully');
    } catch (error) {
        console.error('Error parsing courses JSON:', error);
        courseGrid.innerHTML = 
            '<div style="text-align: center; padding: 2rem; color: var(--text-gray);">' +
            '<i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--secondary-blue);"></i>' +
            '<p>Error parsing courses data. Please check data/courses.json file.</p>' +
            '<p style="margin-top: 1rem; font-size: 0.9rem;">Error: ' + error.message + '</p>' +
            '</div>';
    }
}

function renderCourses(courses) {
    const courseGrid = document.getElementById('courseGrid');
    const noResults = document.getElementById('noResults');
    
    console.log('renderCourses called with', courses.length, 'courses');
    
    if (!courseGrid) {
        console.error('Course grid element not found!');
        return;
    }
    
    if (courses.length === 0) {
        console.log('No courses to display');
        courseGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    console.log('Setting grid display and generating HTML...');
    courseGrid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    
    // Define unique poster designs for each course (fallback)
    const getFallbackDesign = (courseId) => {
        const posterDesigns = {
            1: { // Maha Granth
                gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
                icon: 'fas fa-graduation-cap',
                iconSize: '4rem',
                pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            },
            2: { // Spark
                gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                icon: 'fas fa-sparkles',
                iconSize: '4rem',
                pattern: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/svg%3E")'
            },
            3: { // UP Special
                gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                icon: 'fas fa-map-marked-alt',
                iconSize: '4rem',
                pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }
        };

        return posterDesigns[courseId] || {
            gradient: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)',
            icon: 'fas fa-book',
            iconSize: '3rem',
            pattern: 'none'
        };
    };

    // Function to get course poster HTML
    const getCoursePoster = (course) => {
        // Always try to show image if poster path exists
        if (course.poster) {
            // Return simple image tag
            return `<img src="${course.poster}" alt="${course.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
        }

        // Use gradient fallback if no image specified
        const design = getFallbackDesign(course.id);
        return getGradientFallback(design);
    };

    // Helper function to create gradient fallback HTML
    function getGradientFallback(design) {
        return `
            <div style="
                width: 100%;
                height: 100%;
                background: ${design.gradient};
                background-image: ${design.pattern};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
                "></div>
                <i class="${design.icon}" style="font-size: ${design.iconSize}; color: white; position: relative; z-index: 1; text-shadow: 0 2px 10px rgba(0,0,0,0.2);"></i>
            </div>
        `;
    }

    courseGrid.innerHTML = courses.map(course => {
        const posterHtml = getCoursePoster(course);
        console.log(`Course: ${course.name}, Poster: ${course.poster}`);
        return `
        <div class="course-card">
            <div class="course-poster">
                ${posterHtml}
            </div>
            <div class="course-info">
                <h3>${course.name}</h3>
                <div class="course-faculty">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <span>${course.faculty}</span>
                </div>
                <div class="course-topics">
                    <strong>Topics:</strong> ${course.topics.join(', ')}
                </div>
                <div class="course-meta">
                    <div class="course-duration">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                    ${course.price ? `
                        <div class="course-price">
                            <i class="fas fa-rupee-sign"></i>
                            <span>${course.price}</span>
                        </div>
                    ` : ''}
                </div>
                <a href="${course.telegramLink}" target="_blank" class="telegram-btn">
                    <i class="fab fa-telegram-plane"></i>
                    Join on Telegram
                </a>
            </div>
        </div>
    `;
    }).join('');
    
    console.log('Course HTML generated successfully, total length:', courseGrid.innerHTML.length);
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    // Filter buttons (can be extended for faculty-specific filtering)
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            if (filter === 'all') {
                filteredCourses = [...allCourses];
            } else if (filter === 'faculty') {
                // Get unique faculties
                const faculties = [...new Set(allCourses.map(c => c.faculty))];
                // For now, just show all courses. Can be enhanced with a dropdown
                filteredCourses = [...allCourses];
            }
            applySearchFilter();
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applySearchFilter();
        });
    }
}

function applySearchFilter() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    if (!searchTerm) {
        renderCourses(filteredCourses);
        return;
    }

    const filtered = filteredCourses.filter(course => {
        const nameMatch = course.name.toLowerCase().includes(searchTerm);
        const facultyMatch = course.faculty.toLowerCase().includes(searchTerm);
        const topicsMatch = course.topics.some(topic => topic.toLowerCase().includes(searchTerm));
        
        return nameMatch || facultyMatch || topicsMatch;
    });

    renderCourses(filtered);
}

// Initialize when page loads
function initCourses() {
    if (document.getElementById('courseGrid')) {
        console.log('Course grid found, loading courses...');
        loadCourses();
    } else {
        console.warn('Course grid element not found on this page');
    }
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCourses);
} else {
    // DOM already loaded
    initCourses();
}

