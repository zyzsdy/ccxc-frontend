const fs = require('fs');

module.exports = {
    filenameHashing: true,
    devServer: {
        host: "www.ccbc11.test",
        https: true,
        key: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccbc11test.key"),
        cert: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccbc11test.crt")
    }
}