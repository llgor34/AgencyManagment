using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgencyManagement.Interfaces;

namespace AgencyManagement.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        public UnitOfWork(DataContext context)
        {            
			_context = context;
        }

        public async Task<bool> Complete()
        {
			return await _context.SaveChangesAsync() >= 0;
        }

        public bool HasChanges()
        {
			_context.ChangeTracker.DetectChanges();
			var changes = _context.ChangeTracker.HasChanges();

			return changes;
        }
    }
}