import { ConfigSingleton } from "./GetProfile.js";

/**
 * Initializes the About page with configuration data
 */
(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        const configData = configInstance.getConfig();
        updateHTML(configData);
    } catch (error) {
        console.error('Error loading about page:', error);
        displayErrorMessage();
    }
})();

/**
 * Updates HTML elements with data from configuration
 * @param {Object} configData - Configuration data object
 */
function updateHTML(configData) {
    updateNavigation(configData);
    updateAboutSection(configData);
    updateContactSection(configData);
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
 * Updates the about me section
 * @param {Object} configData - Configuration data
 */
function updateAboutSection(configData) {
    const headshot = document.querySelector("#pfHeadshot");
    const name = document.querySelector("#pfAboutName");
    const title = document.querySelector("#pfAboutTitle");
    const description = document.querySelector("#pfAboutDesc");
    
    if (headshot && configData.About.Headshot) {
        headshot.src = `Content/${configData.About.Headshot}`;
    }
    
    if (name && configData.About.Name) {
        name.textContent = configData.About.Name;
    }
    
    if (title && configData.About.Currently) {
        title.textContent = configData.About.Currently;
    }
    
    if (description && configData.About.AboutText) {
        description.textContent = configData.About.AboutText;
    }
}

/**
 * Updates the contact section
 * @param {Object} configData - Configuration data
 */
function updateContactSection(configData) {
    const email = document.querySelector("#pfEmail");
    const phone = document.querySelector("#pfPhone");
    const phoneContainer = document.querySelector("#elPhone");
    
    // Update email
    if (email && configData.Contact.EMail) {
        email.href = `mailto:${configData.Contact.EMail}`;
        email.textContent = configData.Contact.EMail;
    }
    
    // Update phone (if provided)
    if (configData.Contact.Phone) {
        if (phone) {
            phone.href = `tel:${configData.Contact.Phone}`;
            phone.textContent = configData.Contact.Phone;
        }
    } else {
        // Hide phone section if no phone number provided
        if (phoneContainer) {
            phoneContainer.style.display = "none";
        }
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
                <p>Unable to load profile information. Please try refreshing the page.</p>
            </div>
        `;
    }
}