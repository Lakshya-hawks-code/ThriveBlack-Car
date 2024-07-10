import fs from "fs";

export const uploadProfile = async (path, file) => {
    if (!file) {
        throw new Error('File is undefined or null.');
    }

    let uploadPath = `public/Mobile/profile_img`;

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const matches = file.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            reject(new Error('Invalid base64 data'));
            return;
        }

        const extensionMatches = matches[1].match(/(?:jpeg|jpg|png|gif)/);
        const extension = extensionMatches ? extensionMatches[0] : 'png'; // Default to 'png' if no valid extension found
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        const namefile = new Date().getTime() + `.${extension}`;
        const filePath = `${uploadPath}/${namefile}`;

        // Adjust path concatenation to avoid double slashes
        let imagePath = `/${path.replace(/^\/+|\/+$/g, '')}/profile_img/${namefile}`; // Remove leading and trailing slashes

        fs.writeFile(filePath, buffer, 'base64', function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(imagePath);
            }
        });
    });
};
