using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using NuGet.Protocol.Plugins;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public FriendController(ChatDbContext context)
        {
            _context = context;
        }

        // GET: api/Friend/5
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<IEnumerable<Friend>>> GetFriends(string username)
        {
            var friends = await _context.Friends.ToListAsync();
            var users = await _context.Users.ToListAsync();
            User? user = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
            }

            List<Friend> myFriends = new List<Friend>();

            for (var i = 0; i < friends.Count; i++)
            {
                if (friends[i].FirstUser?.Username == user?.Username || friends[i].SecondUser?.Username == user?.Username)
                {
                    myFriends.Add(friends[i]);
                }
            }

            return myFriends;
        }

        // GET: api/Friend/Requests/5
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpGet("requests/{username}")]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> GetFriendRequests(string username)
        {
            var Requests = await _context.FriendRequests.ToListAsync();
            var users = await _context.Users.ToListAsync();
            User? user = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
            }
            List<FriendRequest> myFriendRequestss = new List<FriendRequest>();

            for (var i = 0; i < Requests.Count; i++)
            {
                if (Requests[i].Receiver?.Username == user?.Username)
                {
                    myFriendRequestss.Add(Requests[i]);
                }
            }

            return myFriendRequestss;
        }

        // POST: api/Friend
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPost("{username}/{friendUsername}")]
        public async Task<ActionResult<Friend>> PostFriend(Friend newFriend, string username, string friendUsername)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;
            User? friend = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
                else if (users[i].Username == friendUsername)
                {

                    friend = users[i];
                }
            }
            if (user != null && friend != null)
            {
                var friends = await _context.Friends.ToListAsync();

                for (var i = 0; i < friends.Count; i++)
                {
                    if (friends[i].FirstUserId == user.Id || friends[i].SecondUserId == user.Id)
                    {
                        if (friends[i].FirstUserId == friend.Id || friends[i].SecondUserId == friend.Id)
                        {
                            return Conflict(new { message = "Friend already exists" });
                        }
                    }
                }
                newFriend.FirstUser = user;
                newFriend.FirstUserId = user.Id;
                newFriend.SecondUser = friend;
                newFriend.SecondUserId = friend.Id;
            }
            else
            {
                return NotFound();
            }
            await DeleteFriendRequests(username, friendUsername);
            _context.Friends.Add(newFriend);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend added" });
        }

        // POST: api/Friend/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPost("requests/{username}/{friendUsername}")]
        public async Task<ActionResult<Friend>> PostFriendRequest(FriendRequest newRequest, string username, string friendUsername)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;
            User? friend = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
                else if (users[i].Username == friendUsername)
                {

                    friend = users[i];
                }
            }

            if (user != null && friend != null)
            {
                var friends = await _context.Friends.ToListAsync();

                for (var i = 0; i < friends.Count; i++)
                {
                    if ((friends[i].FirstUserId == user.Id || friends[i].SecondUserId == user.Id) && (friends[i].FirstUserId == friend.Id || friends[i].SecondUserId == friend.Id))
                    {
                        return Conflict(new { message = "Friend already exists" });
                    }
                }

                var friendsRequests = await _context.FriendRequests.ToListAsync();
                for (var i = 0; i < friendsRequests.Count; i++)
                {
                    if (friendsRequests[i].SenderId == user.Id && friendsRequests[i].ReceiverId == friend.Id)
                    {
                        return Conflict(new { message = "Friend request already exists" });
                    }
                }
                newRequest.Sender = user;
                newRequest.SenderId = user.Id;
                newRequest.Receiver = friend;
                newRequest.ReceiverId = friend.Id;
            }
            else
            {
                return NotFound(new { message = "User dosent exist" });
            }

            _context.FriendRequests.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request sent" });
        }

        // DELETE: api/Friend/5
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpDelete("{username}/{friendUsername}")]
        public async Task<IActionResult> DeleteFriend(string username, string friendUsername)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;
            User? friend = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
                else if (users[i].Username == friendUsername)
                {

                    friend = users[i];
                }
            }

            var friends = await _context.Friends.ToListAsync();
            Friend? removeFriend = null;

            for (var i = 0; i < friends.Count; i++)
            {
                if (friends[i].FirstUserId == user?.Id && friends[i].SecondUserId == friend?.Id)
                {
                    removeFriend = friends[i];
                }
                else if (friends[i].FirstUserId == friend?.Id && friends[i].SecondUserId == user?.Id)
                {
                    removeFriend = friends[i];
                }
            }

            if (removeFriend == null)
            {
                return NotFound();
            }

            _context.Friends.Remove(removeFriend);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpDelete("requests/{username}/{friendUsername}")]
        public async Task DeleteFriendRequests(string username, string friendUsername)
        {
            var users = await _context.Users.ToListAsync();
            User? user = null;
            User? friend = null;
            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == username)
                {
                    user = users[i];
                }
                else if (users[i].Username == friendUsername)
                {

                    friend = users[i];
                }
            }

            var friendRequests = await _context.FriendRequests.ToListAsync();
            List<FriendRequest> removeFriend = new List<FriendRequest>();

            for (var i = 0; i < friendRequests.Count; i++)
            {
                if (friendRequests[i].SenderId == user?.Id && friendRequests[i].ReceiverId == friend?.Id)
                {
                    removeFriend.Add(friendRequests[i]);
                }
                else if (friendRequests[i].ReceiverId == user?.Id && friendRequests[i].SenderId == friend?.Id)
                {
                    removeFriend.Add(friendRequests[i]);
                }
            }
            _context.FriendRequests.RemoveRange(removeFriend);
            await _context.SaveChangesAsync();
        }

        private bool FriendExists(int id)
        {
            return _context.Friends.Any(e => e.Id == id);
        }
    }
}
