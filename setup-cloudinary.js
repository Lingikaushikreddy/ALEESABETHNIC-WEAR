
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure
cloudinary.config({
    cloud_name: 'do6lwdmfc',
    api_key: '275619964176625',
    api_secret: 'ZauWtMWUBc0Rmzhz_jMUwlDAcVM'
});

async function setup() {
    try {
        console.log("Creating upload preset...");

        // Check if exists or create
        // We'll just try to create 'aleesa_preset', if it errors/exists we might catch it or just update
        try {
            const result = await cloudinary.api.create_upload_preset({
                name: 'aleesa_preset',
                unsigned: true,
                folder: 'aleesa-store'
            });
            console.log("✅ Created Preset:", result.name);
            return result.name;
        } catch (e) {
            if (e.error && e.error.message && e.error.message.includes('already exists')) {
                console.log("ℹ️ Preset 'aleesa_preset' already exists. Using it.");
                const preset = await cloudinary.api.upload_preset('aleesa_preset');
                return preset.name;
            }
            throw e;
        }

    } catch (error) {
        console.error("Failed to create preset:", error);
        process.exit(1);
    }
}

setup().then(presetName => {
    // Append to .env if not present
    const envPath = path.join(__dirname, '.env');
    const content = fs.readFileSync(envPath, 'utf8');

    if (!content.includes('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')) {
        fs.appendFileSync(envPath, `\nNEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="${presetName}"\n`);
        console.log("✅ Added preset to .env");
    } else {
        console.log("ℹ️ Preset already in .env");
    }
});
