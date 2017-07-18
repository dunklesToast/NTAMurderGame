/**
 * Created by dunklesToast on 16.07.2017.
 */
const depCreator = require('rethinkdb-tabel-deps');
const r = require('rethinkdbdash')();

/*
 r.db('murder').table('userdata').indexCreate('killDex',[r.row('username'), r.row('kills')]);
 */

module.exports = {
    create: function () {
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
                if (err) rej(err);
                res()
            });
        })
    },
    insertIntoMurder: (userdata) => {
        return new Promise((res, rej) => {
            userdata.username_lower = userdata.username.toLowerCase();
            r.db('murder').table('userdata').insert(userdata).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        });
    },
    checkIfMailIsRegistered: (email) => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter({mail: email.toString().toLowerCase()}).run().then((result) => {
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
    checkIfUsernameIsRegistered: (username) => {
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
    checkLoginUser: (username, hash) => {
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
    checkLoginMail: (mail, hash) => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter(r.row('mail').eq(mail).and(r.row('password').eq(hash))).run().then((result) => {
                if (result[0]) {
                    res(result[0]);
                } else {
                    res();
                }
            }).catch((err) => {
                rej(err);
            })
        })
    },
    getTopPlayers: (count) => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').orderBy(r.desc('kills')).limit(count).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        })
    },
    getUserCount: () => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').run().then((result) => {
                res(result.length);
            }).catch((err) => {
                rej(err);
            })
        })
    }
};