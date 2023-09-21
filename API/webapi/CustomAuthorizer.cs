using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens; 
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using Azure.Core;

namespace webapi
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CustomAuthorizer : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            string loginType = context.HttpContext.Request.Headers["loginType"].ToString();


            if(loginType == "microsoft")
            {
                await HandleMicrosoftLogIn(context);

            }
            else if (loginType == "normal")
            {
                 HandleNormalLogin(context); return;
            }
            else
            {
                context.Result = new Microsoft.AspNetCore.Mvc.BadRequestResult();
                return;
            }     

        }

        public async Task HandleMicrosoftLogIn(AuthorizationFilterContext context)
        {
            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                "https://login.microsoftonline.com/{865cc515-a530-4538-8ef8-072b7b2be759}/v2.0/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever());

            var openIdConfig = await configurationManager.GetConfigurationAsync(context.HttpContext.RequestAborted);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = "https://sts.windows.net/865cc515-a530-4538-8ef8-072b7b2be759/",
                ValidAudience = "api://f7c8a089-a6be-4568-8420-82624daee35a",
                IssuerSigningKeys = openIdConfig.SigningKeys
            };

            var accessToken = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken validatedToken;

                var claimsPrincipal = await Task.Run(() =>
                {
                    tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out validatedToken);
                    return tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out validatedToken);
                });

            }
            catch (SecurityTokenValidationException ex)
            {
                context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
            }
        }

        public async Task HandleNormalLogin(AuthorizationFilterContext context)
        {
            string secretKey = "5f67ab348ed1592038c37587c49a17f023e1b";

            string jwtToken = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "your-issuer", 
                ValidAudience = "your-audience", 
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.Zero 
            };

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken validatedToken;
                var claimsPrincipal = await Task.Run(() =>
                {
                    return tokenHandler.ValidateToken(jwtToken, tokenValidationParameters, out validatedToken);
                });
                //context.Result = new Microsoft.AspNetCore.Mvc.OkResult();


            }
            catch (Exception ex)
            {
                context.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
                return;
            }
        }
    }
}
