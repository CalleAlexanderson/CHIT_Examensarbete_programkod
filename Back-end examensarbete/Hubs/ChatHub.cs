using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Hubs;

public class ChatHub : Hub
{
    private readonly ChatDbContext _context;

    private readonly TempDb _shared;

    public ChatHub(TempDb shared, ChatDbContext context)
    {
        _shared = shared;
        _context = context;
    }

    public async Task JoinSpecificChatRoom(UserConnection conn)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conn.Chatroom);
        _shared.connections[Context.ConnectionId] = conn;
        var users = await _context.Users.ToListAsync();
        User? userSender = null;
        User? userReceiver = null;

        for (var i = 0; i < users.Count; i++)
        {
            if (users[i].Username == conn.Username)
            {
                userSender = users[i];
            }
            else if (users[i].Username == conn.Friend)
            {
                userReceiver = users[i];
            }
        }
        List<string> senderMessageArray = new List<string>();
        List<string> senderMessageTimesArray = new List<string>();
        List<string> receiverMessageArray = new List<string>();
        List<string> receiverMessageTimesArray = new List<string>();

        // hämtar alla meddelanden som skickats från användaren
        if (userSender != null)
        {
            var messages = from b in _context.DirectChatMessages
                           where b.SenderId.Equals(userSender.Id)
                           select b;

            foreach (var item in messages)
            {
                // ser till att bara meddelanden som skickats till perosner som chattas med skickas tillbaka

                if (item.Receiver?.Username == userReceiver?.Username && item.Sender?.Username == userSender?.Username)
                {
                    senderMessageArray.Add(item.MessageContent);
                    senderMessageTimesArray.Add(item.DatePosted.ToString());
                }
                
            }
        }

        // hämtar alla meddelanden som skickats till användaren
        if (userReceiver != null)
        {
            var messages = from b in _context.DirectChatMessages
                           where b.SenderId.Equals(userReceiver.Id)
                           select b;

            foreach (var item in messages)
            {
                // ser till att bara meddelanden som skickats till perosner som chattas med skickas tillbaka
                if (item.Sender?.Username == userReceiver?.Username && item.Receiver?.Username == userSender?.Username)
                {
                    receiverMessageArray.Add(item.MessageContent);
                    receiverMessageTimesArray.Add(item.DatePosted.ToString());
                }
            }
        }

        // skickar tillbaka meddelande historiken mellan användarna
        await Clients.Group(conn.Chatroom).SendAsync("ReceiveSenderStart", userSender?.Username, senderMessageArray, senderMessageTimesArray);
        await Clients.Group(conn.Chatroom).SendAsync("ReceiveReceiverStart", userReceiver?.Username, receiverMessageArray, receiverMessageTimesArray);
    }

    public async Task SendMessage(string msg, string sender, string receiver)
    {
        if (_shared.connections.TryGetValue(Context.ConnectionId, out UserConnection connection))
        {

            await Clients.Group(connection.Chatroom).SendAsync("ReceiveSpecificMessage", connection.Username, msg);

            var users = await _context.Users.ToListAsync();
            User? userSender = null;
            User? userReceiver = null;

            for (var i = 0; i < users.Count; i++)
            {
                if (users[i].Username == sender)
                {
                    userSender = users[i];
                }
                else if (users[i].Username == receiver)
                {
                    userReceiver = users[i];
                }
            }

            if (userReceiver != null && userSender != null)
            {
                DirectChatMessage directChatMessage = new DirectChatMessage
                {
                    Sender = userSender,
                    SenderId = userSender.Id,
                    Receiver = userReceiver,
                    ReceiverId = userReceiver.Id,
                    MessageContent = msg,
                    DatePosted = DateTime.Now,
                };

                _context.DirectChatMessages.Add(directChatMessage);
                await _context.SaveChangesAsync();
            }
        }
    }
}