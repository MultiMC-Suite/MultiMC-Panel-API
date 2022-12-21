# MultiMC-Panel-API

## api/token

### GET

*Check if a token is valid or not*.

**Need bearer**

Returned payload :

- **200**
    
    ```json
    {
        "userId": 0,
        "username": "username_1",
        "teamCode": "CODE"
    }
    ```
    
- **401**
    
    *Invalid token*
    

### POST

*Get a token from a username and a code (or password).*

URL settings :

- username
- code OR password

Returned payload :

- **200**
    
    ```json
    {
        "token": "token"
    }
    ```
    
- **400**
    
    *Missing URL setting*
    
- **401**
    
    *Invalid cpde or password*
    
- **404**
    
    *Username not found*
    

## api/users

### GET

*Get user list*

**Need bearer**

Returned payload :

- **200**
    
    ```json
    [
        {
            "userId": 0,
            "username": "username_1",
            "teamCode": "CODE"
        },
        {
            "userId": 1,
            "username": "usernam2",
            "teamCode": "CODE"
        }
    ]
    ```
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *No existing users*
    

## api/user/:id

### GET

*Get player infos from it’s id*

**Need bearer**

Returned payload :

- **200**
    
    ```json
    {
        "userId": 0,
        "username": "username_1",
        "teamCode": "CODE"
    }
    ```
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *User not found*
    

## api/teams

### GET

*Get all the teams*

**Need bearer**

Returned payload :

- **200**
    
    ```json
    [
        {
            "teamName": "Team Name 1",
            "teamCode": "CODE1",
            "score": 2,
            "ownerId": 0,
            "members": [
                1,
                2,
                3
            ]
        },
        {
            "teamName": "Team Name 2",
            "teamCode": "CODE2",
            "score": 5,
            "ownerId": 4,
            "members": [
                5,
                6,
                7
            ]
        }
    ]
    ```
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *Player is not in a team*
    

### POST

*Create a new team*

**Need bearer**

Sent payload :

```json
{
    "teamName": "Team Name"
}
```

Returned payload :

- **201**
    
    ```json
    {
        "teamName": "Team Name",
        "teamCode": "CODE",
        "ownerId": 0
    }
    ```
    
- **401**
    
    *Unauthorized*
    

## api/team/:code

### GET

*Get team infos*

**Need bearer**

Returned payload :

- **200**
    
    ```json
    {
        "teamName": "Team Name",
        "teamCode": "CODE",
        "score": 0,
        "ownerId": 0,
        "members": [
            1,
            2,
            3
        ]
    }
    ```
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *Team not found*
    

## api/team/member

### DELETE

*Remove a member from his team*

**Need bearer + need to be team owner**

URL settings :

- memberId

Returned payload :

- **204**
    
    *Player removed from the team*
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *Member not in the team*
    

## api/team/score

### PUT

*Update team score*

**Need bearer + permission “score.update”**

URL settings :

- teamCode
- score

Returned payload :

- **200**
    
    ```json
    {
        "teamName": "Team Name",
        "teamCode": "CODE",
        "score": 0,
        "ownerId": 0,
        "members": [
            1,
            2,
            3
        ]
    }
    ```
    
- **401**
    
    *Unauthorized*
    
- **403**
    
    *Missing permission “score.update”*
    
- **404**
    
    *Team not found*
    

## api/notification

### GET

*Get all notifications sent to a member*

**Need bearer**

URL Settings :

- userId

Returned payload :

- **200**
    
    ```json
    [
        {
            "notificationId": 0,
            "senderId": 0,
            "receiverId": 1,
            "notificationType": "info",
            "content": {
                "message": "Hello World 1"
            },
            "state": null
        },
        {
            "notificationId": 1,
            "senderId": 0,
            "receiverId": 1,
            "notificationType": "choice",
            "content": {
                "message": "Player 0 invited you to it's team"
            },
            "state": "waiting"
        }
    ]
    ```
    
- **204**
    
    *User found, but no notifications*
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *User not found*
    

### POST

*Create a new notification to a player*

**Need bearer**

Sent payload :

```json
{
    "notificationId": 0,
    "senderId": 0,
    "receiverId": 0,
    "notificationType": "info",
    "content": {
        "message": "Hello World"
    },
    "state": null
}
```

Returned payload :

- **204**
    
    *Notification created*
    
- **401**
    
    *Unauthorized*
    

## api/notification/accept

### **POST**

*Do an action in API side, depending of the notification’s type and content*

**Need bearer**

URL settings :

- notificationId

Returned payload :

- **204**
    
    *Notification accepted*
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *Notification not found*
    

## api/notification/decline

### **POST**

*Do an action in API side, depending of the notification’s type and content*

**Need bearer**

URL settings :

- notificationId

Returned payload :

- **204**
    
    *Notification declined*
    
- **401**
    
    *Unauthorized*
    
- **404**
    
    *Notification not found*