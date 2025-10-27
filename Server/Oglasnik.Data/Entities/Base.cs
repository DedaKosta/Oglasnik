using System.ComponentModel.DataAnnotations;

namespace Oglasnik.Data.Entities;

public class Base
{
	[Key]
	public long Id { get; set; }
	[Required]
	public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;
	public DateTime? LastUpdatedOnUtc { get; set; }
	public DateTime? DeletedOnUtc { get; set; }
}
