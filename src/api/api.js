// Assume showLoadingMessage and clearLoadingMessage are implemented elsewhere in your React app

function sendYoutubeUrlToServer(youtubeUrl, transcriptOption) {
    // showLoadingMessage();
    return fetch('/process_youtube_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: youtubeUrl, output_choice: transcriptOption })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // clearLoadingMessage();
        return data; // This returns the data to the caller
    })
    .catch(error => {
        console.error('Error:', error);
        // clearLoadingMessage();
        throw error; // This ensures the caller can handle the error
    });
}

function sendVideoFileToServer(videoFile, transcriptOption) {
    // showLoadingMessage();
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('output_choice', transcriptOption); // Assuming you want to send this as well

    return fetch('/upload_video', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // clearLoadingMessage();
        return data; // This returns the data to the caller
    })
    .catch(error => {
        console.error('File upload error:', error);
        // clearLoadingMessage();
        throw error; // This ensures the caller can handle the error
    });
}


function fetchQuizData(youtubeUrl) {

    return fetch('/generate-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtube_url: youtubeUrl })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("data", data);
        return data;
    })
    .catch(error => {
        console.error("Error fetching quiz data:", error);
    });

}

export { sendYoutubeUrlToServer, sendVideoFileToServer, fetchQuizData };