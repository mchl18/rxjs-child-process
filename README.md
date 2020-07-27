# rxjs-child-process
NodeJS child_process fork and spawn as rxjs observables.

## spawn

```
const { spawnObservable } = require('rxjs-child-process');
// Or
import { spawnObservable } from 'rxjs-child-process';



spawnObservable('rm -rf /var').subscribe(
  msg => console.log(msg),
  err => console.err(err),
);
```

## fork

```
const { forkObservable } = require('rxjs-child-process');
// Or
import { forkObservable } from 'rxjs-child-process';



forkObservable('./script.js').subscribe(
  msg => console.log(msg),
  err => console.err(err),
);
```
