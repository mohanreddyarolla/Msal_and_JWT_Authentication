using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace webapi
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }


        public async Task Invoke(HttpContext context)
        {
            string authorizationHeader = context.Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorizationHeader))
            {
                // Handle unauthorized access
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            string token = authorizationHeader.Substring("Bearer ".Length).Trim();

            // Determine the token type (JWT or MSAL access token)
            /* if (IsJwtToken(token))
             {
                 // Validate and authenticate the user based on JWT token
                 if (!ValidateJwtToken(token))
                 {
                     // Handle invalid JWT token
                     context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                     return;
                 }

                 // You can authenticate the user here using your own logic
                 // ...
             }
             else if (IsMsalAccessToken(token))
             {
                 // Validate and authenticate the user based on MSAL access token
                 if (!ValidateMsalAccessToken(token))
                 {
                     // Handle invalid MSAL access token
                     context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                     return;
                 }

                 // You can authenticate the user here using your own logic
                 // ...
             }
             else
             {
                 // Handle unsupported token type
                 context.Response.StatusCode = StatusCodes.Status400BadRequest;
                 return;
             }*/

            context.Response.StatusCode = StatusCodes.Status200OK;
            // Continue processing the request if authentication is successful
            await _next(context);
        }
    }
}
