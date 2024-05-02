browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("a");
    console.log("Received request at background: ", request);
    console.log("Sender", sender);
    console.log("b");

    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
});
