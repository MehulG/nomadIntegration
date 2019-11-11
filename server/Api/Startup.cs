using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.OAuth;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

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

            string securityKey = Environment.GetEnvironmentVariable("SecurityKey");
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            services.AddSingleton<IMongoDBContext, MongoDBContext>();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllHeaders",
                        builder =>
                        {
                            builder.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowCredentials()
                                .AllowAnyHeader();
                        });
            });


            services.AddAuthentication(options => 
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "Github";
            })
            .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        //what to validate
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        //Setup Validate Data
                        ValidIssuer = "Codebit",
                        ValidAudience = "users",
                        IssuerSigningKey = symmetricSecurityKey
                    };
                })                
            .AddOAuth("Github", options =>
                {
                    options.ClientId = "f5205a5474e5815ef359";
                    options.ClientSecret = "6ff50db80005ac25d9332a816334364d90c4e206";
                    options.CallbackPath = new PathString("/account/callback");
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

                            var ctx = new MongoDBContext();
                            var userService = new UserService(context: ctx);
                            Console.WriteLine("------------------->" + context.AccessToken);
                            var _user = userService.GetUserByUsername(userObj.login.ToString());
                            if (_user == null)
                            {
                                var newUser = new User
                                {
                                    UserName = userObj.login,
                                    GithubAccessToken = context.AccessToken,
                                    GithubRefreshToken = context.RefreshToken
                                };
                                _user = userService.Create(newUser);
                            }
                            else
                            {
                                userService.UpdateAccessToken(_user.Id, context.AccessToken);
                            }




                            var claims = new List<Claim>();
                            claims.Add(new Claim(ClaimTypes.Role, "User"));
                            claims.Add(new Claim("id", _user.Id));


                            var _token = new JwtSecurityToken(
                                issuer: "Codebit",
                                audience: "users",
                                expires: DateTime.Now.AddDays(30),
                                claims: claims,
                                signingCredentials: signingCredentials
                            );

                            string token = new JwtSecurityTokenHandler().WriteToken(_token);


                            // context.HttpContext.Response.Cookies.Append("token", context.AccessToken);
                            context.HttpContext.Response.Cookies.Append("jwt", token);

                        },
                        OnTicketReceived = context =>
                        {
                            // I have fixed my claim here 
                            return Task.CompletedTask;
                        }
                    };
                })
                .AddCookie();


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
            // app.UseAuthorization();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseMvc();
            app.UseMvcWithDefaultRoute();

            app.UseSwagger();
            //app.UseSwaggerUI();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
        }
    }
}
