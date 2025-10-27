# MinIO Integration Setup Guide

This guide walks you through setting up MinIO object storage for file uploads in the Oglasnik application.

## 🚀 Quick Start

### 1. Start MinIO with Docker Compose

```bash
# From the project root
docker-compose up -d

# Check if MinIO is running
docker-compose ps

# View logs
docker-compose logs -f minio
```

### 2. Access MinIO Console

- **Console URL**: http://localhost:9001
- **API Endpoint**: http://localhost:9000
- **Username**: `minioadmin`
- **Password**: `minioadmin123`

## 🗂️ MinIO Configuration

### Step 1: Create Buckets

1. Open http://localhost:9001 and login
2. Click **"Buckets"** in the left sidebar
3. Click **"Create Bucket"**
4. Create the following buckets:

   **listings-images** (for listing photos):
   - Bucket Name: `listings-images`
   - Versioning: OFF (for development)
   - Object Locking: OFF
   - Click "Create Bucket"

   **user-avatars** (for user profile pictures):
   - Bucket Name: `user-avatars`
   - Versioning: OFF
   - Object Locking: OFF
   - Click "Create Bucket"

   **documents** (for any documents/files):
   - Bucket Name: `documents`
   - Versioning: OFF
   - Object Locking: OFF
   - Click "Create Bucket"

### Step 2: Set Bucket Access Policies

For each bucket that needs public read access (like listing images):

1. Click on the bucket name (e.g., `listings-images`)
2. Go to **"Access"** tab
3. Click **"Add Access Rule"**
4. **Prefix**: `*` (all objects)
5. **Access**: `readonly` or `readwrite` depending on needs
6. Click **"Save"**

Or set custom policy:
1. Go to **"Administrator"** → **"Buckets"** → Select bucket → **"Access"**
2. Click **"Edit Policy"**
3. Add this JSON for public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::listings-images/*"]
    }
  ]
}
```

### Step 3: Create Access Keys for Application

1. Go to **"Access Keys"** in the left sidebar
2. Click **"Create access key"**
3. Copy the **Access Key** and **Secret Key**
4. Store them securely (you'll need these for your backend configuration)

Example:
- Access Key: `oglasnik-app-key`
- Secret Key: `your-secret-key-here`

## 🔧 ASP.NET Core Integration

### Install NuGet Package

```bash
cd Server/Oglasnik/Oglasnik.Business
dotnet add package Minio
```

### Update appsettings.json

Add MinIO configuration to `Server/Oglasnik/Oglasnik.WebAPI/appsettings.json`:

```json
{
  "MinIO": {
    "Endpoint": "localhost:9000",
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin123",
    "UseSSL": false,
    "BucketNames": {
      "ListingsImages": "listings-images",
      "UserAvatars": "user-avatars",
      "Documents": "documents"
    }
  }
}
```

For production, use environment variables:
```json
{
  "MinIO": {
    "Endpoint": "${MINIO_ENDPOINT}",
    "AccessKey": "${MINIO_ACCESS_KEY}",
    "SecretKey": "${MINIO_SECRET_KEY}",
    "UseSSL": true,
    "BucketNames": {
      "ListingsImages": "listings-images",
      "UserAvatars": "user-avatars",
      "Documents": "documents"
    }
  }
}
```

### Create MinIO Configuration Class

File: `Server/Oglasnik/Oglasnik.Contracts/Configuration/MinioSettings.cs`

```csharp
namespace Oglasnik.Contracts.Configuration;

public class MinioSettings
{
    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public bool UseSSL { get; set; }
    public BucketNames BucketNames { get; set; } = new();
}

public class BucketNames
{
    public string ListingsImages { get; set; } = "listings-images";
    public string UserAvatars { get; set; } = "user-avatars";
    public string Documents { get; set; } = "documents";
}
```

### Create MinIO Service Interface

File: `Server/Oglasnik/Oglasnik.Contracts/Services/IMinioService.cs`

```csharp
namespace Oglasnik.Contracts.Services;

public interface IMinioService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName, string contentType = "application/octet-stream");
    Task<Stream> DownloadFileAsync(string fileName, string bucketName);
    Task<bool> DeleteFileAsync(string fileName, string bucketName);
    Task<string> GetPresignedUrlAsync(string fileName, string bucketName, int expiryInSeconds = 3600);
    Task<bool> FileExistsAsync(string fileName, string bucketName);
    Task EnsureBucketExistsAsync(string bucketName);
}
```

### Implement MinIO Service

File: `Server/Oglasnik/Oglasnik.Business/Services/MinioService.cs`

```csharp
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

    public MinioService(IOptions<MinioSettings> settings)
    {
        _settings = settings.Value;

        _minioClient = new MinioClient()
            .WithEndpoint(_settings.Endpoint)
            .WithCredentials(_settings.AccessKey, _settings.SecretKey)
            .WithSSL(_settings.UseSSL)
            .Build();
    }

    public async Task EnsureBucketExistsAsync(string bucketName)
    {
        var bucketExistsArgs = new BucketExistsArgs()
            .WithBucket(bucketName);

        bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs);

        if (!found)
        {
            var makeBucketArgs = new MakeBucketArgs()
                .WithBucket(bucketName);
            await _minioClient.MakeBucketAsync(makeBucketArgs);
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName, string contentType = "application/octet-stream")
    {
        await EnsureBucketExistsAsync(bucketName);

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(fileName)
            .WithStreamData(fileStream)
            .WithObjectSize(fileStream.Length)
            .WithContentType(contentType);

        await _minioClient.PutObjectAsync(putObjectArgs);

        return $"{(_settings.UseSSL ? "https" : "http")}://{_settings.Endpoint}/{bucketName}/{fileName}";
    }

    public async Task<Stream> DownloadFileAsync(string fileName, string bucketName)
    {
        var memoryStream = new MemoryStream();

        var getObjectArgs = new GetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(fileName)
            .WithCallbackStream(stream => stream.CopyTo(memoryStream));

        await _minioClient.GetObjectAsync(getObjectArgs);

        memoryStream.Position = 0;
        return memoryStream;
    }

    public async Task<bool> DeleteFileAsync(string fileName, string bucketName)
    {
        try
        {
            var removeObjectArgs = new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> GetPresignedUrlAsync(string fileName, string bucketName, int expiryInSeconds = 3600)
    {
        var presignedGetObjectArgs = new PresignedGetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(fileName)
            .WithExpiry(expiryInSeconds);

        return await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs);
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
```

### Register Service in Program.cs

Add to `Server/Oglasnik/Oglasnik.WebAPI/Program.cs`:

```csharp
// Configure MinIO settings
builder.Services.Configure<MinioSettings>(builder.Configuration.GetSection("MinIO"));

// Register MinIO service
builder.Services.AddSingleton<IMinioService, MinioService>();
```

### Create Upload Endpoint Example

File: `Server/Oglasnik/Oglasnik.WebAPI/Endpoints/Files/UploadImage.cs`

```csharp
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Oglasnik.Contracts.Services;
using Oglasnik.Contracts.Configuration;
using Microsoft.Extensions.Options;

namespace Oglasnik.WebAPI.Endpoints.Files;

public class UploadImageRequest
{
    public IFormFile File { get; set; } = null!;
    public string BucketType { get; set; } = "listings"; // listings, avatars, documents
}

public class UploadImageResponse
{
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}

public class UploadImage : Endpoint<UploadImageRequest, UploadImageResponse>
{
    private readonly IMinioService _minioService;
    private readonly MinioSettings _minioSettings;

    public UploadImage(IMinioService minioService, IOptions<MinioSettings> minioSettings)
    {
        _minioService = minioService;
        _minioSettings = minioSettings.Value;
    }

    public override void Configure()
    {
        Post("/api/files/upload");
        AllowFileUploads();
        AllowAnonymous(); // Change to authorized if needed
    }

    public override async Task HandleAsync(UploadImageRequest req, CancellationToken ct)
    {
        if (req.File == null || req.File.Length == 0)
        {
            await SendErrorsAsync(cancellation: ct);
            return;
        }

        // Determine bucket based on type
        var bucketName = req.BucketType.ToLower() switch
        {
            "listings" => _minioSettings.BucketNames.ListingsImages,
            "avatars" => _minioSettings.BucketNames.UserAvatars,
            "documents" => _minioSettings.BucketNames.Documents,
            _ => _minioSettings.BucketNames.ListingsImages
        };

        // Generate unique filename
        var fileExtension = Path.GetExtension(req.File.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

        // Upload file
        using var stream = req.File.OpenReadStream();
        var url = await _minioService.UploadFileAsync(
            stream,
            uniqueFileName,
            bucketName,
            req.File.ContentType
        );

        await SendAsync(new UploadImageResponse
        {
            Url = url,
            FileName = uniqueFileName
        }, cancellation: ct);
    }
}
```

## ⚛️ React Client Integration

### Install AWS SDK (S3-compatible)

```bash
cd Client
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Create MinIO Service

File: `Client/src/services/minioService.ts`

```typescript
import { API_CONFIG } from '../config/api'

export interface UploadResponse {
  url: string
  fileName: string
}

export const minioService = {
  async uploadFile(
    file: File,
    bucketType: 'listings' | 'avatars' | 'documents' = 'listings'
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('File', file)
    formData.append('BucketType', bucketType)

    const response = await fetch(`${API_CONFIG.baseURL}/api/files/upload`, {
      method: 'POST',
      body: formData,
      // Add Authorization header if needed
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // }
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },

  getPublicUrl(fileName: string, bucketName: string): string {
    return `http://localhost:9000/${bucketName}/${fileName}`
  }
}
```

### Example Usage in Component

```typescript
import { useState } from 'react'
import { minioService } from '../services/minioService'

function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await minioService.uploadFile(file, 'listings')
      setImageUrl(result.url)
      console.log('Uploaded:', result)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  )
}
```

## 🧪 Testing MinIO

### Test Upload via MinIO Console

1. Go to http://localhost:9001
2. Navigate to a bucket
3. Click **"Upload"** → **"Upload File"**
4. Select a file and upload
5. File should appear in the bucket

### Test via API (cURL)

```bash
# Upload a file
curl -X POST http://localhost:5030/api/files/upload \
  -F "File=@/path/to/image.jpg" \
  -F "BucketType=listings"

# Access uploaded file (if public)
curl http://localhost:9000/listings-images/filename.jpg
```

### Test via Browser

After uploading, access the file directly:
```
http://localhost:9000/listings-images/your-file-name.jpg
```

## 🔍 Useful Commands

### MinIO Client (mc) Commands

Install MinIO Client:
```bash
# Windows (via Chocolatey)
choco install minio-client

# Linux/Mac
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
```

Configure alias:
```bash
mc alias set local http://localhost:9000 minioadmin minioadmin123
```

Common commands:
```bash
# List buckets
mc ls local

# List objects in bucket
mc ls local/listings-images

# Copy file to bucket
mc cp myimage.jpg local/listings-images/

# Download file
mc cp local/listings-images/myimage.jpg ./downloaded.jpg

# Remove file
mc rm local/listings-images/myimage.jpg

# Set public policy
mc anonymous set download local/listings-images
```

## 📊 Monitoring & Management

### Storage Metrics

Access metrics at: http://localhost:9001 → **Monitoring** → **Metrics**

View:
- Total storage used
- Number of objects
- API request rates
- Bandwidth usage

### Logs

View MinIO logs:
```bash
docker-compose logs -f minio
```

## 🛠️ Troubleshooting

### MinIO won't start
```bash
docker-compose down -v
docker-compose up -d minio
```

### Cannot access buckets
- Check bucket permissions in Console
- Verify bucket policy allows access
- Ensure correct endpoint in code

### Upload fails
- Check file size limits
- Verify bucket exists
- Check network connectivity
- Review application logs

### Files not accessible
- Check bucket is public or use presigned URLs
- Verify CORS settings if accessing from browser
- Check firewall/network settings

## 🔒 Production Considerations

### Security
- **Change default credentials** immediately
- Use strong, unique access keys for each application
- Enable SSL/TLS (set `UseSSL: true`)
- Implement proper bucket policies (least privilege)
- Use presigned URLs for temporary access
- Enable versioning for important buckets
- Set up bucket lifecycle policies

### Performance
- Use CDN in front of MinIO for static assets
- Enable compression for text files
- Implement image optimization before upload
- Consider multipart uploads for large files
- Set appropriate cache headers

### Backup & High Availability
- Set up MinIO replication
- Enable versioning on critical buckets
- Regular backups of MinIO data
- Use multiple nodes for high availability
- Monitor disk usage and set alerts

### Monitoring
- Set up Prometheus integration
- Configure alerts for storage capacity
- Monitor API performance
- Track upload/download rates
- Log access patterns

## 🌐 CORS Configuration

If accessing MinIO directly from browser, configure CORS:

```bash
# Using mc client
mc anonymous set-json local/listings-images <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"]
    }
  ]
}
EOF
```

Or in MinIO console under bucket settings.

## 📚 Additional Resources

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [MinIO .NET SDK](https://min.io/docs/minio/linux/developers/dotnet/minio-dotnet.html)
- [MinIO Client Guide](https://min.io/docs/minio/linux/reference/minio-mc.html)
- [AWS S3 API Compatibility](https://docs.min.io/docs/aws-sdk-for-dotnet-with-minio.html)
