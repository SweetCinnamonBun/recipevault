using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;


namespace API.Services
{
    public class AzureBlobStorageService
    {
        private readonly string _connectionString;
        private readonly string _containerName;

        public AzureBlobStorageService(IConfiguration configuration)
        {
            _connectionString = configuration["AzureBlobStorage:ConnectionString"];
            _containerName = configuration["AzureBlobStorage:ContainerName"];
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            // Create a BlobServiceClient
            var blobServiceClient = new BlobServiceClient(_connectionString);

            // Get a reference to the container
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

            // Create the container if it doesn't exist
            await containerClient.CreateIfNotExistsAsync();

            // Get a reference to the blob
            var blobClient = containerClient.GetBlobClient(fileName);

            // Upload the file
            await blobClient.UploadAsync(fileStream, overwrite: true);

            // Return the URL of the uploaded file
            return blobClient.Uri.ToString();
        }
    }
}