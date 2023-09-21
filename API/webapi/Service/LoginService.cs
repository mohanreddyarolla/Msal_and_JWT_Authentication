using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;

namespace webapi.Service
{
    public class LoginService
    {
        public string HandleLogIn(string username, string password)
        {
            string secretKey = "5f67ab348ed1592038c37587c49a17f023e1b";
            string issuer = "your-issuer";
            string audience = "your-audience";
            int expiryInMinutes = 60;

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, username),
            // Add any additional claims as needed
            };

            // Create a security key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // Create a signing credential using the key and the algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the JWT token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                signingCredentials: creds
            );

            // Serialize the JWT token to a string
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
            return jwtToken;
        }
    }
}
