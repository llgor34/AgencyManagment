using System.Threading.Tasks;

namespace AgencyManagement.Interfaces
{
	public interface IUnitOfWork
	{
		Task<bool> Complete();
		bool HasChanges();
	}
}