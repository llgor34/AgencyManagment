using Microsoft.AspNetCore.Identity;

namespace AgencyManagement.Entities
{
	public class AppUser : IdentityUser<int>
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
	}
}