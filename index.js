const { Observable } = require('rxjs');
const child_process = require('child_process');
const { Logger } = require('./logger');

/**
 * Spawns a child process and returns an observable.
 * The observable completes with an error when the 
 * child process errors or logs to stderr.
 * It emits data logged to stdout and completes when closed.
 * @param {string} command 
 * @param {string[]} args 
 * @param {SpawnOptionsWithoutStdio} options 
 */
function spawnObservable(command, args = [], options = {}) {
  const cmdStr = `${command} ${args.join(' ')}`;
  return new Observable((observer) => {
    const spawnee = child_process.spawn(command, args, options);
    Logger.log(`Running: ${cmdStr}`);

    spawnee.stdout.on('data', data => {
      Logger.log(`${data}`);
      observer.next(`${data}`);
    })

    spawnee.stderr.on('data', (data) => {
      Logger.error(`${data}`);
      observer.error(`${data}`);
    });

    spawnee.on('close', (code) => {
      if (code === 0) {
        Logger.log(`Successfully executed ${cmdStr}`);
        observer.complete();
      } else {
        Logger.error(`Failed with code ${code}: ${cmdStr}`);
        observer.error(`Failed with code ${code}: ${cmdStr}`)
      }
    });

    spawnee.on('error', (error) => {
      Logger.error(error);
      observer.error(new Error(`Child Process Error: 
      
      ${error}`
      ));
    });
  });
}

/**
 * Forks a child process and returns an observable.
 * The observable completes with an error when the child process emits an error.
 * It emits data emitted by message then completes.
 * @param {string} command 
 * @param {string[]} args 
 * @param {ForkOptions} options 
 */
function forkObservable(modulePath, args = [], options = {}) {
  const cmdStr = `${modulePath} ${args.join(' ')}`;
  return new Observable((observer) => {
    const forkee = child_process.fork(modulePath, args, options);
    Logger.log(`Running: ${cmdStr}`);
    console.log(child_process.fork);

    forkee.on('error', (error) => {
      Logger.error(`${error}`);
      observer.error(`${error}`);
    })

    forkee.on('message', data => {
      Logger.log(`${data}`);
      observer.next(`${data}`);
      observer.complete();
    })
  });
}

module.exports = {
  spawnObservable,
  forkObservable
};