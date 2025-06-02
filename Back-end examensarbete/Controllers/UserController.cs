using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ChatDbContext _context;

        private readonly IConfiguration _configuration;

        public UserController(ChatDbContext context, IConfiguration configuration)
        {
            _context = context;
            // används för den gömda JWT key
            _configuration = configuration;
        }

        // GET: api/User
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/user/5
        [HttpPost("login/{username}/{password}")]
        public async Task<ActionResult<User>> Login(string username, string password)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
            }

            if (user == null)
            {
                return NotFound();
            }

            // kollar om lösenord är rätt
            if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                // skapar en JWT att skicka tillbaka 
                var token = GenerateJwtToken(user.Username);
                return Ok(new { token, user });
            }
            return NotFound();
        }

        // skapar en JWT
        private string GenerateJwtToken(string username)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // hämtar den gömda JWT key
            var apiKey = _configuration["JWTConfig:Key"];

            if (apiKey == null)
            {
                apiKey = "";
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(apiKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // skapar token att skicka tillbaka
            var token = new JwtSecurityToken(
                issuer: "http://localhost:5218",
                audience: "http://localhost:5173",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPut("{username}")]
        public async Task<IActionResult> PutUser(string username, UpdateUser updateUser)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;
            for (var i = 0; i < users.Count; i++)
            {
                if (username != users[i].Username)
                {
                    if (users[i].Username == updateUser.NewUsername)
                    {
                        return Conflict(new { message = "That username is already taken" });
                    }
                } else {
                    user = users[i];
                }
            }

            if (user != null)
            {
                // ändrar användarnamn och profilbild
                _context.Entry(user).State = EntityState.Modified;
                if (updateUser.NewUsername != username)
                {
                    user.Username = updateUser.NewUsername;
                }
                if (updateUser.Avatar != "")
                {
                    user.Avatar = updateUser.Avatar;
                }
            }
            else
            {
                return NotFound();
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

            }

            return Ok(new { user });
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            System.Console.WriteLine("funkar");
            
            var users = await _context.Users.ToListAsync();
            // kollar om Email och username redan är taget
            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Email == user.Email)
                {
                    return Conflict(new { message = "Email is already registered." });
                }
                else if (users[i].Username == user.Username)
                {
                    return Conflict(new { message = "Username is already taken." });

                }
            }

            // skapar det ID som ska användas för att lägga till vänner och skapa chattrum
            user.FriendId = Guid.NewGuid().ToString();
            // hashar lösenord med bcrypt
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            string placeholderAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAALFQTFRFAAAAAAABAQAA29vb2dnZ2dnZ2NjY2NjY2traAAEA39/f2dnZ2NjY2dnZ2dnZ2NjY6Ojo2tra2NjY2djZ2dnY2NnZ2dnZ2dnZ////2NjY2NnY29ra2tra2dnZ2NjY2NjY4+Lj2NnY////2dnZ2NjY2NjY2NjY2dnZ2NnZ2dnY2djY/v//2djZ///+4+Pj2dnZ2dnZ2NjY2dnZ2dnZ2dnZ2dnZ2NjZ2NnZ2NjZ2djY29rbm0h7ZQAAADt0Uk5TAAAAOJLH4PU3AAhy3//baQt05////4B+A52diIh4cOYJcAHi4cDY8PDw2AHiAQlkmVzpcWo9mMf19TiCvz2bAAABkUlEQVR4nGVTXUsCQRS9R9NdfVmtMMssCPoGo6D+/1tPYb0EEYSYWfpQGbG7ozDTzJ3Z3dGGhZ29X+ecu/eCzIEiKsEcUkqtpdpUkkS1BPplntC4sgMsYuPWN341tMF8VSGIQp1cEZVvdnN4K2EHVec2PUyD8sRmB0kbv9YkrJODwoqcSi7e+SmsVEREIy7eTeXcmgwqBZAQHNocanc9XOSMHLArsI4BaO9LZ4jiyYsHYnOAA0yXUD03Ioly3StYuFknxdidLdnDjCZ/RTj8IE90IEyeIQET18bRu4dXBRxKwNq2cTxeAc7Im5I7OHljt21kmgNxdrWFs9dVUR7NDabm6PiiLUp7WZjthpxnKBHKDV9oNhEuIsa5mGSknHTkQvbBv6QAW+5dcwjqzT6dyfTE70EljfU4XLz864nF6jzwKFryGducYDSW7C71RsIyssL4EnbuiWdNr8hWnFul625taqq4LbnEczaKHNRVfd4s6EWiWqrqp0/eEh092iUqFgvqGuhf4U6pm1uzkUGqaskf0ba5lCN837kAAAAASUVORK5CYII=";
            user.Avatar = placeholderAvatar;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Account created" });
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPost("verify/{username}")]
        public async Task<ActionResult<User>> Verify(string username)
        {

            var users = await _context.Users.ToListAsync();
            User? user = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
            }

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new { user });
        }

        // DELETE: api/User/5
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpDelete("{username}/{password}")]
        public async Task<IActionResult> DeleteUser(string username, string password)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
            }

            if (user == null)
            {
                return NotFound();
            }

            // kollar så lösenord är korrekt så att andra inte kan ta bort ditt konto om du lämnar dig inloggad
            if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
