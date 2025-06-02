using Microsoft.EntityFrameworkCore;
using Backend.Models;
namespace Backend.Data;

public class ChatDbContext : DbContext {
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) 
    {}

    public DbSet<User> Users {get; set;}
    public DbSet<Friend> Friends {get; set;}
    public DbSet<FriendRequest> FriendRequests {get; set;}
    public DbSet<DirectChatMessage> DirectChatMessages {get; set;}
}
