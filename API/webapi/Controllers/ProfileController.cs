using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace webapi.Controllers
{
    [CustomAuthorizer]
    [RequiredScope("read")]
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {

            
            var userData = new
            {
                Email = "yor email",

                // Other user data properties
            };

            return Ok(userData);

        }
    }
}
