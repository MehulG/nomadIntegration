using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.OAuth;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using dotnet.DataContext;
using dotnet.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

using System.Net.Http;
using System.Net.Http.Headers;
using Identity.ExternalClaims.Data;
using Newtonsoft.Json;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // if (System.Environment.GetEnvironmentVariables("ASPNETCORE_ENVIRONMENT") == "Development")


            // var securityKey = Configuration["securityKey"];
           // string securityKey = "This_is_securityKey";
            //var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //    .AddJwtBearer(options =>
            //    {
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //           //what to validate
            //           ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateIssuerSigningKey = true,
            //           //Setup Validate Data
            //           ValidIssuer = "admin",
            //            ValidAudience = "reader",
            //            IssuerSigningKey = symmetricSecurityKey
            //        };
            //    });

            // services.Configure<DatabaseSettings>(
            //     Configuration.GetSection(nameof(DatabaseSettings)));

            // services.AddSingleton<IDatabaseSettings>(sp =>
            //     sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);


            services.AddSingleton<IMongoDBContext, MongoDBContext>();

            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<IdentityDbContext>()
                    .AddDefaultTokenProviders();

            services.AddCors(options =>
           {
               options.AddPolicy("AllowAllHeaders",
                     builder =>
                     {
                         builder.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                     });
           });

            services.AddDbContext<IdentityDbContext>();
            services.AddScoped<DbContext>(sp => sp.GetService<IdentityDbContext>());

            services.AddAuthentication(options =>
            {
                options.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "GitHub";
            })
            .AddGitHub("Github", options =>
              {
                options.SaveTokens=true;
                  options.ClientId = "3fa0685e2551a20c0601";
                  options.ClientSecret = "61f60c6c756016aca9b485aba0ab4c81bbe93504";
                  options.CallbackPath = new PathString("/account/HandleExternalLogin");
                  options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
                  options.TokenEndpoint = "https://github.com/login/oauth/access_token";
                  options.ClaimsIssuer = "OAuth2-Github";
                  options.UserInformationEndpoint = "https://api.github.com/user";
                  options.SaveTokens = true;
                  options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                  options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                  options.ClaimActions.MapJsonKey("urn:github:login", "login");
                  options.ClaimActions.MapJsonKey("urn:github:url", "html_url");
                  options.ClaimActions.MapJsonKey("urn:github:avatar", "avatar_url");
                  options.Scope.Add("repo");
                 options.Events = new OAuthEvents
                  {
                      OnCreatingTicket = async context =>
                         {
                             var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                             request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                             request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

                             var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                             response.EnsureSuccessStatusCode();

                             var user = JObject.Parse(await response.Content.ReadAsStringAsync());
                            var userObj = JsonConvert.DeserializeObject<GithubUserResponse>(await response.Content.ReadAsStringAsync());

                             context.RunClaimActions(user);
                             
                            //  using (var ctx = new TokenDbContext())
                            //  {
                            //      ctx.TokenDb.Add(new Token { Email = "sanjay", access_Token = context.AccessToken });
                            //      ctx.SaveChanges();
                            //  }
                            var ctx = new MongoDBContext();
                            var userService = new UserService(context: ctx);
                             Console.WriteLine("------------------->",context.AccessToken);
                            var _user = userService.GetUserByUsername(userObj.login.ToString());
                            if(_user == null) {
                                var newUser = new User {
                                    UserName = userObj.login, 
                                    GithubAccessToken = context.AccessToken,
                                    GithubRefreshToken = context.RefreshToken 
                                };
                                userService.Create(newUser);
                            } else {
                                userService.UpdateAccessToken(_user.Id, context.AccessToken);
                            }
                         }
                  };
                
              })
            .AddCookie();

            services.AddSingleton<IAssignmentService, AssignmentService>()
                    .AddSingleton<IConfiguration>(Configuration);

            services.AddSingleton<IArticleService, ArticleService>()
                    .AddSingleton<IConfiguration>(Configuration);

            services.AddSingleton<IUserService, UserService>()
                    .AddSingleton<IConfiguration>(Configuration);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Swashbuckle.AspNetCore.Swagger.Info { Title = "My API", Version = "v1" });
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseCors("AllowAllHeaders");
            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseMvc();
            app.UseMvcWithDefaultRoute();
            app.UseAuthentication();
        
            app.UseSwagger();
            //app.UseSwaggerUI();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
        }
    }
}
