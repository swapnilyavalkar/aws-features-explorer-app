document.addEventListener('DOMContentLoaded', () => {
    // Get references to sections
    const dynamicFeatureSection = document.getElementById('dynamic-feature');
    const dynamicContent = document.getElementById('dynamic-content');
    const allFeaturesSection = document.getElementById('all-features');

    // Add event listener for toggle switches
    document.querySelectorAll('input[name="feature"]').forEach((toggle) => {
        toggle.addEventListener('change', function () {
            const selectedFeature = this.value;

            // Reset visibility of all sections
            dynamicFeatureSection.style.display = 'block';
            allFeaturesSection.style.display = 'none';

            if (this.checked) {
                // Show individual feature in dynamic section or all features if "All" is selected
                if (selectedFeature === 'all') {
                    allFeaturesSection.style.display = 'block';
                } else {
                    dynamicFeatureSection.style.display = 'block';
                    dynamicContent.innerHTML = ''; // Clear previous content
                    loadFeatureContent(selectedFeature);
                }
            } else {
                // Hide the feature if the toggle is off
                dynamicFeatureSection.style.display = 'none';
            }
        });
    });

    // Function to load content based on selected feature
    function loadFeatureContent(feature) {
        let featureHtml = ''; // Use featureHtml to append content without overwriting
        switch (feature) {
            case 'upload':
                featureHtml = `
                    <h2>Upload Files</h2>
                    <input type="file" id="fileInput">
                    <input type="text" id="s3BucketUrl" placeholder="Enter S3 Bucket URL">
                    <progress id="uploadProgress" value="0" max="100" style="width: 100%;"></progress>
                    <button id="uploadBtn">Upload to S3</button>
                    <p id="uploadStatus"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeS3Upload();
                break;
            case 'api':
                featureHtml = `
                    <h2>API Interaction</h2>
                    <input type="text" id="apiUrl" placeholder="Enter API Gateway URL">
                    <input type="text" id="apiInput" placeholder="Enter API data">
                    <button id="apiBtn">Submit to API Gateway</button>
                    <p id="apiResponse"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeApiGateway();
                break;
            case 'music':
                featureHtml = `
                    <h2>Music Player</h2>
                    <input type="text" id="musicUrlInput" placeholder="Enter Music File URL">
                    <audio controls id="musicPlayerElement" style="display: block; margin-top: 10px;">
                        <source src="" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <p id="musicStatus"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeMusicPlayer();
                break;
            case 'video':
                featureHtml = `
                    <h2>Video Player</h2>
                    <input type="text" id="videoUrl" placeholder="Enter Video File URL">
                    <video controls id="videoPlayer" width="600" style="display: block; margin-top: 10px;">
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p id="videoStatus"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeVideoPlayer();
                break;
            case 'image':
                featureHtml = `
                    <h2>Image Viewer</h2>
                    <input type="text" id="imageUrl" placeholder="Enter Image File URL">
                    <img id="imageViewer" src="" alt="Uploaded Image" style="max-width: 100%; height: auto; display: block; margin-top: 10px;">
                    <p id="imageStatus"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeImageViewer();
                break;
            case 'analytics':
                featureHtml = `
                    <h2>Run Athena Queries</h2>
                    <div class="query-container">
                        <textarea id="queryInput" placeholder="Enter your query here"></textarea>
                        <button class="query-btn" id="queryBtn">Run Query</button>
                    </div>
                    <p id="queryResult"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeAthena();
                break;
            case 'monitoring':
                featureHtml = `
                    <h2>Monitoring and Alerts</h2>
                    <button id="monitoringBtn">View CloudWatch Metrics</button>
                    <p id="monitoringData"></p>
                `;
                dynamicContent.innerHTML = featureHtml;
                initializeCloudWatch();
                break;
        }
    }

    // Functions for S3 Upload with Progress Bar
    function initializeS3Upload() {
        document.getElementById('uploadBtn').addEventListener('click', () => {
            const file = document.getElementById('fileInput').files[0];
            const s3BucketUrl = document.getElementById('s3BucketUrl').value;
            if (file && s3BucketUrl) {
                uploadToS3(file, s3BucketUrl);
            } else {
                document.getElementById('uploadStatus').innerText = 'Please select a file and provide S3 bucket URL.';
            }
        });
    }

    function uploadToS3(file, s3BucketUrl) {
        document.getElementById('uploadStatus').innerText = 'Uploading...';
        const s3 = new AWS.S3({ params: { Bucket: s3BucketUrl } });
        const params = {
            Key: file.name,
            Body: file,
            ACL: 'public-read',
            ContentType: file.type
        };

        s3.upload(params).on('httpUploadProgress', function(evt) {
            const progress = Math.round((evt.loaded / evt.total) * 100);
            document.getElementById('uploadProgress').value = progress;
        }).send(function(err, data) {
            if (err) {
                document.getElementById('uploadStatus').innerText = 'Upload failed: ' + err.message;
            } else {
                document.getElementById('uploadStatus').innerText = 'File uploaded successfully! File URL: ' + data.Location;
            }
        });
    }

    // Functions for API Gateway
    function initializeApiGateway() {
        document.getElementById('apiBtn').addEventListener('click', () => {
            const apiUrl = document.getElementById('apiUrl').value;
            const apiData = document.getElementById('apiInput').value;
            if (apiUrl && apiData) {
                callApiGateway(apiUrl, apiData);
            } else {
                document.getElementById('apiResponse').innerText = 'Please provide API URL and data.';
            }
        });
    }

    function callApiGateway(apiUrl, data) {
        document.getElementById('apiResponse').innerText = 'Submitting...';
        axios.post(apiUrl, { data: data })
            .then(response => {
                document.getElementById('apiResponse').innerText = 'Response: ' + JSON.stringify(response.data);
            })
            .catch(error => {
                document.getElementById('apiResponse').innerText = 'Error: ' + error.message;
            });
    }

    // Music Player Initialization
    function initializeMusicPlayer() {
        const musicUrlField = document.getElementById('musicUrlInput');
        const musicPlayer = document.getElementById('musicPlayerElement');
        const musicStatus = document.getElementById('musicStatus');

        if (musicUrlField && musicPlayer) {
            musicUrlField.addEventListener('input', () => {
                const musicUrl = musicUrlField.value;
                if (musicUrl) {
                    musicPlayer.src = musicUrl;
                    musicPlayer.load();
                    musicPlayer.play();
                    musicStatus.innerText = 'Playing music from: ' + musicUrl;

                    // Debugging: log URL and status
                    console.log('Music URL:', musicUrl);

                    // Log audio player events
                    musicPlayer.addEventListener('error', (e) => {
                        console.error('Error playing audio:', e);
                    });
                    musicPlayer.addEventListener('loadeddata', () => {
                        console.log('Audio data loaded');
                    });
                    musicPlayer.addEventListener('play', () => {
                        console.log('Audio playing');
                    });
                    musicPlayer.addEventListener('pause', () => {
                        console.log('Audio paused');
                    });
                } else {
                    musicPlayer.pause();
                    musicStatus.innerText = 'Please provide a music file URL.';
                }
            });
        }
    }

    // Video Player Initialization
    function initializeVideoPlayer() {
        const videoUrlInput = document.getElementById('videoUrl');
        const videoPlayer = document.getElementById('videoPlayer');

        // Event listener to load the video file as soon as the URL is inserted
        videoUrlInput.addEventListener('input', () => {
            const videoUrl = videoUrlInput.value;
            if (videoUrl) {
                videoPlayer.src = videoUrl;
                videoPlayer.load(); // Reloads the video file
                videoPlayer.play().catch(err => {
                    console.error("Error playing video:", err);
                    document.getElementById('videoStatus').innerText = "Failed to load video. Check URL or file format.";
                });
            }
        });

        videoPlayer.addEventListener('error', (e) => {
            console.error("Video playback error:", e);
            document.getElementById('videoStatus').innerText = "Video playback error.";
        });
    }

    // Functions for Image Viewer
    function initializeImageViewer() {
        const imageUrlInput = document.getElementById('imageUrl');
        const imageViewer = document.getElementById('imageViewer');
        
        // Ensure the image is hidden initially
        imageViewer.style.display = 'none';

        // Add event listener to monitor input in the text field
        imageUrlInput.addEventListener('input', () => {
            const imageUrl = imageUrlInput.value.trim(); // Trim any spaces from the URL

            if (imageUrl) {
                // Test if the URL is valid by setting a temporary image object
                const tempImage = new Image();
                tempImage.src = imageUrl;

                tempImage.onload = function () {
                    // If the image loads correctly, show it
                    imageViewer.src = imageUrl;
                    imageViewer.style.display = 'block';  // Make the image visible
                    document.getElementById('imageStatus').innerText = 'Showing image from: ' + imageUrl;
                };

                tempImage.onerror = function () {
                    // If there's an error loading the image, hide the image element
                    imageViewer.src = '';
                    imageViewer.style.display = 'none';
                    document.getElementById('imageStatus').innerText = 'Invalid image URL. Please provide a valid URL.';
                };
            } else {
                // Hide the image if the URL field is empty
                imageViewer.src = ''; 
                imageViewer.style.display = 'none'; // Hide the image
                document.getElementById('imageStatus').innerText = 'Please provide a valid image file URL.';
            }
        });
    }

    // Functions for Athena Queries
    function initializeAthena() {
        document.getElementById('queryBtn').addEventListener('click', () => {
            const query = document.getElementById('queryInput').value;
            if (query) {
                runAthenaQuery(query);
            } else {
                document.getElementById('queryResult').innerText = 'Please enter a query.';
            }
        });
    }

    function runAthenaQuery(query) {
        document.getElementById('queryResult').innerText = 'Running query...';
        setTimeout(() => {
            document.getElementById('queryResult').innerText = 'Query completed: Sample result from Athena.';
        }, 2000);
    }

    // Functions for CloudWatch Monitoring
    function initializeCloudWatch() {
        document.getElementById('monitoringBtn').addEventListener('click', () => {
            document.getElementById('monitoringData').innerText = 'Fetching data...';
            fetchCloudWatchMetrics();
        });
    }

    function fetchCloudWatchMetrics() {
        setTimeout(() => {
            document.getElementById('monitoringData').innerText = 'Sample CloudWatch Metrics: CPU Utilization - 15%, Memory Usage - 40%.';
        }, 2000);
    }
});
