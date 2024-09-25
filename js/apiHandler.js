// Function to call the API Gateway or external API (POST)
export async function callApiGateway(apiUrl, data) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error calling API Gateway: ", error);
        throw error;
    }
}

// Function to handle GET request to an API
export async function getApiData(apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data from API Gateway: ", error);
        throw error;
    }
}

// Function to upload file to S3
export async function uploadToS3(s3BucketUrl, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(s3BucketUrl, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error uploading to S3: ", error);
        throw error;
    }
}

// Function to fetch media URL (music or video)
export async function getMediaUrl(apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching media URL: ", error);
        throw error;
    }
}

// Function to run Athena query
export async function runAthenaQuery(query) {
    try {
        const response = await fetch('/athena-query-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error running Athena query: ", error);
        throw error;
    }
}

// Function to get CloudWatch metrics
export async function getCloudWatchMetrics(apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching CloudWatch metrics: ", error);
        throw error;
    }
}
