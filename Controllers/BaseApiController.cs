using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgencyManagement.Controllers
{
	// [Authorize(Policy = "RequireAdminRole")]
	[ApiController]
	[Route("api/[controller]")]
	public class BaseApiController : ControllerBase
	{

	}
}