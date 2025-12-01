/**
 * Singleton class for managing application configuration data
 * Ensures only one instance exists and configuration is loaded once
 */
export class ConfigSingleton {
    static #instance = null;
    static #dataLoaded = false;
    #config = null;

    /**
     * Private constructor to prevent direct instantiation
     * Use ConfigSingleton.getInstance() instead
     */
    constructor() {
        if (ConfigSingleton.#instance) {
            throw new Error("Use ConfigSingleton.getInstance() to get the instance");
        }
    }

    /**
     * Gets the singleton instance of ConfigSingleton
     * Creates instance and loads config if not already done
     * @returns {Promise<ConfigSingleton>} The singleton instance
     * @throws {Error} If configuration fails to load
     */
    static async getInstance() {
        if (!this.#instance) {
            this.#instance = new ConfigSingleton();
            await this.#instance.loadConfig();
        }
        return this.#instance;
    }

    /**
     * Loads the configuration file from profile.json
     * Only loads once, subsequent calls return cached data
     * @private
     * @throws {Error} If fetch fails or JSON is invalid
     */
    async loadConfig() {
        if (ConfigSingleton.#dataLoaded) {
            return; // Already loaded
        }

        try {
            const response = await fetch('./Content/profile.json');
            
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch configuration file: ${response.status} ${response.statusText}`
                );
            }
            
            this.#config = await response.json();
            ConfigSingleton.#dataLoaded = true;
            
            console.log('Configuration loaded successfully');
            
        } catch (error) {
            console.error('Error loading configuration:', error);
            
            // Reset instance on failure so retry is possible
            ConfigSingleton.#instance = null;
            ConfigSingleton.#dataLoaded = false;
            
            throw new Error(
                `Failed to load profile configuration: ${error.message}`
            );
        }
    }

    /**
     * Returns the loaded configuration data
     * @returns {Object} The configuration object
     * @throws {Error} If configuration is not yet loaded
     */
    getConfig() {
        if (!ConfigSingleton.#dataLoaded || !this.#config) {
            throw new Error(
                "Configuration is not loaded yet. Call getInstance() first."
            );
        }
        return this.#config;
    }

    /**
     * Checks if configuration has been loaded
     * @returns {boolean} True if config is loaded
     */
    isLoaded() {
        return ConfigSingleton.#dataLoaded;
    }

    /**
     * Resets the singleton instance (useful for testing)
     * WARNING: This will force a reload on next getInstance() call
     */
    static reset() {
        this.#instance = null;
        this.#dataLoaded = false;
    }
}