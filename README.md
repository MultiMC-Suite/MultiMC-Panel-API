# MultiMC-Panel-API

## api/token

### GET

*Check if a token is valid or not*.

**Need bearer**

Returned payload :

- **200**

    ```json
    {
    	"id": 1,
    	"username": "root",
    	"groupId": 2,
    	"teamCode": null
    }
    ```

- **401**

  *Invalid token*


### POST

*Get a token from a username and a code (or password).*

Sent payload :

```json
{
    "username": "username",
    "code": "code"
}
OR
{
    "username": "username",
    "password": "password"
}
```

Returned payload :

- **200**

    ```json
    {
    	"user": {
    		"id": 1,
    		"username": "root",
    		"groupId": 2,
    		"teamCode": null
    	},
    	"token": "token"
    }
    ```

- **400**

  *Missing parameters*

- **401**

  *Invalid code or password*

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


### POST

*Create a new user*

Sent payload :

```json
{
    "username": "username",
    "code": "code"
}
OR
{
    "username": "username",
    "password": "password"
}
```

Returned payload :

- **200**

    ```json
    {
    	"id": 2,
    	"username": "test",
    	"groupId": 1,
    	"teamCode": null,
    	"token": "token"
    }
    ```

- **400**

  *Missing body part*

- **409**

  *Username already used*


## api/user/:id

### GET

*Get player infos from it’s id*

**Need bearer**

Returned payload :

- **200**

    ```json
    {
    	"id": 1,
    	"username": "root",
    	"groupId": 2,
    	"teamCode": null
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

URL settings :

- complete : *Can be “id” or “users”, and add more things (like members) to be added*

Returned payload :

- **200**

    ```json
    [
    	{
    		"code": "GW7G7",
    		"name": "test",
    		"score": 0,
    		"ownerId": 1
    	}
    ]
    OR
    [
    	{
    		"code": "Q7ITI",
    		"name": "test",
    		"score": 0,
    		"ownerId": 1,
    		"members": [
    			2
    		]
    	}
    ]
    OR
    [
    	{
    		"code": "Q7ITI",
    		"name": "test",
    		"score": 0,
    		"ownerId": 1,
    		"owner": {
    			"id": 1,
    			"username": "root"
    		},
    		"members": [
    			{
    				"id": 2,
    				"username": "test"
    			}
    		]
    	}
    ]
    ```

- **401**

  *Unauthorized*

- **404**

  *No teams found*


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
    	"score": 0,
    	"name": "test",
    	"code": "IFAIN3",
    	"ownerId": 1
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
    	"code": "SZFTQ",
    	"name": "test",
    	"score": 0,
    	"ownerId": 1
    }
    OR
    {
    	"code": "Q7ITI",
    	"name": "test",
    	"score": 0,
    	"ownerId": 1,
    	"members": [
    		2
    	]
    }
    OR
    {
    	"code": "Q7ITI",
    	"name": "test",
    	"score": 0,
    	"ownerId": 1,
    	"owner": {
    		"id": 1,
    		"username": "root"
    	},
    	"members": [
    		{
    			"id": 2,
    			"username": "test"
    		}
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

- id

Returned payload :

- **204**

  *Player removed from the team*

- **401**

  *Unauthorized*

- **403**

  *User is not the team owner*

- **404**

  *Member not in the team*


## api/team/score

### POST

*Update team score*

**Need bearer + need password authentication**

Sent payload :

```json
{
	"teamCode": "code",
	"newScore": 10
}
```

Returned payload :

- **200**

    ```json
    {
    	"message": "Score updated"
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

Returned payload :

- **200**

    ```json
    [
    	{
    		"id": 1,
    		"type": "info",
    		"jsonContent": {
    			"message": "Message content"
    		},
    		"senderId": null,
    		"receiverId": 1
    	}
    ]
    ```

- **401**

  *Unauthorized*

- **404**

  *No notices found*


### POST

*Create a new notification to a player*

**Need bearer**

Sent payload :

```json
{
	"targetId": 2,
	"type": "info",
	"content": {
		"message": "Message content"
	}
}
```

Returned payload :

- **201**

    ```json
    {
    	"id": 1,
    	"senderId": 1,
    	"receiverId": 2,
    	"type": "info",
    	"jsonContent": {
    		"message": "Message content"
    	}
    }
    ```

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