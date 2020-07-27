const EventEmitter = require('events');
const { Readable, Writable } = require('stream');
const { emit } = require('process');

createSpawnMock = ({
  stdout,
  stderr,
}) => {
  const spawnEvent = new EventEmitter();

  spawnEvent.stdin = new Writable({
    write(data, enc, callback) {
      callback()
    },

    final(callback) {
      spawnEvent.emit('close')
    }
  });

  spawnEvent.stdout = new Readable({
    read() {
      if (stdout) {
        this.push(stdout)
      }

      this.push(null)
    }
  });

  spawnEvent.stderr = new Readable({
    read() {
      if (stderr) {
        this.push(stderr)
      }

      this.push(null)
    }

  });
  return spawnEvent;
}


module.exports = {
  createSpawnMock,
}