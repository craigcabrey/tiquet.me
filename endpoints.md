##### POST / repositiores
```
{
"name": owner/name
}  
```  

##### POST /repositories/:id/ticket  

```
{
  "title": title,
  "assignee": contributor_id,
  "body": body
}
```

##### POST /repositories/:id/tickets/:id/tickets
```
{
  "title": title,
  "assignee": contributor_id,
  "body": body
}
```

##### POST /repositories/:id/tickets/:id/comments
```
{
  "author":user
  "created": date,
  "updated": date.
  "body":body
}
```

##### PUT /repositories/

##### PUT / repositories/:id
```
{
"tags": [{
    "name": name,
    "color": color
}]
}
```

##### PUT /repositories/:id/tickets/:id/tickets
```
{
  "title": title,
  "assignee": contributor_id,
  "body": body
}
```
##### GET /repositories
```
[
  {
    "name": repo_name,
    "contributors": [
      {
        "name": full_name,
        "email": email,
        "id":   id
      },
    ],
    "tickets": [
      {
        "state": open/closed 
        "title": title
        "assignee": user,
        "reporter": user,
        "body": body,
        "tickets": -- ticket
        "tags": [
          {
            "name": name
            "color": color
          }
        ],
      }
    ],
    "tags": [
      {
        "name": name,
        "color": color
    }
    ]
  }
]
```
