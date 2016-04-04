
# NYU Competitive Programming Team Website

## Overview
This website serves to display team info, meeting schedule, submission tutorial and weekly/monthly/annually contest ranking. The first three parts above will be static pages built with front-end frameworks. The fourth part integrates API from popular online-judges. The fifth part integrates database. There are two types of users: one is team member and the other is coach. Team member is allowed to access contest ranking. Coach is allowed to add meeting notification and contest ID of [vjudge contest platform](http://acm.hust.edu.cn/vjudge/contest/toListContest.action) so that the results of programming team's weekly practice contests can be automatically integrated to the ranking database of this website.



## Data Model


Minimally, we'll have to store Users, Contest, Member and Notification.

* User has username, password and identity (member or coach).
* Contest has id and a ranking list, which contains the name and scores of all participants of a certain contest. The contest data is retrieved from [vjudge contest platform](http://acm.hust.edu.cn/vjudge/contest/toListContest.action).
* Member has name and score gathered from all contests.
* Notification has title, content and author.

First draft schema:

```javascript
// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
var User = new mongoose.Schema({
  // username, password provided by plugin
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// an item (or group of the same items) in a grocery list
// * includes the quantity of this item (multiple of the same item does not 
//   require additional Item documents; just increase the quantity!)
// * items in a list can be crossed off
var Item = new mongoose.Schema({
	name: {type: String, required: true},
	quantity: {type: Number, min: 1, required: true},
	checked: {type: Boolean, default: false, required: true}
}, {
	_id: true
});

// a grocery list
// * each list must have a related user
// * a list can have 0 or more items
var List = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
	createdAt: {type: Date, required: true},
	items: [Item]
});
```

## Wireframes

![list create](documentation/list-create.png)

## Reserach Topics



* (3 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (2 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (2 points) use awesome js library that i found
    * the library does...
    * you can see it working in these pages:
        * link 1
        * link 2
* ... for total of 6 points 
    * additional points of research will make up for research topics that did not get full credit
    * but won't count for extra credit
