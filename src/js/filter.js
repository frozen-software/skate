module.exports = {
    "makeUrl": (str) => {
        str = encodeURI(str.toLowerCase()); 

        if (str.includes("://")) {
            return str;
        } else if (str.includes(".")) {
            return "http://" + str;
        } else {
            return "https://www.google.com/search?q=" + str
        }
    }
}