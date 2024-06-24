function dotCMSStringToJSON(inputString) {
// 1. Replace equals signs with colons
let jsonString = inputString.replace(/=/g, ':');

// 2. Add quotes around outer keys (names)
jsonString = jsonString.replace(/({|}|,\s*)(\w+)(\s*:)/g, '$1"$2"$3');

// 3. Add quotes around state keys
jsonString = jsonString.replace(/(\w+)(:\[)/g, '"$1"$2');

// 4. Add quotes around county values (and commas)
jsonString = jsonString.replace(/(\[|\s*)([\w\s]+)(\s*\]|,\s*)/g, '$1"$2"$3');

// 5. Parse the modified string to JSON
    try {
        let jsonObject = JSON.parse(jsonString);
        return jsonObject;
        } 
    catch (error) {
        console.error('Error parsing JSON:', error);
        return null; // Or handle the error as needed
        }
}