namespace Oglasnik.Contracts.Services;

public interface IMinioService
{
    /// <summary>
    /// Uploads a file to MinIO bucket
    /// </summary>
    /// <param name="fileStream">File stream to upload</param>
    /// <param name="fileName">Name of the file in MinIO</param>
    /// <param name="bucketName">Target bucket name</param>
    /// <param name="contentType">MIME type of the file</param>
    /// <returns>URL or path to the uploaded file</returns>
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName, string contentType = "application/octet-stream");

    /// <summary>
    /// Downloads a file from MinIO bucket
    /// </summary>
    /// <param name="fileName">Name of the file in MinIO</param>
    /// <param name="bucketName">Source bucket name</param>
    /// <returns>Stream of the file</returns>
    Task<Stream> DownloadFileAsync(string fileName, string bucketName);

    /// <summary>
    /// Deletes a file from MinIO bucket
    /// </summary>
    /// <param name="fileName">Name of the file to delete</param>
    /// <param name="bucketName">Bucket name</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteFileAsync(string fileName, string bucketName);

    /// <summary>
    /// Generates a pre-signed URL for temporary file access
    /// </summary>
    /// <param name="fileName">Name of the file</param>
    /// <param name="bucketName">Bucket name</param>
    /// <param name="expiryInSeconds">Expiry time in seconds (default 1 hour)</param>
    /// <returns>Pre-signed URL</returns>
    Task<string> GetPresignedUrlAsync(string fileName, string bucketName, int expiryInSeconds = 3600);

    /// <summary>
    /// Checks if a file exists in MinIO bucket
    /// </summary>
    /// <param name="fileName">Name of the file</param>
    /// <param name="bucketName">Bucket name</param>
    /// <returns>True if file exists</returns>
    Task<bool> FileExistsAsync(string fileName, string bucketName);

    /// <summary>
    /// Ensures a bucket exists, creates it if it doesn't
    /// </summary>
    /// <param name="bucketName">Bucket name</param>
    Task EnsureBucketExistsAsync(string bucketName);
}
