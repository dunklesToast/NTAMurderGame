/**
 * Created by dunklesToast on 16.07.2017.
 */
const depCreator = require('rethinkdb-tabel-deps');
const r = require('rethinkdbdash')();


/**
 *
 * @type {{create: module.exports.create, insertIntoMurder: (function(*=)), checkIfMailIsRegistered: (function(*)), checkIfUsernameIsRegistered: (function(*)), checkLoginUser: (function(*, *=)), checkLoginMail: (function(*, *=)), getTopPlayers: (function(*=)), getUserCount: (function()), getKillsForID: (function(*=)), setKillsForID: (function(*=, *=)), isDeath: (function(*=)), setDeath: (function(*=, *=, *=, *=)), getAllUsers: (function()), setVictimForID: (function(*=, *=)), getUser: (function(*=)), getVictimForID: (function(*=)), setKilledBy: (function(*=, *=)), removeVictim: (function(*=)), addURLToDNS: (function(*=, *=)), addDomainToDNS: (function(*=, *=))}}
 */
module.exports = {
    /**
     * create - this function creates the database, tables and indexes
     * @returns {Promise}
     */
    create: function () {
        console.log('::CREATE DATABASE::');
        return new Promise((rej, res) => {
            new depCreator({
                con_options: {},
                dbs: [
                    {
                        name: "murder",
                        tables: [
                            {
                                name: "userdata",
                                indexes: [
                                    {
                                        name: "userIndex",
                                    }
                                ]
                            },
                            {
                                name: "pairs",
                                indexes: [
                                    {
                                        name: "pairsIndex",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "dns",
                        tables: [
                            {
                                name: "url"
                            },
                            {
                                name: "domain"
                            }
                        ]
                    }
                ]
            }).doYourJob((err) => {
                console.log('::DID JOB (CREATE) (DB)::');
                if (err) rej(err);
                res()
            });
        })
    },
    /**
     * Inserts a new registered User to our database
     * @param userdata
     * @returns {Promise}
     */
    insertIntoMurder: (userdata) => {
        console.log('::INSERT INTO MURDER (DB)::');
        return new Promise((res, rej) => {
            userdata.username_lower = userdata.username.toLowerCase();
            userdata.mail_lower = userdata.mail.toLowerCase();
            userdata.death = false;
            userdata.killed_by = null;
            r.db('murder').table('userdata').insert(userdata).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        });
    },
    /**
     * Is the email - provided as String - already in use? resolve(true) -> in use; resolve(false) -> not in use
     * @param email
     * @returns {Promise}
     */
    checkIfMailIsRegistered: (email) => {
        console.log('::CHECK IF MAIL REGISTERED (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter({mail_lower: email.toString().toLowerCase()}).run().then((result) => {
                if (result[0]) {
                    res(true);
                } else {
                    res(false);
                }
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Is the username - provided as String - already in use? resolve(true) -> in use; resolve(false) -> not in use
     * @param username
     * @returns {Promise}
     */
    checkIfUsernameIsRegistered: (username) => {
        console.log('::CHECK IF USERNAME REGISTERED (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter({username_lower: username.toLowerCase()}).run().then((result) => {
                if (result[0]) {
                    res(true);
                } else {
                    res(false);
                }
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Check if Login with Username/Hash is correct
     * @param username
     * @param hash
     * @returns {Promise}
     */
    checkLoginUser: (username, hash) => {
        console.log('::CHECK LOGIN USER (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter(r.row('username_lower').eq(username.toLowerCase()).and(r.row('password').eq(hash))).run().then((result) => {
                if (result[0]) {
                    res(result[0]);
                } else {
                    res(false, null);
                }
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Check if Login with Mail/Hash is correct
     * @param mail
     * @param hash
     * @returns {Promise}
     */
    checkLoginMail: (mail, hash) => {
        console.log('::CHECK LOGIN MAIL (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter(r.row('mail_lower').eq(mail.toLowerCase()).and(r.row('password').eq(hash))).run().then((result) => {
                if (result[0]) {
                    res(result[0]);
                } else {
                    res(false, null);
                }
            }).catch((err) => {

                rej(err);
            })
        })
    },
    /**
     * Returns the <count> Top Players - count is more likely the amount of players
     * @param count
     * @returns {Promise}
     */
    getTopPlayers: (count) => {
        console.log('::TOP PLAYER (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').orderBy(r.desc('kills')).limit(count).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Returns User Amount
     * @returns {Promise}
     */
    getUserCount: () => {
        return new Promise((res, rej) => {
            console.log('::GET USER COUNT (DB)::');
            r.db('murder').table('userdata').run().then((result) => {
                res(result.length);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * See how many kills the user with ID <id> has
     * @param id
     * @returns {Promise}
     */
    getKillsForID: (id) => {
        console.log('::KILLS 4 ID (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).run().then((result) => {
                res(result[0].kills);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Set Kills for ID
     * @param id
     * @param newkills
     * @returns {Promise}
     */
    setKillsForID: (id, newkills) => {
        console.log('::SET KILLS 4 ID (DB)::');
        return new Promise((res, rej) => {
            console.log('new kills are: ' + newkills);
            r.db('murder').table('userdata').get(id).update({kills: newkills}).run().then((result) => {
                res(result[0]);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * User alive? - true if no, false if so
     * @param id
     * @returns {Promise}
     */

    //TODO Fix that bad english
    isDeath: (id) => {
        console.log('::IS DEATH (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).run().then((result) => {
                res(result.death);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Set user death
     * @param id
     * @param death - state, should be true because this is setDeath
     * @param msg - death Message
     * @param loc - Location
     * @returns {Promise}
     */
    setDeath: (id, death, msg, loc) => {
        console.log('::SET DEATH (DB)::');
        return new Promise((res, rej) => {
            console.log('SETTING DEATH: death: ' + true + ' :: MSG:' + msg + ' :: LOC: ' + loc);
            r.db('murder').table('userdata').get(id).update({
                death: death,
                death_msg: msg,
                death_loc: loc,
                death_time: r.now()
            }).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    addKilledVictimToMurder: (murderID, victimID) => {
        console.log('::addKilledVictimToMurder (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(murderID).update({killed: r.row('killed').append(victimID)}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Get all Users annd all Data
     * @returns {Promise}
     */
    getAllUsers: () => {
        console.log('::GET ALL USER (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Set users Victim
     * @param id
     * @param victimID
     * @returns {Promise}
     */
    setVictimForID: (id, victimID) => {
        console.log('::SET VICTIM FOR ID (DB)::');
        console.log(id);
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).update({victim: victimID}).run().then((result) => {
                res(result[0]);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Get user by ID
     * @param id
     * @returns {Promise}
     */
    getUser: (id) => {
        console.log('::GET USER (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Get Victim for user ID
     * @param id
     * @returns {Promise}
     */
    getVictimForID: (id) => {
        console.log('::GET VICTIM FOR ID (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).run().then((result) => {
                res(result.victim);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Set who killed our user
     * @param id
     * @param killedById
     * @returns {Promise}
     */
    setKilledBy: (id, killedById) => {
        console.log('::SET KILLED BY (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).update({killed_by: killedById}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Remove users victim - when user died
     * @param id
     * @returns {Promise}
     */
    removeVictim: (id) => {
        console.log('::REMOVE VICTIM (DB)::');
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').get(id).update({victim: null}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Add an URL to our Database
     * @param url - subdomain.domain.tld
     * @param ip - user IP
     * @returns {Promise}
     */
    addURLToDNS: (url, ip) => {
        return new Promise((res, rej) => {
            r.db('dns').table('url').insert({url: url, ip: ip, time: r.now()}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * Add a Domain to our Databse
     * @param domain - domain.tld
     * @param ip - user IP
     * @returns {Promise}
     */
    addDomainToDNS: (domain, ip) => {
        return new Promise((res, rej) => {
            r.db('dns').table('domain').insert({domain: domain, ip: ip, time: r.now()}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    /**
     * get the murderer from user id
     * @param id
     * @return {Promise}
     */
    getMurdererFromID: (id) => {
        console.log('::GET MURDERER FROM ID (DB)::');
        console.log(id);
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter(r.row('victim').eq(id)).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    getAliveUsers: () => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter({death: false}).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    getChronologicalDeaths: () =>{
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').orderBy(r.desc('death_time')).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    }
};