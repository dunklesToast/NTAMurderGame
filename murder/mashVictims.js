/**
 * Created by dunklesToast on 19.07.2017.
 */
const Database = require('./Database');

Database.getAllUsers().then((users) => {
    /*  console.log('Normal:');
     console.log('----------------');
     for(let i = 0; i < users.length; i++) console.log(i + ' : ' + users[i].full);
     console.log('----------------');
     let shuffled = shuffle(users);
     console.log('Mashed:');
     console.log('----------------');
     for(let i = 0; i < shuffled.length; i++) console.log(i + ' : ' + shuffled[i].full);
     console.log('----------------');
     */
    let shuffled = shuffle(users);

    let pairs = [];
    for (let p = 0; p <= shuffled.length; p++) {
        //console.log('P: ' + p + ' - shuffled.length: ' + shuffled.length);
        //console.log(shuffled.length);
        //console.log(p + ' - ' + shuffled[p].full);
        if (p == shuffled.length-1) {
            pairs.push({
                murder: shuffled[p].full,
                victim: shuffled[0].full
            });
            Database.setVictimForID(shuffled[p].id, shuffled[0].id);
            console.log(shuffled[p].id + ' --> ' + shuffled[0].id + ' (LAST)');
            break;
        } else {
            pairs.push({
                murder: shuffled[p].full,
                victim: shuffled[p+1].full
            });
            Database.setVictimForID(shuffled[p].id, shuffled[p+1].id);
            console.log(shuffled[p].id + ' --> ' + shuffled[p+1].id);
        }
    }
    process.exit();
});
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a
}