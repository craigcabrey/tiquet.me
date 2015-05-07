var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
      id: 1,
      name: "vegetable/potato",
      contributors: [
        {
          id: 1,
          name: "one potato",
          email: "one@potato.com"
        },
        {
          id: 2,
          name: "two potato",
          email: "two@potato.com"
        }
      ],
      tickets: [
        {
          id: 1,
          state: "open",
          title: "first ticket",
          updated: new Date(),
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          reporter: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken",
          comments: [
            {
              author: {
                id: 1,
                name: "one potato",
                email: "one@potato.com"
              },
              created: new Date(),
              updated: new Date(),
              body: "shit sucks"
            }
          ],
          tickets: [
            {
              state: "open",
              title: "first ticket",
              assignee: {
                id: 1,
                name: "one potato",
                email: "one@potato.com"
              },
              reporter: {
                id: 1,
                name: "one potato",
                email: "one@potato.com"
              },
              body: "shit's broken",
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
          state: "closed",
          title: "first ticket",
          updated: new Date(),
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          reporter: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken",
          comments: [],
          tickets: [
            {
              state: "open",
              title: "first ticket",
              assignee: {
                id: 1,
                name: "one potato",
                email: "one@potato.com"
              },
              reporter: {
                id: 1,
                name: "one potato",
                email: "one@potato.com"
              },
              body: "shit's broken",
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
        }
      ]
    },
    {
      id: 2,
      name: "test/testy",
      tickets: [
        {
          id: 3,
          state: "open",
          title: "first ticket",
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken"
        },
        {
          id: 4,
          state: "closed",
          title: "first ticket",
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          reporter: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken"
        },
        {
          id: 5,
          state: "closed",
          title: "first ticket",
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          reporter: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken"
        },
        {
          id: 6,
          state: "closed",
          title: "first ticket",
          assignee: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          reporter: {
            id: 1,
            name: "one potato",
            email: "one@potato.com"
          },
          body: "shit's broken"
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
