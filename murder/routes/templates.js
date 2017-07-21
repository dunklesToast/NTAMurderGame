/**
 * Created by dunklesToast on 20.07.2017.
 */
const express = require('express');
const router = express.Router();
const session = require('express-session');

const Database = require('../Database');

router.get('/death', function (req, res, next) {
    if (!req.session.user) res.render('index');
    else {
        Database.isDeath(req.session.rid).then((death) => {
            if(!death) res.render('tmpl.death')

        });
    }
});

module.exports = router;
