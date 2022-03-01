using System;
using AgencyManagement.Interfaces;
using AgencyManagement.Services;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Transactions;
using AgencyManagement.Data;
using AgencyManagement.Helpers;

namespace AgencyManagement.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
		{
			services.AddScoped<ITokenService, TokenService>();
			services.AddScoped<IUnitOfWork, UnitOfWork>();
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



// MOMENT PRZERWY - TELEFON DZWONI :) 