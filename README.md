# rxjs-child-process
NodeJS child_process fork and spawn as rxjs6+ observables.

[![NPM](https://nodei.co/npm/rxjs-child-process.png?compact=true)](https://npmjs.org/package/rxjs-child-process.png)


## Installation

```
npm install --save rxjs-child-process

// Or

yarn add rxjs-child-process
```

## spawn

```
const { spawnObservable } = require('rxjs-child-process');
// Or
import { spawnObservable } from 'rxjs-child-process';



spawnObservable('rm', ['-rf', '/var']).subscribe(
  msg => console.log(msg),
  err => console.err(err),
);
```

## fork

```
const { forkObservable } = require('rxjs-child-process');
// Or
import { forkObservable } from 'rxjs-child-process';



forkObservable('./script.js', ['--path', './some/path']).subscribe(
  msg => console.log(msg),
  err => console.err(err),
);
```
