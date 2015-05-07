var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
      id: 1,
      name: "bettywhite/my_website",
      tickets: [
        {
          id: 1,
          state: "open",
          title: "Add FAQ page",
          updated: new Date(),
          assignee: {
            id: 1,
            name: "John Stamos",
            email: "jstamos@aol.com"
          },
          body: "I can answer your questions.",
          comments: [
            {
              author: {
                id: 1,
                name: "John Stamos",
                email: "jstamos@aol.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "This is beyond my expertise."
            },
            {
              author: {
                id: 2,
                name: "Betty White",
                email: "bwhite@aol.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "I believe in you, John."
            },
            {
              author: {
                id: 1,
                name: "John Stamos",
                email: "jstamos@aol.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "Thanks, Betty. I believe in me too."
            }
          ],
          tags: [
            {
              id: 1,
              name: "bug",
              color: "#FFFFF"
            },
            {
              id: 2,
              name: "feature",
              color: "#123456"
            }
          ]
        },
        {
          id: 2,
          state: "open",
          title: "Add SSL",
          updated: new Date(),
          assignee: {
            id: 1,
            name: "John Stamos",
            email: "jstamos@aol.com"
          },
          body: "We need some security.",
          comments: [
            {
              author: {
                id: 1,
                name: "John Stamos",
                email: "jstamos@aol.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "Nah, we good."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "bettywhite/my_todo_application",
      tickets: [
        {
          id: 3,
          state: "open",
          title: "Implement db",
          assignee: {
            id: 1,
            name: "John Stamos",
            email: "jstamos@aol.com"
          },
          body: "For putting data on the tables.",
          comments: [
            {
              author: {
                id: 1,
                name: "John Stamos",
                email: "jstamos@aol.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "I know how to build a table."
            }
          ]
        }
      ]
    }
  ]);
});

router.post('/', function(req, res, next) {
  res.json(req.body);
});

router.post('/:id/tickets/:ticketid/tickets', function(req, res, next) {
  res.json(req.body);
});

router.put('/:id', function(req, res, next) {
  req.json(req.body);
});

router.post('/:id/tickets/:ticketid/comments', function(req, res, next) {
  req.json(req.body);
});

module.exports = router;
