const fs = require('fs');
const path = require('path');

/**
 * Deletes a file from the uploads directory based on its full URL.
 * @param {string} fileUrl - The full URL of the file (e.g., http://localhost:5000/uploads/image.jpg)
 */
const deleteFile = (fileUrl) => {
    if (!fileUrl) return;

    try {
        // Extract filename from URL
        const filename = fileUrl.split('/').pop();
        if (!filename) return;

        const filePath = path.join(__dirname, '../public/uploads', filename);

        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Failed to delete file: ${fileUrl}`, error);
    }
};

module.exports = { deleteFile };
