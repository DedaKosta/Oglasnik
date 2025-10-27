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
