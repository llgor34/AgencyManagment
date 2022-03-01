using System.Threading.Tasks;
using AgencyManagement.Entities;

namespace AgencyManagement.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}