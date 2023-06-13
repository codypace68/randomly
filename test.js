/**
 * @param {any} object
 * @return {string}
 */
var jsonStringify = function(object) {
    console.log(object);
    // non array of object single values
    if (typeof object !== 'object' || object === null) {
        return parseInt(object) === object || typeof object === 'boolean' || object === null ? object : `"${object}"`;
    }

    // empty arrays
    if ((Array.isArray(object) && object.length === 0)) return "[]";

    // empty object 
    if (typeof object === 'object' && Object.keys(object).length === 0) return "{}";

    let returnString = Array.isArray(object) ? "[": "{";
    let keys = Array.isArray(object) ? object : Object.keys(object);
    console.log(`iterating over ${keys}`);
    keys.forEach((key, i) => {
        if (Array.isArray(object[key]) && !Array.isArray(object)) {
            returnString += `"${key}":[${object[key].map(entry => jsonStringify(entry)).map(String).join(',')}]`
            return;
        }

        if (Array.isArray(object[key])) {
            returnString += `[${object[key].map(entry => jsonStringify(entry)).map(String).join(',')}]`
            return;
        }

        if (typeof object[key] === 'object' && object[key] !== null) {
            returnString += `"${key}":${jsonStringify(object[key])}`;
            return;
        } 

        returnString += object[key] === null ? 
            `"${key}":null` 
            : `"${key}":${parseInt(object[key]) === object[key] || typeof object[key] === 'boolean' ? object[key] : '"' + object[key] + '"'}`;
        if (i + 1 < keys.length) returnString += ",";
    })

    returnString += "}";
    return returnString;
};

jsonStringify({"k":[10,null,null,[{"users":[{"id":"1","userId":"101","name":"LeetCode"}]}]]});

// No trailing commas
// double quotes on string
// 