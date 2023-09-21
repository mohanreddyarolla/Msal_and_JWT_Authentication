using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using webapi.Models;
using webapi.Service;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogInController : ControllerBase
    {
        LoginService loginService;
        public LogInController() {
            loginService = new LoginService();
        }


        [HttpPost]
        public ActionResult logIn(LoginRequest loginRequest)
        {
            return Ok(JsonSerializer.Serialize(loginService.HandleLogIn(loginRequest.userName, loginRequest.password)));
        }
    }
}
