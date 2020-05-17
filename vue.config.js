const fs = require('fs');

module.exports = {
    devServer: {
        host: "local.minyami.net",
        https: true,
        key: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccxc.key"),
        cert: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccxc-bundle.crt")
    }
}