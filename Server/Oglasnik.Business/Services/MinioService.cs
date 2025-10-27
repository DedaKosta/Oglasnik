using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Oglasnik.Contracts.Configuration;
using Oglasnik.Contracts.Services;

namespace Oglasnik.Business.Services;

public class MinioService : IMinioService
{
    private readonly IMinioClient _minioClient;
    private readonly MinioSettings _settings;
    private readonly ILogger<MinioService> _logger;

    public MinioService(IOptions<MinioSettings> settings, ILogger<MinioService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        _minioClient = new MinioClient()
            .WithEndpoint(_settings.Endpoint)
            .WithCredentials(_settings.AccessKey, _settings.SecretKey)
            .WithSSL(_settings.UseSSL)
            .Build();
    }

    public async Task EnsureBucketExistsAsync(string bucketName)
    {
        try
        {
            var bucketExistsArgs = new BucketExistsArgs()
                .WithBucket(bucketName);

            bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs);

            if (!found)
            {
                var makeBucketArgs = new MakeBucketArgs()
                    .WithBucket(bucketName);
                await _minioClient.MakeBucketAsync(makeBucketArgs);
                _logger.LogInformation("Created bucket: {BucketName}", bucketName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ensuring bucket exists: {BucketName}", bucketName);
            throw;
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName, string contentType = "application/octet-stream")
    {
        try
        {
            await EnsureBucketExistsAsync(bucketName);

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs);

            _logger.LogInformation("Uploaded file: {FileName} to bucket: {BucketName}", fileName, bucketName);

            return $"{(_settings.UseSSL ? "https" : "http")}://{_settings.Endpoint}/{bucketName}/{fileName}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName} to bucket: {BucketName}", fileName, bucketName);
            throw;
        }
    }

    public async Task<Stream> DownloadFileAsync(string fileName, string bucketName)
    {
        try
        {
            var memoryStream = new MemoryStream();

            var getObjectArgs = new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream));

            await _minioClient.GetObjectAsync(getObjectArgs);

            memoryStream.Position = 0;
            _logger.LogInformation("Downloaded file: {FileName} from bucket: {BucketName}", fileName, bucketName);
            return memoryStream;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileName} from bucket: {BucketName}", fileName, bucketName);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string fileName, string bucketName)
    {
        try
        {
            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs);
            _logger.LogInformation("Deleted file: {FileName} from bucket: {BucketName}", fileName, bucketName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileName} from bucket: {BucketName}", fileName, bucketName);
            return false;
        }
    }

    public async Task<string> GetPresignedUrlAsync(string fileName, string bucketName, int expiryInSeconds = 3600)
    {
        try
        {
            var presignedGetObjectArgs = new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName)
                .WithExpiry(expiryInSeconds);

            var url = await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs);
            _logger.LogInformation("Generated presigned URL for file: {FileName} in bucket: {BucketName}", fileName, bucketName);
            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating presigned URL for file: {FileName} in bucket: {BucketName}", fileName, bucketName);
            throw;
        }
    }

    public async Task<bool> FileExistsAsync(string fileName, string bucketName)
    {
        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName);

            await _minioClient.StatObjectAsync(statObjectArgs);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
