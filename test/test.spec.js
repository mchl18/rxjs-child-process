const { expect } = require('chai');
const sinon = require('sinon');
const child_process = require('child_process');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { spawnObservable, forkObservable } = require('../index');
const { createSpawnMock } = require('./mock');
const { Logger } = require('../src/logger');
const { EventEmitter } = require('events');

describe('spawnObservable', () => {
  describe('stdout', () => {
    it('should print the process stdout', (done) => {
      const mock = createSpawnMock({ stdout: 'done' });
      sinon.stub(child_process, 'spawn').returns(mock);

      const subscription = spawnObservable('cmd').subscribe((res) => {
        expect(res).to.equal('done');
        done();
        subscription.unsubscribe();
        child_process.spawn.restore();
      });
    });
  });

  describe('stderr', () => {
    it('should print the process stderr', (done) => {
      const mock = createSpawnMock({ stderr: 'err' });
      const spy = sinon.spy(Logger, 'error');
      sinon.stub(child_process, 'spawn').returns(mock);

      const subscription = spawnObservable('cmd').subscribe(
        () => {},
        () => {
          expect(spy.called).to.equal(true);
          subscription.unsubscribe();
          child_process.spawn.restore();
          Logger.error.restore();
          done();
        }
      );
    });
  });
});

describe('forkObservable', () => {
  describe('on success', () => {
    it('should finish on message', (done) => {
      const mock = new EventEmitter();
      sinon.stub(child_process, 'fork').returns(mock);
      const spy = sinon.spy(Logger, 'log');

      const subscription = forkObservable('./foo.js').subscribe(() => {
        expect(spy.called).to.equal(true);
        subscription.unsubscribe();
        child_process.fork.restore();
        done();
      });

      mock.emit('message');
    });
  });

  describe('on error', () => {
    it('should finish on message', (done) => {
      const mock = new EventEmitter();
      sinon.stub(child_process, 'fork').returns(mock);
      const spy = sinon.spy(Logger, 'error');

      const subscription = forkObservable('./foo.js').subscribe(
        () => {},
        () => {
          expect(spy.called).to.equal(true);
          subscription.unsubscribe();
          child_process.fork.restore();
          done();
        }
      );

      mock.emit('error');
    });
  });
});
