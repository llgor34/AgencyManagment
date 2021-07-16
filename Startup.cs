using System.Text.Json.Serialization;
using AgencyManagement.Extensions;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AgencyManagement
{
    public class Startup
	{
		private readonly IConfiguration _config;
		private readonly IWebHostEnvironment _env;
        public Startup(IConfiguration config, IWebHostEnvironment env)
		{
			_config = config;
			_env = env;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
		{
			services.AddApplicationServices(_config, _env);
			services.AddSingleton(typeof(IConverter),
			new SynchronizedConverter(new PdfTools()));
			services.AddControllers()
				.AddJsonOptions(opts =>
					{
						opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
					});
			services.AddCors();
			services.AddIdentityServices(_config);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

			app.UseCors(x =>
				x.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials()
				.WithOrigins("https://localhost:4200"));

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
