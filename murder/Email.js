/**
 * Created by dunklesToast on 16.07.2017.
 */
const depCreator = require('rethinkdb-tabel-deps');
const r = require('rethinkdbdash')();

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
            r.db('murder').table('userdata').insert(userdata).run().then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            })
        });
    },
    checkIfMailIsRegistered: (email) => {
        return new Promise((res, rej) => {
            r.db('murder').table('userdata').filter({email: email}).run().then((res) => {
                if(res[0]){
                    res(true);
                }else {
                    res(false);
                }
            }).catch((err) => {
                rej(err);
            })
        })
    }
};