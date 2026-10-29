// Usage: node scripts/update-twemoji.js [version] [downloaded-cdnjs-manifest.json]
const fs = require("fs/promises");
const path = require("path");

const { createTwemojiData } = require("./lib/twemoji-data");

async function main() {
    const destination = path.join(__dirname, "../src/util/twemoji-data.json");
    const version = process.argv[2] ?? JSON.parse(await fs.readFile(destination, "utf8")).version;
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
        throw new Error("Expected a Twemoji version, such as 15.0.3");
    }

    let manifest;
    if (process.argv[3]) {
        manifest = JSON.parse(await fs.readFile(process.argv[3], "utf8"));
    } else {
        const response = await fetch(`https://api.cdnjs.com/libraries/twemoji/${version}?fields=files`);
        if (!response.ok) {
            throw new Error(`Cannot download the Twemoji manifest: ${response.status}`);
        }
        manifest = await response.json();
    }

    const emojis = manifest.files
        .filter(file => /^svg\/[0-9a-f]+(?:-[0-9a-f]+)*\.svg$/.test(file))
        .map(file => file.slice(4, -4))
        .sort();
    if (emojis.length === 0) {
        throw new Error("The Twemoji manifest contains no SVG images");
    }
    await fs.writeFile(destination, JSON.stringify(createTwemojiData(version, emojis), null, 2) + "\n");
    console.log(`Saved ${emojis.length} Twemoji ${version} image names`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
