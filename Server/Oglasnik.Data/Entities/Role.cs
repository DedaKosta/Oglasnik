using Oglasnik.Contracts.Enums;
using System.ComponentModel.DataAnnotations;

namespace Oglasnik.Data.Entities;

public class Role : Base
{
	[Required]
	public AccountTypes Name { get; set; }
}
