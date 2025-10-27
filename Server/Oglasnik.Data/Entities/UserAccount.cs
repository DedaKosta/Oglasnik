using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Oglasnik.Data.Entities;

public class UserAccount : Base
{
	[Required]
	[MaxLength(50)]
	public string FirstName { get; set; }
	[Required]
	[MaxLength(50)]
	public string LastName { get; set; }
	[Required]
	[MaxLength(50)]
	[EmailAddress]
	public string Email { get; set; }
	[Required]
	[MaxLength(100)]
	public string KeycloakUserId { get; set; }
	public string? PasswordHash { get; set; }
	public long RoleId { get; set; }
	public Role Role { get; set; }
}
