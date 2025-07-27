// save-parser.js
// This file contains functions to handle save file parsing via a C# WebAssembly module.

// This function will be called once when the app starts to initialize the .NET runtime.
export async function initializeWasm() {
    // Check if Blazor is already started to prevent re-initialization
    if (window.Blazor && window.Blazor.isStarted) {
        return;
    }
    try {
        // Start the Blazor runtime and load the WASM module.
        await Blazor.start({
            loadBootResource: (type, name, defaultUri, integrity) => {
                return `SaveParser.Wasm/bin/Debug/net7.0/wwwroot/_framework/${name}`;
            }
        });
    } catch (error)
    {
        console.error("Blazor startup failed", error);
    }
}

// This function is called every time a file is uploaded by the user.
export function parseSaveFile(file) {
    return new Promise(async (resolve, reject) => {
        try {
            // Read the user-selected file into a byte array.
            const buffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(buffer);
            const fileName = file.name;

            // Create a single object to pass to the C# method.
            // Property names MUST be PascalCase to match the C# class.
            const fileInput = {
                SaveData: byteArray,
                FileName: fileName
            };

            // Invoke the C# method 'ParseSaveFile' with the single fileInput object.
            const resultJson = await DotNet.invokeMethodAsync('SaveParser.Wasm', 'ParseSaveFile', fileInput);
            
            // The C# method returns a JSON string. Parse it into a JavaScript object.
            const parsedData = JSON.parse(resultJson);

            // If the C# code returned an error, reject the promise.
            if (parsedData.error) {
                throw new Error(parsedData.error);
            }
            
            // Resolve the promise with the parsed data object.
            resolve(parsedData);
        } catch (error) {
            console.error(`Error parsing save file:`, error);
            reject(new Error(`Failed to parse save file. It might be corrupted or an unsupported format.`));
        }
    });
}
