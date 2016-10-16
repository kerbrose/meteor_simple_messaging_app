import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    // start up script that creates some users for testing
    // users have the username 'user1@test.com' .. 'user8@test.com'
    // and the password test123 

  Meteor.startup(function () {
    if (!Meteor.users.findOne()){
      for (var i=1;i<9;i++){
        var email = "user"+i+"@test.com";
        var username = "user"+i;
        var avatar = "ava"+i+".png"
        console.log("creating a user with password 'test123' and username/ email: "+email);
        Meteor.users.insert({profile:{username:username, avatar:avatar}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
      }
    } 
  });

  //Publish
  Meteor.publish("users", function(){
    return Meteor.users.find();
  });
  Meteor.publish("chats", function(){
    // if (Meteor.user()){
    //   // var filter = {$or:[
    //   //   {user1Id:this.userId(), user2Id:otherUserId}, 
    //   //   {user2Id:this.userId(), user1Id:otherUserId}
    //   //   ]};
    // return Chats.find();
    // }
    return Chats.find({$or:[
      {user1Id:this.userId},
      {user2Id:this.userId}
       ]});
  });

  // OnCreateUser adding avatar
  Accounts.onCreateUser(function(options, user) {
    if (user.gender=='m') {
      options.profile["avatar"] = "generic-male.png"
    } else {
      options.profile["avatar"] = "generic-female.png"
    }
    if (options.profile){
      user.profile = options.profile;
    }
    return user;
  });
});

Meteor.methods({
  insertNewChat: function(otherUserId) {
    Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
  },
  updateChats: function(id, chat) {
    Chats.update(id, chat);
  }
});