import { ConfigSingleton } from "./GetProfile.js";

/**
 * Initializes the Experience page with configuration data
 */
(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        const configData = configInstance.getConfig();
        updateHTML(configData);
    } catch (error) {
        console.error('Error loading experience page:', error);
        displayErrorMessage();
    }
})();

/**
 * Updates HTML elements with data from configuration
 * @param {Object} configData - Configuration data object
 */
function updateHTML(configData) {
    updateNavigation(configData);
    updateExperienceOverview(configData);
    updateEducationSection(configData);
    updateEmploymentSection(configData);
    updateSkillsSection(configData);
    setupResumeButton(configData);
    initializePDFViewer(); // Initialize PDF viewer modal
}

/**
 * Updates navigation menu elements
 * @param {Object} configData - Configuration data
 */
function updateNavigation(configData) {
    const thumbnail = document.querySelector("#pfThumbnail");
    const linkedIn = document.querySelector("#pfLinkedIn");
    const gitHub = document.querySelector("#pfGitHub");
    
    if (thumbnail && configData.About.Thumbnail) {
        thumbnail.src = `Content/${configData.About.Thumbnail}`;
    }
    
    if (linkedIn && configData.Contact.LinkedIn) {
        linkedIn.href = configData.Contact.LinkedIn;
    }
    
    if (gitHub && configData.Contact.GitHub) {
        gitHub.href = configData.Contact.GitHub;
    }
}

/**
 * Updates the experience overview text
 * @param {Object} configData - Configuration data
 */
function updateExperienceOverview(configData) {
    const expText = document.querySelector("#pfExpText");
    
    if (expText && configData.Experience.ExperienceText) {
        expText.textContent = configData.Experience.ExperienceText;
    }
}

/**
 * Updates the education section
 * @param {Object} configData - Configuration data
 */
function updateEducationSection(configData) {
    const school = document.querySelector("#pfSchool");
    const major = document.querySelector("#pfMajor");
    const graduation = document.querySelector("#pfGraduation");
    const educationText = document.querySelector("#pfEducationText");
    
    if (school && configData.Experience.School) {
        school.textContent = configData.Experience.School;
    }
    
    if (major && configData.Experience.Major) {
        major.textContent = configData.Experience.Major;
    }
    
    if (graduation && configData.Experience.Graduation) {
        graduation.textContent = configData.Experience.Graduation;
    }
    
    if (educationText && configData.Experience.EducationText) {
        educationText.textContent = configData.Experience.EducationText;
    }
}

/**
 * Updates the employment section
 * @param {Object} configData - Configuration data
 */
function updateEmploymentSection(configData) {
    const employment = document.querySelector("#pfEmployment");
    const role = document.querySelector("#pfRole");
    const employmentText = document.querySelector("#pfEmploymentText");
    
    if (employment && configData.Experience.Employment) {
        employment.textContent = configData.Experience.Employment;
    }
    
    if (role && configData.Experience.Role) {
        role.textContent = configData.Experience.Role;
    }
    
    if (employmentText && configData.Experience.EmploymentText) {
        employmentText.textContent = configData.Experience.EmploymentText;
    }
}

/**
 * Updates the skills section
 * @param {Object} configData - Configuration data
 */
function updateSkillsSection(configData) {
    const skills = document.querySelector("#pfSkills");
    const skillsText = document.querySelector("#pfSkillsText");
    
    if (skills && configData.Experience.Skills) {
        // Convert skills array to comma-separated string
        skills.textContent = Array.isArray(configData.Experience.Skills) 
            ? configData.Experience.Skills.join(', ')
            : configData.Experience.Skills;
    }
    
    if (skillsText && configData.Experience.SkillsText) {
        skillsText.textContent = configData.Experience.SkillsText;
    }
}

/**
 * Sets up the resume button click handler
 * @param {Object} configData - Configuration data
 */
function setupResumeButton(configData) {
    const resumeButton = document.querySelector("#pfResume");
    
    if (resumeButton && configData.Experience.Resume) {
        resumeButton.addEventListener('click', () => {
            const url = `./Content/${configData.Experience.Resume}`;
            openPDF(url, "Resume");
        });
    }
}

/**
 * Displays an error message to the user
 */
function displayErrorMessage() {
    const mainSection = document.querySelector(".main-section");
    if (mainSection) {
        mainSection.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>Oops! Something went wrong.</h2>
                <p>Unable to load experience information. Please try refreshing the page.</p>
            </div>
        `;
    }
}

/* ===================================
   PDF VIEWER FUNCTIONALITY
   =================================== */

/**
 * Initializes the PDF viewer modal and event listeners
 */
function initializePDFViewer() {
    const closePDF = document.querySelector("#closePDF");
    const pdfModal = document.querySelector("#pdfModal");
    
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