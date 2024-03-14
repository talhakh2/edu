const fs = require('fs');
const path = require('path');

const pemFilePath = '/etc/letsencrypt/archive/eduai.francecentral.cloudapp.azure.com/privkey1.pem';

// Function to check access to a given path
function checkAccess(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log('Read access OK:', filePath);
    } catch (err) {
        console.error('Access Denied:', filePath);
    }
}

// Function to recursively check access from /etc/ to the .pem file
function checkPathAccess(filePath) {
    let currentPath = '/';
    const parts = filePath.split('/');

    for (let part of parts) {
        if (part) {
            currentPath = path.join(currentPath, part);
            checkAccess(currentPath);
        }
    }
}

// Start the check
checkPathAccess(pemFilePath);
