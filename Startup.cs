using System;
using System.Text.Json.Serialization;
using AgencyManagement.Extensions;
using AgencyManagement.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AgencyManagement
{
	public class Startup
	{
		private readonly IConfiguration _config;
		private readonly IWebHostEnvironment _env;
		private string allowedOrigin;

		public Startup(IConfiguration config, IWebHostEnvironment env)
		{
			_config = config;
			_env = env;
			allowedOrigin = _config["AllowedOrigin"];
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddApplicationServices(_config, _env);
			services.AddControllers()
				.AddJsonOptions(opts =>
					{
						opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
					});
			services.AddCors();
			services.AddIdentityServices(_config);
			services.AddSignalR();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UsePathBase("/");
			var options = new ForwardedHeadersOptions
			{
				ForwardedHeaders = ForwardedHeaders.All
			};
			options.KnownNetworks.Clear();
			options.KnownProxies.Clear();
			app.UseForwardedHeaders(options);

			app.UseMiddleware<ExceptionMiddleware>();

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors(x =>
				x.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials()
				.WithOrigins(new string[] { allowedOrigin }));

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
