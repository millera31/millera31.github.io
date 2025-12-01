import { ConfigSingleton } from "./GetProfile.js";

let configData;

// Initialize and load configuration
(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        configData = configInstance.getConfig();
        updateHTML(configData);
        initializeCarousel();
        initializePDFViewer();
    } catch (error) {
        console.error('Error initializing projects:', error);
    }
})();

/**
 * Updates HTML elements with project data from configuration
 * @param {Object} configData - Configuration data containing project information
 */
function updateHTML(configData) {
    // Update navigation elements
    updateNavigation(configData);
    
    // Update each project
    updateProject(1, configData.Project1);
    updateProject(2, configData.Project2);
    updateProject(3, configData.Project3);
    updateProject(4, configData.Project4);
}

/**
 * Updates navigation menu elements
 * @param {Object} configData - Configuration data
 */
function updateNavigation(configData) {
    const thumbnail = document.querySelector("#pfThumbnail");
    const linkedIn = document.querySelector("#pfLinkedIn");
    const gitHub = document.querySelector("#pfGitHub");
    
    if (thumbnail) thumbnail.src = `Content/${configData.About.Thumbnail}`;
    if (linkedIn) linkedIn.href = configData.Contact.LinkedIn;
    if (gitHub) gitHub.href = configData.Contact.GitHub;
}

/**
 * Updates a single project's HTML elements
 * @param {number} projectNum - Project number (1-4)
 * @param {Object} projectData - Project configuration data
 */
function updateProject(projectNum, projectData) {
    const projectElement = document.querySelector(`#project${projectNum}`);
    
    if (!projectData.Title) {
        if (projectElement) projectElement.style.display = "none";
        return;
    }
    
    // Update project image
    const img = document.querySelector(`#pfProject${projectNum}Img`);
    if (img && projectData.MainImage) {
        img.src = `Content/${projectData.MainImage}`;
    }
    
    // Update project details
    const title = document.querySelector(`#pfProject${projectNum}Title`);
    const desc = document.querySelector(`#pfProject${projectNum}Desc`);
    const repo = document.querySelector(`#pfProject${projectNum}Repo`);
    const button = document.querySelector(`#openProject${projectNum}`);
    const liveDemo = document.querySelector(`#liveDemo${projectNum}`);
    
    if (title) title.textContent = projectData.Title;
    
    // Clean up description by removing SharePoint URLs
    if (desc && projectData.Desc) {
        let cleanDesc = projectData.Desc;
        
        // Remove SharePoint URL patterns
        cleanDesc = cleanDesc.replace(/System Proposal:\s*https?:\/\/[^\s<]+/gi, '');
        cleanDesc = cleanDesc.replace(/System Specification:\s*https?:\/\/[^\s<]+/gi, '');
        
        // Remove "see the:" text if it's now dangling
        cleanDesc = cleanDesc.replace(/\.\s*For more details,?\s*see the:\s*<br>\s*<br>/gi, '.');
        cleanDesc = cleanDesc.replace(/see the:\s*<br>\s*<br>/gi, '');
        
        // Clean up extra spaces and line breaks
        cleanDesc = cleanDesc.replace(/<br>\s*<br>\s*<br>/g, '<br><br>');
        cleanDesc = cleanDesc.trim();
        
        desc.innerHTML = cleanDesc;
    }
    
    // Handle GitHub repo link
    if (repo) {
        if (projectData.GitHubRepo) {
            repo.href = projectData.GitHubRepo;
        } else {
            repo.style.display = "none";
        }
    }
    
    // Hide "See More" button if no detail images
    if (button && (!projectData.DetailImages || projectData.DetailImages.length < 1)) {
        button.style.display = "none";
    }
}

/* ===================================
   IMAGE CAROUSEL FUNCTIONALITY
   =================================== */

let slideIdx = 1;

/**
 * Initializes the image carousel event listeners
 */
function initializeCarousel() {
    const nextBtn = document.querySelector("#next");
    const prevBtn = document.querySelector("#prev");
    const closeBtn = document.querySelector("#XOut");
    const modalPage = document.querySelector("#modalPage");
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => showImages(++slideIdx));
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => showImages(--slideIdx));
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCarousel);
    }
    
    // Click outside to close
    if (modalPage) {
        modalPage.addEventListener('click', (event) => {
            if (event.target === modalPage) {
                closeCarousel();
            }
        });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalPage?.style.display === 'block') {
            closeCarousel();
        }
    });
    
    // Project open buttons
    setupProjectButtons();
}

/**
 * Sets up click handlers for project "See More" buttons
 */
function setupProjectButtons() {
    const openProject1 = document.querySelector("#openProject1");
    const openProject2 = document.querySelector("#openProject2");
    const openProject3 = document.querySelector("#openProject3");
    const openProject4 = document.querySelector("#openProject4");
    
    if (openProject1) {
        openProject1.addEventListener('click', () => openCarousel(configData.Project1.DetailImages));
    }
    
    if (openProject2) {
        openProject2.addEventListener('click', () => openCarousel(configData.Project2.DetailImages));
    }
    
    if (openProject3) {
        openProject3.addEventListener('click', () => openCarousel(configData.Project3.DetailImages));
    }
    
    if (openProject4) {
        openProject4.addEventListener('click', () => openCarousel(configData.Project4.DetailImages));
    }
}

/**
 * Opens the carousel modal with given images
 * @param {Array<string>} images - Array of image filenames
 */
function openCarousel(images) {
    if (!images || images.length === 0) return;
    
    addImages(images);
    const modalPage = document.querySelector("#modalPage");
    if (modalPage) {
        modalPage.style.display = "block";
        document.body.classList.add('no-scroll'); // Prevent background scrolling
    }
    showImages(slideIdx);
}

/**
 * Closes the carousel modal
 */
function closeCarousel() {
    const modalPage = document.querySelector("#modalPage");
    if (modalPage) {
        modalPage.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
}

/**
 * Populates the carousel with images
 * @param {Array<string>} imgs - Array of image filenames
 */
function addImages(imgs) {
    const imgList = document.querySelector("#imgList");
    if (!imgList) return;
    
    // Clear existing images
    while (imgList.firstChild) {
        imgList.removeChild(imgList.firstChild);
    }
    
    // Add new images
    imgs.forEach(img => {
        const newElem = document.createElement("img");
        newElem.setAttribute("src", `Content/${img}`);
        newElem.setAttribute("alt", "Project detail image");
        imgList.appendChild(newElem);
    });
}

/**
 * Shows a specific slide in the carousel
 * @param {number} n - Slide number to show
 */
function showImages(n) {
    const slides = document.querySelectorAll("#imgList > img");
    
    if (slides.length === 0) return;
    
    // Wrap around logic
    if (n > slides.length) slideIdx = 1;
    if (n < 1) slideIdx = slides.length;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = "none";
    });
    
    // Show current slide
    if (slides[slideIdx - 1]) {
        slides[slideIdx - 1].style.display = "block";
    }
}

/* ===================================
   PDF VIEWER FUNCTIONALITY
   =================================== */

/**
 * Initializes the PDF viewer modal and event listeners
 */
function initializePDFViewer() {
    const viewProposal1 = document.querySelector("#viewProposal1");
    const viewSpec1 = document.querySelector("#viewSpec1");
    const viewProposal2 = document.querySelector("#viewProposal2");
    const liveDemo4 = document.querySelector("#liveDemo4");
    const closePDF = document.querySelector("#closePDF");
    const pdfModal = document.querySelector("#pdfModal");
    
    // Document paths
    const documents = {
        proposal1: "./Content/System Proposal.pdf",
        specification1: "./Content/System Specification.pdf",
        proposal2: "./Content/TripSplit_Proposal.pdf"
    };
    
    // Open PDF handlers - Project 1
    if (viewProposal1) {
        viewProposal1.addEventListener('click', () => {
            openPDF(documents.proposal1, "MuscleMate System Proposal");
        });
    }
    
    if (viewSpec1) {
        viewSpec1.addEventListener('click', () => {
            openPDF(documents.specification1, "MuscleMate System Specification");
        });
    }
    
    // Open PDF handlers - Project 2
    if (viewProposal2) {
        viewProposal2.addEventListener('click', () => {
            openPDF(documents.proposal2, "TripSplit Team Proposal");
        });
    }
    
    // Live Demo handler - Project 4 (opens in new tab)
    if (liveDemo4) {
        liveDemo4.addEventListener('click', () => {
            const liveUrl = configData?.Project4?.LiveDemo;
            if (liveUrl) {
                window.open(liveUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }
    
    // Close PDF handlers
    if (closePDF) {
        closePDF.addEventListener('click', closePDFViewer);
    }
    
    // Click outside to close
    if (pdfModal) {
        pdfModal.addEventListener('click', (event) => {
            if (event.target === pdfModal) {
                closePDFViewer();
            }
        });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && pdfModal?.style.display === 'flex') {
            closePDFViewer();
        }
    });
}

/**
 * Opens the PDF viewer modal with specified document
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} title - Title to display in the viewer
 */
function openPDF(pdfPath, title) {
    const pdfModal = document.querySelector("#pdfModal");
    const pdfFrame = document.querySelector("#pdfFrame");
    const pdfTitle = document.querySelector("#pdfTitle");
    
    if (!pdfModal || !pdfFrame) return;
    
    // Set the PDF source and title
    pdfFrame.src = pdfPath;
    if (pdfTitle) pdfTitle.textContent = title;
    
    // Show the modal
    pdfModal.style.display = "flex";
    document.body.classList.add('no-scroll'); // Prevent background scrolling
}

/**
 * Closes the PDF viewer modal
 */
function closePDFViewer() {
    const pdfModal = document.querySelector("#pdfModal");
    const pdfFrame = document.querySelector("#pdfFrame");
    
    if (pdfModal) {
        pdfModal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
    
    // Clear the iframe source to stop loading
    if (pdfFrame) {
        pdfFrame.src = "";
    }
}