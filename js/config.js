// API configuration
function getApiBaseUrl() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001';
    } else {
        return 'http://192.168.1.61:3001';
    }
}

const API_CONFIG = {
    baseUrl: getApiBaseUrl()
};

console.log(`API config initialized with base URL: ${API_CONFIG.baseUrl}`);
