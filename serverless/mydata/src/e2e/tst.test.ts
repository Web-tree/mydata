'use strict';
// const {exec} = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


xdescribe('tst', () => {
    it('should ', done => {
        return exec('sls invoke local -f create -p .testEvents/create-event.json', (error, stdout, stderr) => {
            expect(error).toBeFalsy();
            expect(stdout).toContainEqual('"statusCode": 200');
            console.log(error, stdout, stderr);
            done();
        });

        // console.log(execSync('sls invoke local -f create -p .testEvents/create-event.json'));
    }, 20000);
});
// it('should test the output from a spawned process', async () => {
//     // this input will be executed by child_process.spawn
//     const input = ['sh', ['ls']]
//     const expectedOutput = {
//         code: 0,
//         signal: '',
//         stdout: 'Hello World\n',
//         stderr: '',
//     }
//     // the matcher is asynchronous, so it *must* be awaited
//     await expect(input).toHaveMatchingSpawnOutput(expectedOutput)
// })
