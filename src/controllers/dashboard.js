const express = require('express');


module.exports.wrongAdress = (req, res) => {
    res.send('Page not found');
}

module.exports.renderHomePage= (req, res) => {
  // console.log(req.isAuthenticated());
  // res.locals.userid= req.session.passport.id
  console.log('Data of req.user', req.user);
  // console.log(  res.locals.userid);
  res.render("home.ejs");

};

