const path = require("path")

module.exports = {
    webpack: {
        alias: {
            // Alias ~ to src, e.g ~/components/whatever
            "~": path.join(__dirname, "src"),
        },
    },
}
