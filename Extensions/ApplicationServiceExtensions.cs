using AgencyManagement.Data;
using AgencyManagement.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AgencyManagement.Extensions
{
    public static class ApplicationServiceExtensions
    {
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
		{
			// services.AddScoped<ITokenService, TokenService>();
			// services.AddScoped<IReportService, ReportService>();
			// services.AddScoped<IUnitOfWork, UnitOfWork>();
			// services.AddScoped<IMailingService, MailService>();
			// services.AddScoped<ISettingsRepository, SettingsRepository>();
			// services.AddHostedService<QueuedHostedService>();
			// services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
			// services.AddSingleton<IScheduler, ScheduleTask>();
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			services.AddTransient<DataContext>();
			services.AddDbContext<DataContext>(options =>
			{
				string mySqlConnectionStr = config.GetConnectionString("DefaultConnection");
				options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr));
			}, ServiceLifetime.Transient);
			return services;
		}
    }
}