/**
 * Created by dunklesToast on 17.07.2017.
 */
const express = require('express');
const router = express.Router();
const Database = require('../Database');

router.get('/top/:count', function (req, res, next) {
    console.log('::TOP COUNT::');
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        res.sendStatus(400);
    } else {
        let resp = [];
        Database.getTopPlayers(count).then((top) => {
            for (let i = 0; i < top.length; i++) {
                resp.push({
                    kills: top[i].kills,
                    name: top[i].full,
                    username: top[i].username,
                    id: top[i].id
                })
            }
            res.json(resp);
        })
    }
});

router.get('/top', function (req, res, next) {
    console.log('::TOP PLAYER::');
    let resp = [];
    Database.getTopPlayer().then((top) => {
        for (let i = 0; i < top.length; i++) {
            resp.push({
                kills: top[i].kills,
                name: top[i].name,
                username: top[i].username,
                id: top[i].id
            })
        }
        res.json(resp);
    })
});

router.get('/usercount', function (req, res, next) {
    console.log('::USER COUNT::');
    Database.getUserCount().then((count) => {
        res.json({count: count});
    })
});

router.get('/start', function (req, res, next) {
    console.log('::START::');
    const d8 = new Date(1500757200000);
    res.json({start: d8})
});

router.get('/death', function (req, res, next) {
    console.log('::GET DEATH::');
    if (!req.session.user) res.redirect('/');
    else {
        console.log(req.session.rid);
        Database.isDeath(req.session.rid).then((death) => {
            res.json({death: death})
        }).catch((err) => {
            throw err;
        })
    }
});

router.post('/death', function (req, res, next) {
    console.log('::POST DEATH::');
    if (!req.session.user) res.redirect('/');
    else {
        console.log(':::::::::::::::::::');
        console.log('SETTING USER DEATH');
        console.log(':::::::::::::::::::');
        //current logged in already dead?
        const diedUserID = req.session.rid;
        const deathMessage = req.body.msg;
        const deathLocation = req.body.loc;

        Database.isDeath(diedUserID).then((dead) => {
            if (!dead) {
                Database.setDeath(diedUserID, true, deathMessage, deathLocation).then(() => {
                    Database.getUser(diedUserID).then((diedUserData) => {
                        Database.getMurdererFromID(diedUserID).then((murderer) => {
                            Database.setKilledBy(diedUserID, murderer[0].id).then(() => {
                                console.log('...........');
                                console.log(murderer);
                                console.log('...........');
                                Database.setVictimForID(murderer[0].id, diedUserData.victim).then(() => {
                                    Database.setKillsForID(murderer[0].id, parseInt(murderer[0].kills)+1).then(() => {
                                        Database.removeVictim(diedUserID).then(() => {
                                            Database.addKilledVictimToMurder(murderer[0].id, diedUserID).then(() => {
                                                Database.getAliveUsers().then((count) => {
                                                    if(count.length == 1) {
                                                        console.log('________________________');
                                                        console.log('_______GAME OVER________');
                                                        console.log('________________________');
                                                    }
                                                    res.sendStatus(200);
                                                });
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        });

        /*
         Database.isDeath(req.session.rid).then((death) => {
                    if (!death) {
                        //set current logged in user dead
                        Database.setDeath(req.session.rid, true, req.body.msg, req.body.loc).then(() => {
                            console.log('setted death');
                            //get its data
                            Database.getUser(req.session.rid).then((userData) => {
                                console.log('got user');
                                //get its victim
                                Database.getUser(userData.victim).then((victimData) => {
                                    console.log('got victim');
                                    Database.setVictimForID(victimData.id).then(() => {
                                        console.log('set new victim');
                                        console.log('-----------');
                                        console.log(victimData);
                                        console.log('-----------');
                                        console.log(victimData.kills++);
                                        Database.setKillsForID(victimData.id, victimData.kills++).then(() => {
                                            console.log('set kills 4 id');
                                            Database.setKilledBy(req.session.rid, victimData.id).then(() => {
                                                console.log('set killed by');
                                                Database.removeVictim(req.session.rid).then(() => {
                                                    Database.addKilledVictimToMurder(userData.victim ,req.session.rid)
                                                    console.log('removed victim');
                                                    res.sendStatus(200);
                                                })
                                            });
                                        })
                                    })
                                })
                            });
                        }).catch((err) => {
                            throw err;
                        })
                    } else {
                        res.sendStatus(451);
                    }
                });
         */
    }
});

router.get('/info/:id', (req, res, next) => {
    console.log('::INFO::');
    Database.getUser(req.params.id).then((userdata) => {
        res.json({
            death: userdata.death,
            death_loc: userdata.death_loc,
            death_msg: userdata.death_msg,
            death_time: userdata.death_time,
            full: userdata.full,
            killedBy: userdata.killed_by,
            kills: userdata.kills,
            username: userdata.username,
        })
    }).catch((err) => {
        res.sendStatus(404);
    })
});

router.get('/chronological', (req, res, next) => {
    Database.getChronologicalDeaths().then((deaths) => {
        let resp = [];
        for(let i = 0; i < deaths.length; i++){
            resp.push({
                death: deaths[i].death,
                death_loc: deaths[i].death_loc,
                death_msg: deaths[i].death_msg,
                death_time: deaths[i].death_time,
                full: deaths[i].full,
                killedBy: deaths[i].killed_by,
                kills: deaths[i].kills,
                username: deaths[i].username,
            })
        }
        res.json(resp);
    })
})

router.get('/if/you/read/this/you/are/maybe/reverse/engineering/this/shittie/software/btw/the/source/is/open/somewhere', (req, res, next) => {
    if (!req.session.user) res.redirect('/');
    else {
        Database.getVictimForID(req.session.rid).then((result) => {
            res.json({victim: result, omg: 'yes, its true. OMG'});
        })
    }
});

module.exports = router;