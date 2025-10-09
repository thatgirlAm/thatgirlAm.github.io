document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const originalText = '[Amaëlle DIOP]';
        let currentText = '';
        let index = 0;
        let isDeleting = false;
        
        function typeWriter() {
            if (!isDeleting && index < originalText.length) {
                currentText += originalText.charAt(index);
                index++;
            } else if (isDeleting && index > 0) {
                currentText = currentText.slice(0, -1);
                index--;
            }
            
            typewriterElement.textContent = currentText;
            
            let speed = isDeleting ? 50 : 100;
            
            if (!isDeleting && index === originalText.length) {
                speed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                speed = 500; // Pause before starting again
            }
            
            setTimeout(typeWriter, speed);
        }
        
        // Start the effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // --- Dropdown Navigation Logic ---
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            // Prevent the default link behavior for dropdown toggles
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            // Optional: Add logic to close dropdowns programmatically if needed
        }
    });

    // --- Project Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Ensure filtering works by adding event listeners with more explicit selectors
    function initializeFiltering() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                
                // Apply filtering
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                    } else {
                        const cardCategory = card.getAttribute('data-category');
                        if (cardCategory === filterValue) {
                            card.style.display = 'block';
                            card.classList.remove('hidden');
                        } else {
                            card.style.display = 'none';
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // Initialize filtering if buttons exist
    if (filterButtons.length > 0 && projectCards.length > 0) {
        initializeFiltering();
    }

    // --- Intersection Observer for fade-in animations ---
    const fadeElems = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElems.forEach(el => observer.observe(el));


    // --- Project Modal Logic ---
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.querySelector('.modal-close');

    if (modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalDescription = document.getElementById('modal-description');
        const modalTech = document.getElementById('modal-tech');
        const modalLinks = document.getElementById('modal-links');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const youtubeContainer = document.getElementById('modal-youtube-container');
        const youtubeIframe = document.getElementById('modal-youtube-iframe');
        const videoDescription = document.getElementById('video-description');
        const videoDescriptionText = document.getElementById('video-description-text');
        const videoTab = document.getElementById('video-tab');
        const imagesTab = document.getElementById('images-tab');
        const mediaTabs = document.getElementById('media-tabs');
        const videoSubTabs = document.getElementById('video-sub-tabs');

        let currentImages = [];
        let currentIndex = 0;
        let currentYouTubeIds = [];
        let currentYouTubeTitles = [];
        let currentVideoDescriptions = [];
        let currentVideoIndex = 0;
        let currentMediaType = 'images'; // 'images' or 'video'

        function showImages() {
            modalImage.style.display = 'block';
            youtubeContainer.style.display = 'none';
            if (videoDescription) videoDescription.classList.add('hidden');
            // Hide video sub-tabs when viewing images
            videoSubTabs.classList.remove('show');
            prevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
            currentMediaType = 'images';
            
            imagesTab.classList.add('active');
            videoTab.classList.remove('active');
            
            if (currentImages.length > 0) {
                modalImage.src = currentImages[currentIndex];
            }
        }

        function showVideo() {
            modalImage.style.display = 'none';
            youtubeContainer.style.display = 'block';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            currentMediaType = 'video';
            
            videoTab.classList.add('active');
            imagesTab.classList.remove('active');
            
            // Show video sub-tabs if multiple videos
            if (currentYouTubeIds.length > 1) {
                videoSubTabs.classList.add('show');
            }
            
            if (currentYouTubeIds.length > 0) {
                youtubeIframe.src = `https://www.youtube.com/embed/${currentYouTubeIds[currentVideoIndex]}`;
                
                // Show video description if available
                if (videoDescription && videoDescriptionText && currentVideoDescriptions.length > 0) {
                    const description = currentVideoDescriptions.length > 1 ? 
                        currentVideoDescriptions[currentVideoIndex] : 
                        currentVideoDescriptions[0];
                    if (description) {
                        videoDescriptionText.textContent = description;
                        videoDescription.classList.remove('hidden');
                    } else {
                        videoDescription.classList.add('hidden');
                    }
                } else if (videoDescription) {
                    videoDescription.classList.add('hidden');
                }
            }
        }

        function createVideoSubTabs() {
            videoSubTabs.innerHTML = '';
            if (currentYouTubeIds.length > 1) {
                currentYouTubeTitles.forEach((title, index) => {
                    const button = document.createElement('button');
                    button.className = 'video-sub-tab';
                    button.textContent = title.trim();
                    if (index === 0) button.classList.add('active');
                    
                    button.addEventListener('click', () => {
                        // Remove active from all sub-tabs
                        videoSubTabs.querySelectorAll('.video-sub-tab').forEach(tab => 
                            tab.classList.remove('active')
                        );
                        // Add active to clicked tab
                        button.classList.add('active');
                        
                        // Update video
                        currentVideoIndex = index;
                        youtubeIframe.src = `https://www.youtube.com/embed/${currentYouTubeIds[index]}`;
                        
                        // Update video description
                        if (videoDescription && videoDescriptionText && currentVideoDescriptions.length > 0) {
                            const description = currentVideoDescriptions[index] || currentVideoDescriptions[0];
                            if (description) {
                                videoDescriptionText.textContent = description;
                                videoDescription.classList.remove('hidden');
                            } else {
                                videoDescription.classList.add('hidden');
                            }
                        }
                    });
                    
                    videoSubTabs.appendChild(button);
                });
                
                // Show video sub-tabs only when video tab is active
                if (currentMediaType === 'video') {
                    videoSubTabs.classList.add('show');
                } else {
                    videoSubTabs.classList.remove('show');
                }
            } else {
                videoSubTabs.classList.remove('show');
            }
        }

        function updateGallery() {
            if (currentMediaType === 'images') {
                showImages();
            } else {
                showVideo();
            }
        }

        function showNextImage() {
            if (currentMediaType === 'images' && currentImages.length > 1) {
                currentIndex = (currentIndex + 1) % currentImages.length;
                modalImage.src = currentImages[currentIndex];
            }
        }

        function showPrevImage() {
            if (currentMediaType === 'images' && currentImages.length > 1) {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                modalImage.src = currentImages[currentIndex];
            }
        }

        function openModal(data) {
            modalTitle.textContent = data.title;
            modalDescription.innerHTML = data.description;
            
            // Handle category tag and organization info
            const categoryTag = document.getElementById('modal-category-tag');
            const organizationInfo = document.getElementById('modal-organization-info');
            const organizationLogo = document.getElementById('modal-organization-logo');
            const organizationName = document.getElementById('modal-organization-name');
            
            if (categoryTag) {
                categoryTag.textContent = data.category === 'professional' ? 'Professional' : 'School Project';
                categoryTag.className = `category-tag ${data.category}`;
            }
            
            // Handle organization info (company for professional, school for education)
            if (organizationInfo) {
                if (data.category === 'professional' && data.company) {
                    organizationName.textContent = data.company;
                    if (data.companyLogo) {
                        organizationLogo.src = data.companyLogo;
                        organizationLogo.alt = `${data.company} Logo`;
                        organizationLogo.style.display = 'block';
                    } else {
                        organizationLogo.style.display = 'none';
                    }
                    organizationInfo.style.display = 'flex';
                } else if (data.category === 'school' && data.school) {
                    organizationName.textContent = data.school;
                    if (data.schoolLogo) {
                        organizationLogo.src = data.schoolLogo;
                        organizationLogo.alt = `${data.school} Logo`;
                        organizationLogo.style.display = 'block';
                    } else {
                        organizationLogo.style.display = 'none';
                    }
                    organizationInfo.style.display = 'flex';
                } else {
                    organizationInfo.style.display = 'none';
                }
            }
            
            // Populate tech tags
            modalTech.innerHTML = '';
            data.tech.split(',').forEach(tag => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = tag.trim();
                modalTech.appendChild(span);
            });
            
            // Populate links
            modalLinks.innerHTML = '';
            if (data.liveUrl && data.liveUrl !== '#') {
                const liveLink = document.createElement('a');
                liveLink.href = data.liveUrl;
                liveLink.className = 'btn';
                liveLink.textContent = 'View Live';
                liveLink.target = '_blank';
                modalLinks.appendChild(liveLink);
            }
            if (data.repoUrl && data.repoUrl !== '#') {
                const repoLink = document.createElement('a');
                repoLink.href = data.repoUrl;
                repoLink.className = 'btn btn-secondary';
                repoLink.textContent = 'GitHub Repo';
                repoLink.target = '_blank';
                modalLinks.appendChild(repoLink);
            }

            // Handle media (YouTube videos + images)
            currentImages = data.images ? data.images.split(',') : [];
            
            // Handle multiple YouTube videos
            if (data.youtubeIds) {
                currentYouTubeIds = data.youtubeIds.split(',');
                currentYouTubeTitles = data.youtubeTitles ? data.youtubeTitles.split(',') : 
                    currentYouTubeIds.map((_, index) => `Video ${index + 1}`);
                currentVideoDescriptions = data.videoDescriptions ? data.videoDescriptions.split(',') : [];
            } else if (data.youtubeId) {
                // Backward compatibility for single video
                currentYouTubeIds = [data.youtubeId];
                currentYouTubeTitles = ['Demo'];
                currentVideoDescriptions = data.videoDescription ? [data.videoDescription] : [];
            } else {
                currentYouTubeIds = [];
                currentYouTubeTitles = [];
                currentVideoDescriptions = [];
            }
            
            currentVideoIndex = 0;
            currentIndex = 0;
            
            // Create video sub-tabs
            createVideoSubTabs();
            
            // Show/hide media tabs based on available content
            if (mediaTabs) {
                if (currentYouTubeIds.length > 0 && currentImages.length > 0) {
                    // Both videos and images available
                    mediaTabs.style.display = 'flex';
                    videoTab.style.display = 'block';
                    imagesTab.style.display = 'block';
                    // Default to video if available
                    currentMediaType = 'video';
                } else if (currentYouTubeIds.length > 0) {
                    // Only videos available
                    mediaTabs.style.display = 'none';
                    currentMediaType = 'video';
                } else {
                    // Only images available
                    mediaTabs.style.display = 'none';
                    currentMediaType = 'images';
                }
            }
            
            updateGallery();

            // Show modal
            modal.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        }

        function closeModal() {
            modal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            // Stop YouTube video
            if (youtubeIframe) {
                youtubeIframe.src = '';
            }
        }

        // Add click listeners to all project cards (for both projects.html and future_index.html)
        const allProjectCards = document.querySelectorAll('.project-card');
        allProjectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(card.dataset);
            });
        });

        // Event listeners for closing
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        
        // Event listeners for gallery navigation
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        
        // Event listeners for media tabs
        if (videoTab && imagesTab) {
            videoTab.addEventListener('click', showVideo);
            imagesTab.addEventListener('click', showImages);
        }
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
            if (!modal.classList.contains('hidden')) {
                if (e.key === 'ArrowRight') {
                    showNextImage();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                }
            }
        });
    }

    // --- Contact Form Success Message ---
    // Check if the page was loaded with a success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            // Scroll to the success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Remove the success parameter from URL without refreshing the page
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});