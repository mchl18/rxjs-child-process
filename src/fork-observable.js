const { Observable } = require('rxjs');
const child_process = require('child_process');
const { Logger } = require('./logger');

/**
 * Forks a child process and returns an observable.
 * The observable completes with an error when the child process emits an error.
 * It emits data emitted by message then completes.
 * @param {string} command 
 * @param {string[]} args 
 * @param {ForkOptions} options 
 */
export function forkObservable(modulePath, args = [], options = {}) {
  const cmdStr = `${modulePath} ${args.join(' ')}`;
  return new Observable((observer) => {
    const forkee = child_process.fork(modulePath, args, options);
    Logger.log(`Running: ${cmdStr}`);

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
